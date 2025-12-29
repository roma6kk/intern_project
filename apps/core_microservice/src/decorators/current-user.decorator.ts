import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ICurrentUser } from '../auth/interfaces/ICurrentUser';

export const CurrentUser = createParamDecorator(
  (data: keyof ICurrentUser | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<{ user?: ICurrentUser }>();

    const user = request.user;

    if (!user) return null;

    return data ? user[data] : user;
  },
);
