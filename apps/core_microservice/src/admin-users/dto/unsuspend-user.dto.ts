import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, Length } from 'class-validator';

export class UnsuspendUserDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Length(0, 1000)
  reason?: string;
}
