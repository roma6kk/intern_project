import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Socket } from 'socket.io';
import { AuthService } from '../auth.service';
import { WsException } from '@nestjs/websockets';
import { ICurrentUser } from '../interfaces/ICurrentUser';

@Injectable()
export class WsAuthGuard implements CanActivate {
  private readonly logger = new Logger(WsAuthGuard.name);

  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient<Socket>();

    const token =
      this.extractTokenFromHandshake(client) ||
      this.extractTokenFromAuth(client);

    if (!token) {
      this.logger.warn(`Client ${client.id} has no token`);
      throw new WsException('Unauthorized');
    }

    try {
      const user = await this.authService.validateToken(token);

      (client.data as { user?: ICurrentUser }).user = user;

      return true;
    } catch {
      this.logger.error(`WS Auth failed for ${client.id}`);
      throw new WsException('Unauthorized');
    }
  }

  private extractTokenFromHandshake(client: Socket): string | undefined {
    const authHeader = client.handshake.headers.authorization;
    const [type, token] = authHeader?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private extractTokenFromAuth(client: Socket): string | undefined {
    const auth = client.handshake.auth as { token?: string };
    return auth?.token;
  }
}
