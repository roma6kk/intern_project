import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Controller('health')
export class HealthController {
  constructor(private readonly config: ConfigService) {}

  @Get()
  check() {
    const apiKey = this.config.get<string>('LLM_API_KEY');
    const configured = Boolean(apiKey?.trim());
    const model = this.config.get<string>('LLM_MODEL')?.trim();

    return {
      status: 'ok',
      service: 'assistant_microservice',
      llm: {
        configured,
        model: model || undefined,
      },
    };
  }
}
