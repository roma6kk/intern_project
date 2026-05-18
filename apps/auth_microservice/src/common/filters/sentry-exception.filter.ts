import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import * as Sentry from '@sentry/node';
import { Response } from 'express';

@Catch()
export class SentryExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    if (!(exception instanceof HttpException) || status >= 500) {
      Sentry.captureException(exception);
    }

    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();
      response.status(status).json(exceptionResponse);
      return;
    }

    response.status(status).json({
      statusCode: status,
      message: 'Internal server error',
    });
  }
}
