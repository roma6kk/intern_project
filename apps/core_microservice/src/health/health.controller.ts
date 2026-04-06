import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  MemoryHealthIndicator,
} from '@nestjs/terminus';
import { PrismaHealthIndicator } from './prisma.health';
import { ConfigService } from '@nestjs/config';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private db: PrismaHealthIndicator,
    private memory: MemoryHealthIndicator,
    private configService: ConfigService,
  ) {}

  @Get()
  @HealthCheck()
  @ApiOperation({ summary: 'Health check for core dependencies' })
  check() {
    const authUrl =
      this.configService.get<string>('AUTH_MICROSERVICE_URL') ||
      'http://auth-api:3001/internal/auth';

    return this.health.check([
      () => this.db.isHealthy('database'),
      () => this.memory.checkHeap('memory_heap', 1024 * 1024 * 1024),
      () =>
        this.http
          .pingCheck(
            'auth_service',
            `${authUrl.replace('/internal/auth', '/health')}/`,
          )
          .catch((e) => {
            throw e;
          }),
    ]);
  }
}
