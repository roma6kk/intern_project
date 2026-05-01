import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  AssistantErrorCode,
  type AssistantEnvelope,
  type AssistantErrorCodeType,
} from '../contracts/assistant-api.types';
import {
  parseChatQaJson,
  parseDialogSummaryJson,
  parseTopicSuggestionsJson,
} from './assistant-response.parser';
import type { ChatQaRequestDto } from './dto/chat-qa-request.dto';
import type { DialogSummaryRequestDto } from './dto/dialog-summary-request.dto';
import type { TopicSuggestionsRequestDto } from './dto/topic-suggestions-request.dto';
import {
  fallbackChatQa,
  fallbackDialogSummary,
  fallbackTopicSuggestions,
} from './fallback-responses';
import {
  buildChatQaPrompts,
  buildDialogSummaryPrompts,
  buildTopicSuggestionPrompts,
} from './prompt-builder';
import { LlmService } from '../llm/llm.service';

@Injectable()
export class AssistantService {
  private readonly logger = new Logger(AssistantService.name);

  constructor(
    private readonly llm: LlmService,
    private readonly config: ConfigService,
  ) {}

  private useJsonMode(): boolean {
    const v = this.config.get<string>('LLM_JSON_MODE');
    if (v === '0' || v?.toLowerCase() === 'false') return false;
    return true;
  }

  private wrapFallback<T>(
    data: T,
    llmError?: AssistantErrorCodeType,
  ): AssistantEnvelope<T> {
    return {
      success: true,
      data,
      meta: {
        source: 'fallback',
        ...(llmError ? { llmError } : {}),
      },
    };
  }

  private wrapLlm<T>(data: T): AssistantEnvelope<T> {
    return {
      success: true,
      data,
      meta: { source: 'llm' },
    };
  }

  async topicSuggestions(
    dto: TopicSuggestionsRequestDto,
  ): Promise<AssistantEnvelope<import('../contracts/assistant-api.types').TopicSuggestionsData>> {
    this.logger.log(
      `topicSuggestions chatId=${dto.chatId} messages=${dto.recentMessages.length}`,
    );
    const fb = fallbackTopicSuggestions(dto.targetUserProfile);
    if (!this.llm.isConfigured()) {
      this.logger.warn(
        `topicSuggestions fallback: LLM is not configured (LLM_API_KEY missing)`,
      );
      return this.wrapFallback(fb, AssistantErrorCode.LLM_ERROR);
    }
    const { system, user } = buildTopicSuggestionPrompts({
      profile: dto.targetUserProfile,
      recentMessages: dto.recentMessages,
    });
    const { content, outcome } = await this.llm.completeChat({
      system,
      user,
      jsonMode: this.useJsonMode(),
    });
    if (!content) {
      const err =
        outcome === 'timeout'
          ? AssistantErrorCode.LLM_TIMEOUT
          : AssistantErrorCode.LLM_ERROR;
      this.logger.warn(
        `topicSuggestions fallback: LLM completion failed (outcome=${outcome}, code=${err})`,
      );
      return this.wrapFallback(fb, err);
    }
    const parsed = parseTopicSuggestionsJson(content);
    if (!parsed.ok) {
      this.logger.warn(
        `topicSuggestions fallback: PARSE_ERROR (${parsed.message})`,
      );
      return this.wrapFallback(fb, AssistantErrorCode.PARSE_ERROR);
    }
    return this.wrapLlm(parsed.data);
  }

  async dialogSummary(
    dto: DialogSummaryRequestDto,
  ): Promise<AssistantEnvelope<import('../contracts/assistant-api.types').DialogSummaryData>> {
    this.logger.log(
      `dialogSummary chatId=${dto.chatId} messages=${dto.recentMessages.length}`,
    );
    const maxBullets = dto.maxBullets ?? 5;
    const fb = fallbackDialogSummary(dto.recentMessages, maxBullets);
    if (dto.recentMessages.length === 0) {
      this.logger.warn(`dialogSummary fallback: empty context`);
      return this.wrapFallback(fb, AssistantErrorCode.MISSING_CONTEXT);
    }
    if (!this.llm.isConfigured()) {
      this.logger.warn(
        `dialogSummary fallback: LLM is not configured (LLM_API_KEY missing)`,
      );
      return this.wrapFallback(fb, AssistantErrorCode.LLM_ERROR);
    }
    const { system, user } = buildDialogSummaryPrompts({
      recentMessages: dto.recentMessages,
      maxBullets,
    });
    const { content, outcome } = await this.llm.completeChat({
      system,
      user,
      jsonMode: this.useJsonMode(),
    });
    if (!content) {
      const err =
        outcome === 'timeout'
          ? AssistantErrorCode.LLM_TIMEOUT
          : AssistantErrorCode.LLM_ERROR;
      this.logger.warn(
        `dialogSummary fallback: LLM completion failed (outcome=${outcome}, code=${err})`,
      );
      return this.wrapFallback(fb, err);
    }
    const parsed = parseDialogSummaryJson(content);
    if (!parsed.ok) {
      this.logger.warn(
        `dialogSummary fallback: PARSE_ERROR (${parsed.message})`,
      );
      return this.wrapFallback(fb, AssistantErrorCode.PARSE_ERROR);
    }
    return this.wrapLlm(parsed.data);
  }

  async chatQa(
    dto: ChatQaRequestDto,
  ): Promise<AssistantEnvelope<import('../contracts/assistant-api.types').ChatQaData>> {
    this.logger.log(
      `chatQa chatId=${dto.chatId} messages=${dto.recentMessages.length}`,
    );
    const fb = fallbackChatQa(dto.question, dto.recentMessages);
    if (dto.recentMessages.length === 0) {
      this.logger.warn(`chatQa fallback: empty context`);
      return this.wrapFallback(fb, AssistantErrorCode.MISSING_CONTEXT);
    }
    if (!this.llm.isConfigured()) {
      this.logger.warn(
        `chatQa fallback: LLM is not configured (LLM_API_KEY missing)`,
      );
      return this.wrapFallback(fb, AssistantErrorCode.LLM_ERROR);
    }
    const { system, user } = buildChatQaPrompts({
      question: dto.question,
      recentMessages: dto.recentMessages,
    });
    const { content, outcome } = await this.llm.completeChat({
      system,
      user,
      jsonMode: this.useJsonMode(),
    });
    if (!content) {
      const err =
        outcome === 'timeout'
          ? AssistantErrorCode.LLM_TIMEOUT
          : AssistantErrorCode.LLM_ERROR;
      this.logger.warn(
        `chatQa fallback: LLM completion failed (outcome=${outcome}, code=${err})`,
      );
      return this.wrapFallback(fb, err);
    }
    const parsed = parseChatQaJson(content);
    if (!parsed.ok) {
      this.logger.warn(
        `chatQa fallback: PARSE_ERROR (${parsed.message})`,
      );
      return this.wrapFallback(fb, AssistantErrorCode.PARSE_ERROR);
    }
    return this.wrapLlm(parsed.data);
  }
}
