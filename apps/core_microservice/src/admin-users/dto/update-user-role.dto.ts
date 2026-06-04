import { ApiProperty } from '@nestjs/swagger';
import { PlatformRole } from '@prisma/client';
import { IsEnum, IsOptional, IsString, Length } from 'class-validator';

export class UpdateUserRoleDto {
  @ApiProperty({ enum: PlatformRole })
  @IsEnum(PlatformRole)
  role!: PlatformRole;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @Length(0, 500)
  reason?: string;
}
