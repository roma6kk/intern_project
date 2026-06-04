import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PlatformRole } from '@prisma/client';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsDate,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum BulkAdminAction {
  WARN = 'WARN',
  SUSPEND = 'SUSPEND',
  UNSUSPEND = 'UNSUSPEND',
  ROLE = 'ROLE',
}

export class BulkWarnPayloadDto {
  @ApiProperty()
  @IsString()
  @Length(1, 2000)
  reason!: string;
}

export class BulkSuspendPayloadDto {
  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  until!: Date;

  @ApiProperty()
  @IsString()
  @Length(1, 2000)
  reason!: string;
}

export class BulkUnsuspendPayloadDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Length(0, 2000)
  reason?: string;
}

export class BulkRolePayloadDto {
  @ApiProperty({ enum: PlatformRole })
  @IsEnum(PlatformRole)
  role!: PlatformRole;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Length(0, 1000)
  reason?: string;
}

export class BulkAdminUsersDto {
  @ApiProperty({ maxItems: 50 })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(50)
  @IsUUID('4', { each: true })
  userIds!: string[];

  @ApiProperty({ enum: BulkAdminAction })
  @IsEnum(BulkAdminAction)
  action!: BulkAdminAction;

  @ApiPropertyOptional()
  @ValidateNested()
  @Type(() => BulkWarnPayloadDto)
  @IsOptional()
  warn?: BulkWarnPayloadDto;

  @ApiPropertyOptional()
  @ValidateNested()
  @Type(() => BulkSuspendPayloadDto)
  @IsOptional()
  suspend?: BulkSuspendPayloadDto;

  @ApiPropertyOptional()
  @ValidateNested()
  @Type(() => BulkUnsuspendPayloadDto)
  @IsOptional()
  unsuspend?: BulkUnsuspendPayloadDto;

  @ApiPropertyOptional()
  @ValidateNested()
  @Type(() => BulkRolePayloadDto)
  @IsOptional()
  rolePayload?: BulkRolePayloadDto;
}
