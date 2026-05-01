import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional } from 'class-validator';

export class StoryMeQueryDto {
  @ApiPropertyOptional({ enum: ['active', 'expired'], default: 'active' })
  @IsOptional()
  @IsIn(['active', 'expired'])
  status?: 'active' | 'expired';
}

