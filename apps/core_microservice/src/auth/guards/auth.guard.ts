import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '../auth.service';
import { ICurrentUser } from '../interfaces/ICurrentUser';
@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);

  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const token = this.extractTokenFromHeader(request);

    if (!token) {
      this.logger.warn('No token provided in request');
      throw new UnauthorizedException('Authentication token is missing');
    }

    try {
      const user = await this.authService.validateToken(token);

      (request as Request & { user: ICurrentUser }).user = user;

      return true;
    } catch (error) {
      this.logger.error('Token validation failed', (error as Error).message);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
