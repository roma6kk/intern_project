import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ChatType } from '@prisma/client';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreateChatDto {
  @ApiProperty({
    description: 'Array of user IDs to include in the chat',
    example: ['uuid-1', 'uuid-2'],
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsUUID('4', { each: true })
  memberIds: string[];

  @ApiPropertyOptional({ description: 'Name of the group chat' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  name?: string;

  @ApiPropertyOptional({
    description: 'Type of chat',
    enum: ChatType,
    default: ChatType.PRIVATE,
  })
  @IsOptional()
  @IsEnum(ChatType)
  type?: ChatType;
}
