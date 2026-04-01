import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export type PlatformRole = 'USER' | 'MODERATOR' | 'ADMIN';

export const Roles = (...roles: PlatformRole[]) =>
  SetMetadata(ROLES_KEY, roles);
