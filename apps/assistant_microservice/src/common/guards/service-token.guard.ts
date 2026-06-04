import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request } from 'express';

@Injectable()
export class ServiceTokenGuard implements CanActivate {
  constructor(private readonly config: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    const header = req.headers['x-assistant-service-token'];
    const token = Array.isArray(header) ? header[0] : header;
    const expected = this.config.get<string>('ASSISTANT_SERVICE_SECRET');
    if (!expected?.length) {
      throw new UnauthorizedException('Assistant service secret not configured');
    }
    if (!token || token !== expected) {
      throw new UnauthorizedException('Invalid service token');
    }
    return true;
  }
}
