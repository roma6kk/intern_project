import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class ReplyToStoryDto {
  @ApiPropertyOptional({ description: 'Reply text' })
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  content?: string;
}

