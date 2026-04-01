import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosError } from 'axios';
import { Counter, Histogram, register } from 'prom-client';

const llmCallsTotal = new Counter({
  name: 'assistant_llm_calls_total',
  help: 'Total LLM completion calls',
  labelNames: ['outcome'],
  registers: [register],
});

const llmLatencySeconds = new Histogram({
  name: 'assistant_llm_latency_seconds',
  help: 'LLM request latency in seconds',
  buckets: [0.1, 0.25, 0.5, 1, 2, 4, 8, 20],
  registers: [register],
});

export type LlmOutcome = 'success' | 'timeout' | 'error';

@Injectable()
export class LlmService {
  private readonly logger = new Logger(LlmService.name);

  constructor(private readonly config: ConfigService) {}

  isConfigured(): boolean {
    const key = this.config.get<string>('LLM_API_KEY');
    return Boolean(key?.trim());
  }

  /**
   * OpenAI-compatible chat completions. Returns assistant message content or null on failure.
   */
  async completeChat(params: {
    system: string;
    user: string;
    jsonMode?: boolean;
  }): Promise<{ content: string | null; outcome: LlmOutcome }> {
    const apiKey = this.config.get<string>('LLM_API_KEY')?.trim();
    const baseUrl =
      this.config.get<string>('LLM_BASE_URL')?.trim() ||
      'https://api.openai.com/v1';
    const model =
      this.config.get<string>('LLM_MODEL')?.trim() || 'gpt-4o-mini';
    const timeoutMs = Number(
      this.config.get<string>('LLM_TIMEOUT_MS') ?? 20000,
    );

    if (!apiKey) {
      return { content: null, outcome: 'error' };
    }

    const url = `${baseUrl.replace(/\/$/, '')}/chat/completions`;
    const body: Record<string, unknown> = {
      model,
      messages: [
        { role: 'system', content: params.system },
        { role: 'user', content: params.user },
      ],
      temperature: 0.4,
    };
    if (params.jsonMode) {
      body.response_format = { type: 'json_object' };
    }

    const endTimer = llmLatencySeconds.startTimer();
    try {
      const { data } = await axios.post<{
        choices?: Array<{ message?: { content?: string } }>;
      }>(url, body, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: timeoutMs,
      });
      endTimer();
      const content = data?.choices?.[0]?.message?.content ?? null;
      if (content) {
        llmCallsTotal.inc({ outcome: 'success' });
        return { content, outcome: 'success' };
      }
      llmCallsTotal.inc({ outcome: 'error' });
      return { content: null, outcome: 'error' };
    } catch (e) {
      endTimer();
      const err = e as AxiosError;
      if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
        this.logger.warn(`LLM timeout after ${timeoutMs}ms`);
        llmCallsTotal.inc({ outcome: 'timeout' });
        return { content: null, outcome: 'timeout' };
      }
      this.logger.warn(
        `LLM error: ${err.message} ${err.response?.status ?? ''}`,
      );
      llmCallsTotal.inc({ outcome: 'error' });
      return { content: null, outcome: 'error' };
    }
  }
}
