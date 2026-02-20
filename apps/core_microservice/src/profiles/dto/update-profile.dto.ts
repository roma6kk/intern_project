import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsBoolean,
  IsString,
  MaxLength,
  IsDateString,
} from 'class-validator';
import { IsValidBirthDate } from './validators/is-valid-birth-date.validator';

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

  @ApiPropertyOptional({
    example: '1990-01-15',
    description: 'Birthday date (ISO 8601). User must be 13–120 years old.',
  })
  @IsOptional()
  @IsDateString()
  @IsValidBirthDate()
  birthday?: string;

  @ApiPropertyOptional({ example: true, description: 'Private profile status' })
  @IsOptional()
  @IsBoolean()
  isPrivate?: boolean;
}
