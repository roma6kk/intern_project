import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsBoolean,
  IsString,
  MaxLength,
  IsDateString,
} from 'class-validator';

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: 'Ivan', description: 'First name' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  firstName?: string;

  @ApiPropertyOptional({ example: 'Ivanov', description: 'Second name' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  secondName?: string;

  @ApiPropertyOptional({ description: 'Bio description' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  bio?: string;

  @ApiPropertyOptional({ description: 'Avatar URL' })
  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @ApiPropertyOptional({ example: '1990-01-15', description: 'Birthday date' })
  @IsOptional()
  @IsDateString()
  birthday?: string;

  @ApiPropertyOptional({ example: true, description: 'Private profile status' })
  @IsOptional()
  @IsBoolean()
  isPrivate?: boolean;
}
