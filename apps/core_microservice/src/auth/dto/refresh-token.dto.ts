import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({ description: 'Refresh Token string' })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  refreshToken?: string;
}
