import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreateMessageDto {
  @ApiProperty({ description: 'ID of the chat' })
  @IsUUID()
  @IsNotEmpty({ message: 'Chat ID can not be empty' })
  chatId: string;

  @ApiPropertyOptional({
    description: 'Text content (optional if file attached)',
  })
  @IsOptional()
  @IsString()
  @MaxLength(5000, { message: 'Message is too long' })
  content?: string;

  @ApiPropertyOptional({ type: 'string', format: 'binary', isArray: true })
  files?: any[];
}
