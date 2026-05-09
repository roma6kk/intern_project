import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { PrismaHealthIndicator } from '../health/prisma.health';

export type HealthCheckResult = {
  name: string;
  ok: boolean;
  latencyMs: number;
  statusCode?: number;
  error?: string;
  llm?: {
    configured: boolean;
    model?: string;
  };
};

@Injectable()
export class AdminSystemService {
  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
    private readonly prismaHealth: PrismaHealthIndicator,
  ) {}

  async checkExternalServices(): Promise<{
    checkedAt: string;
    services: HealthCheckResult[];
  }> {
    const checkedAt = new Date().toISOString();
    const services: HealthCheckResult[] = [];

    const dbStart = Date.now();
    try {
      await this.prismaHealth.isHealthy('database');
      services.push({
        name: 'core_database',
        ok: true,
        latencyMs: Date.now() - dbStart,
      });
    } catch (e) {
      services.push({
        name: 'core_database',
        ok: false,
        latencyMs: Date.now() - dbStart,
        error: (e as Error).message,
      });
    }

    const authUrl =
      this.config.get<string>('AUTH_MICROSERVICE_URL') ||
      'http://auth-api:3001/internal/auth';
    const authHealth = `${authUrl.replace(/\/internal\/auth\/?$/, '')}/health`;
    services.push(await this.pingHttp('auth_service', authHealth));

    const assistantBaseUrl =
      this.config.get<string>('ASSISTANT_MICROSERVICE_URL') ||
      'http://assistant-microservice:3003';
    const assistantHealthUrl = assistantBaseUrl.endsWith('/health')
      ? assistantBaseUrl
      : `${assistantBaseUrl.replace(/\/$/, '')}/health`;
    services.push(
      await this.pingHttp('ai_microservice', assistantHealthUrl, true),
    );

    const extra = this.config.get<string>('ADMIN_MONITOR_URLS') || '';
    const extras = extra
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    let idx = 0;
    for (const url of extras) {
      idx += 1;
      services.push(await this.pingHttp(`extra_${idx}`, url));
    }

    return { checkedAt, services };
  }

  private async pingHttp(
    name: string,
    url: string,
    parseLlM?: boolean,
  ): Promise<HealthCheckResult> {
    const t0 = Date.now();
    try {
      const res = await firstValueFrom(
        this.http.get(url, {
          timeout: 5000,
          validateStatus: () => true,
        }),
      );
      const ok = res.status >= 200 && res.status < 500;
      const llm =
        parseLlM && typeof res.data === 'object' && res.data != null
          ? (() => {
              const d = res.data as Record<string, unknown>;
              const llm = d.llm as Record<string, unknown> | undefined;
              const configured = llm?.configured;
              const model = llm?.model;
              if (typeof configured !== 'boolean') return undefined;
              return {
                configured,
                model: typeof model === 'string' ? model : undefined,
              };
            })()
          : undefined;
      return {
        name,
        ok,
        statusCode: res.status,
        latencyMs: Date.now() - t0,
        ...(llm ? { llm } : {}),
      };
    } catch (e) {
      return {
        name,
        ok: false,
        latencyMs: Date.now() - t0,
        error: (e as Error).message,
      };
    }
  }
}
