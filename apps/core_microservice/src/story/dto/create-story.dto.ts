import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateStoryDto {
  @ApiPropertyOptional({ description: 'Optional caption text' })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  caption?: string;

  @ApiProperty({ type: 'string', format: 'binary', isArray: true })
  files?: any[];
}

