import { ApiProperty } from '@nestjs/swagger';
import { ModerationAction, ReportStatus } from '@prisma/client';
import { IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { Type } from 'class-transformer';
import { IsDate } from 'class-validator';

export class UpdateReportDto {
  @ApiProperty({ enum: ReportStatus })
  @IsEnum(ReportStatus)
  status!: ReportStatus;

  @ApiProperty({ enum: ModerationAction, required: false })
  @IsOptional()
  @IsEnum(ModerationAction)
  action?: ModerationAction;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @Length(0, 1000)
  resolutionNote?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @Length(0, 1000)
  warningReason?: string;

  @ApiProperty({
    required: false,
    description: 'Optional suspension end for WARN escalation override',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  suspendUntil?: Date;
}
