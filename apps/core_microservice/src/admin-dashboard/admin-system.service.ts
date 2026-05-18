import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as amqp from 'amqplib';
import * as https from 'https';
import { firstValueFrom } from 'rxjs';
import { createClient } from 'redis';
import { PrismaHealthIndicator } from '../health/prisma.health';

export type ArchitectureCategory =
  | 'gateway'
  | 'microservice'
  | 'messaging'
  | 'database';

export type HealthCheckResult = {
  id: string;
  label: string;
  category: ArchitectureCategory;
  ok: boolean;
  latencyMs: number;
  statusCode?: number;
  error?: string;
  detail?: string;
  llm?: {
    configured: boolean;
    model?: string;
  };
};

const ARCHITECTURE_CHECKS: {
  id: string;
  label: string;
  category: ArchitectureCategory;
}[] = [
  { id: 'nginx', label: 'NGINX (шлюз)', category: 'gateway' },
  {
    id: 'core_microservice',
    label: 'Core Microservice',
    category: 'microservice',
  },
  { id: 'rabbitmq', label: 'RabbitMQ 3 (брокер)', category: 'messaging' },
  {
    id: 'notification_consumer',
    label: 'Notification Consumer',
    category: 'microservice',
  },
  {
    id: 'auth_microservice',
    label: 'Authentication Microservice',
    category: 'microservice',
  },
  {
    id: 'assistant_microservice',
    label: 'Assistant Microservice',
    category: 'microservice',
  },
  { id: 'postgresql', label: 'PostgreSQL 15', category: 'database' },
  { id: 'redis', label: 'Redis 7', category: 'database' },
];

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

    const [
      nginx,
      core,
      rabbitmq,
      notificationConsumer,
      postgresql,
      redis,
      auth,
      assistant,
    ] = await Promise.all([
      this.checkNginx(),
      this.checkCoreMicroservice(),
      this.checkRabbitmq(),
      this.checkNotificationConsumer(),
      this.checkPostgresql(),
      this.checkRedis(),
      this.checkAuthMicroservice(),
      this.checkAssistantMicroservice(),
    ]);

    const services: HealthCheckResult[] = [
      nginx,
      core,
      rabbitmq,
      notificationConsumer,
      auth,
      assistant,
      postgresql,
      redis,
    ];

    const extra = this.config.get<string>('ADMIN_MONITOR_URLS') || '';
    const extras = extra
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    let idx = 0;
    for (const url of extras) {
      idx += 1;
      const result = await this.pingHttp(url);
      services.push({
        id: `extra_${idx}`,
        label: `Доп. проверка ${idx}`,
        category: 'microservice',
        ...result,
      });
    }

    return { checkedAt, services };
  }

  private meta(
    id: string,
  ): Pick<HealthCheckResult, 'id' | 'label' | 'category'> {
    const found = ARCHITECTURE_CHECKS.find((c) => c.id === id);
    return (
      found ?? {
        id,
        label: id,
        category: 'microservice',
      }
    );
  }

  private async checkCoreMicroservice(): Promise<HealthCheckResult> {
    const meta = this.meta('core_microservice');
    const t0 = Date.now();
    try {
      await this.prismaHealth.isHealthy('database');
      return {
        ...meta,
        ok: true,
        latencyMs: Date.now() - t0,
        detail: 'Сервис отвечает, БД доступна',
      };
    } catch (e) {
      return {
        ...meta,
        ok: false,
        latencyMs: Date.now() - t0,
        error: (e as Error).message,
        detail: 'Сервис отвечает, но БД недоступна',
      };
    }
  }

  private async checkPostgresql(): Promise<HealthCheckResult> {
    const meta = this.meta('postgresql');
    const t0 = Date.now();
    try {
      await this.prismaHealth.isHealthy('database');
      return { ...meta, ok: true, latencyMs: Date.now() - t0 };
    } catch (e) {
      return {
        ...meta,
        ok: false,
        latencyMs: Date.now() - t0,
        error: (e as Error).message,
      };
    }
  }

  private async checkRedis(): Promise<HealthCheckResult> {
    const meta = this.meta('redis');
    const t0 = Date.now();
    const redisUrl =
      this.config.get<string>('REDIS_URL') ?? 'redis://redis:6379';
    const client = createClient({ url: redisUrl });
    try {
      await client.connect();
      const pong = await client.ping();
      await client.quit();
      const ok = pong === 'PONG';
      return {
        ...meta,
        ok,
        latencyMs: Date.now() - t0,
        ...(ok ? {} : { error: `Неожиданный ответ: ${pong}` }),
      };
    } catch (e) {
      try {
        await client.quit();
      } catch {
        /* ignore */
      }
      return {
        ...meta,
        ok: false,
        latencyMs: Date.now() - t0,
        error: (e as Error).message,
      };
    }
  }

  private rabbitmqUrl(): string {
    return (
      this.config.get<string>('RABBITMQ_URL') ??
      'amqp://guest:guest@rabbitmq:5672'
    );
  }

  private async checkRabbitmq(): Promise<HealthCheckResult> {
    const meta = this.meta('rabbitmq');
    const t0 = Date.now();
    try {
      const conn = await amqp.connect(this.rabbitmqUrl());
      await conn.close();
      return { ...meta, ok: true, latencyMs: Date.now() - t0 };
    } catch (e) {
      return {
        ...meta,
        ok: false,
        latencyMs: Date.now() - t0,
        error: (e as Error).message,
      };
    }
  }

  private async checkNotificationConsumer(): Promise<HealthCheckResult> {
    const meta = this.meta('notification_consumer');
    const t0 = Date.now();
    const queueName =
      this.config.get<string>('NOTIFICATIONS_QUEUE') ?? 'notifications_queue';
    try {
      const conn = await amqp.connect(this.rabbitmqUrl());
      const channel = await conn.createChannel();
      const { consumerCount } = await channel.checkQueue(queueName);
      await channel.close();
      await conn.close();
      const ok = consumerCount > 0;
      return {
        ...meta,
        ok,
        latencyMs: Date.now() - t0,
        detail: `Подписчиков очереди «${queueName}»: ${consumerCount}`,
        ...(ok
          ? {}
          : {
              error:
                'Нет активных consumer — Notification Consumer не слушает очередь',
            }),
      };
    } catch (e) {
      return {
        ...meta,
        ok: false,
        latencyMs: Date.now() - t0,
        error: (e as Error).message,
      };
    }
  }

  private async checkNginx(): Promise<HealthCheckResult> {
    const meta = this.meta('nginx');
    const url =
      this.config.get<string>('ADMIN_NGINX_HEALTH_URL')?.trim() ||
      this.config.get<string>('FRONTEND_PUBLIC_URL')?.trim() ||
      'https://localhost';
    const ping = await this.pingHttp(url, false, url.startsWith('https://'));
    return { ...meta, ...ping };
  }

  private async checkAuthMicroservice(): Promise<HealthCheckResult> {
    const meta = this.meta('auth_microservice');
    const authUrl =
      this.config.get<string>('AUTH_MICROSERVICE_URL') ||
      'http://auth-api:3001/internal/auth';
    const authHealth = `${authUrl.replace(/\/internal\/auth\/?$/, '')}/health`;
    const ping = await this.pingHttp(authHealth);
    return { ...meta, ...ping };
  }

  private async checkAssistantMicroservice(): Promise<HealthCheckResult> {
    const meta = this.meta('assistant_microservice');
    const assistantBaseUrl =
      this.config.get<string>('ASSISTANT_MICROSERVICE_URL') ||
      'http://assistant-microservice:3003';
    const assistantHealthUrl = assistantBaseUrl.endsWith('/health')
      ? assistantBaseUrl
      : `${assistantBaseUrl.replace(/\/$/, '')}/health`;
    const ping = await this.pingHttp(assistantHealthUrl, true);
    return { ...meta, ...ping };
  }

  private async pingHttp(
    url: string,
    parseLlM?: boolean,
    allowInsecureTls?: boolean,
  ): Promise<
    Pick<HealthCheckResult, 'ok' | 'latencyMs' | 'statusCode' | 'error' | 'llm'>
  > {
    const t0 = Date.now();
    try {
      const res = await firstValueFrom(
        this.http.get(url, {
          timeout: 5000,
          validateStatus: () => true,
          ...(allowInsecureTls
            ? {
                httpsAgent: new https.Agent({ rejectUnauthorized: false }),
              }
            : {}),
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
        ok,
        statusCode: res.status,
        latencyMs: Date.now() - t0,
        ...(llm ? { llm } : {}),
        ...(!ok ? { error: `HTTP ${res.status}` } : {}),
      };
    } catch (e) {
      return {
        ok: false,
        latencyMs: Date.now() - t0,
        error: (e as Error).message,
      };
    }
  }
}
