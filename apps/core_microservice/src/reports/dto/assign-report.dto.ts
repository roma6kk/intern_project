import { ApiProperty } from '@nestjs/swagger';
import { Allow, IsUUID, ValidateIf } from 'class-validator';

export class AssignReportDto {
  @ApiProperty({
    description: 'Moderator user id, or null to unassign',
    nullable: true,
    required: true,
  })
  @Allow()
  @ValidateIf((_, v) => v !== null && v !== undefined)
  @IsUUID()
  assignedModeratorId!: string | null;
}
