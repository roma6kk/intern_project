import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateMessageDto {
  @ApiPropertyOptional({ description: 'New text content' })
  @IsOptional()
  @IsString()
  @MaxLength(5000, { message: 'Message is too long' })
  content?: string;
}
