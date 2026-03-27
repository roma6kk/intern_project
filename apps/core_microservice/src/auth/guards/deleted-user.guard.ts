import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  SetMetadata,
} from '@nestjs/common';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { UsersService } from '../../users/users.service';

export const ALLOW_WHEN_DELETED = 'allowWhenDeleted';

export const AllowWhenDeleted = () => SetMetadata(ALLOW_WHEN_DELETED, true);

@Injectable()
export class DeletedUserGuard implements CanActivate {
  constructor(
    private readonly usersService: UsersService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const user = (request as Request & { user?: { userId: string } }).user;

    if (!user?.userId) {
      return true;
    }

    const allowWhenDeleted = this.reflector.getAllAndOverride<boolean>(
      ALLOW_WHEN_DELETED,
      [context.getHandler(), context.getClass()],
    );

    if (allowWhenDeleted) {
      return true;
    }

    const isDeleted = await this.usersService.isDeleted(user.userId);
    if (isDeleted) {
      throw new ForbiddenException(
        'Account is scheduled for deletion. Recover your account to continue.',
      );
    }

    return true;
  }
}
