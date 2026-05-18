import { Controller, Get } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { SWAGGER_DOCUMENT } from '../swagger-document';

@Controller()
export class AppController {
  @Get('debug-sentry')
  @ApiExcludeEndpoint()
  debugSentry(): never {
    throw new Error('My first Sentry error in Auth Service!');
  }

  @Get('api-docs-json')
  @ApiExcludeEndpoint()
  apiDocsJson() {
    return SWAGGER_DOCUMENT;
  }
}
