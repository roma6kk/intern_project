import { NotificationType } from '@prisma/client';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateNotificationDto {
  @ApiProperty({
    enum: NotificationType,
    description: 'Type of notification',
  })
  @IsEnum(NotificationType)
  @IsNotEmpty()
  type: NotificationType;

  @ApiProperty({
    description: 'Recipient user ID',
    format: 'uuid',
  })
  @IsUUID()
  @IsNotEmpty()
  recipientId: string;

  @ApiProperty({
    description: 'Actor user ID',
    format: 'uuid',
  })
  @IsUUID()
  @IsNotEmpty()
  actorId: string;

  @ApiPropertyOptional({
    description: 'Optional related item identifier',
  })
  @IsString()
  @IsOptional()
  itemId?: string;

  @ApiPropertyOptional({
    description: 'Optional related post ID',
    format: 'uuid',
  })
  @IsUUID()
  @IsOptional()
  postId?: string;

  @ApiPropertyOptional({
    description: 'Human-readable body (e.g. SYSTEM warnings)',
  })
  @IsOptional()
  @IsString()
  message?: string;
}
