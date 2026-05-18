import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { parseUuidArray } from './parse-uuid-array.transform';
import {
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class UpdateChatDto {
  @ApiPropertyOptional({
    description: 'Array of user IDs to add to the chat',
    example: ['uuid-1', 'uuid-2'],
  })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  @Transform(({ value }: { value: unknown }) => parseUuidArray(value))
  addMemberIds?: string[];

  @ApiPropertyOptional({
    description: 'Array of user IDs to remove from the chat',
    example: ['uuid-1'],
  })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  @Transform(({ value }: { value: unknown }) => parseUuidArray(value))
  removeMemberIds?: string[];

  @ApiPropertyOptional({
    description:
      'Leave the chat (current user). If ADMIN and last admin, newAdminId required.',
  })
  @IsOptional()
  @IsBoolean()
  leaveChat?: boolean;

  @ApiPropertyOptional({
    description:
      'User ID to assign ADMIN role to (required when leaveChat is true and leaving user is the last admin)',
  })
  @IsOptional()
  @IsUUID('4')
  newAdminId?: string;

  @ApiPropertyOptional({
    description:
      'User ID of a participant to promote to ADMIN (only admins can use this)',
  })
  @IsOptional()
  @IsUUID('4')
  promoteToAdminId?: string;

  @ApiPropertyOptional({ description: 'Chat title (GROUP: non-empty)' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @ApiPropertyOptional({ description: 'Chat description' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional({
    description: 'Remove current group chat avatar',
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') {
      const normalized = value.trim().toLowerCase();
      return normalized === 'true' || normalized === '1';
    }
    return false;
  })
  @IsBoolean()
  removeAvatar?: boolean;
}
