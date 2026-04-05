import { ApiProperty } from '@nestjs/swagger';
import { ReportPriority } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class UpdateReportPriorityDto {
  @ApiProperty({ enum: ReportPriority })
  @IsEnum(ReportPriority)
  priority!: ReportPriority;
}
