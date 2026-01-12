import { NotificationType } from '@prisma/client';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateNotificationDto {
  @IsEnum(NotificationType)
  @IsNotEmpty()
  type: NotificationType;

  @IsUUID()
  @IsNotEmpty()
  recipientId: string;

  @IsUUID()
  @IsNotEmpty()
  actorId: string;

  @IsString()
  @IsOptional()
  itemId?: string;
}
