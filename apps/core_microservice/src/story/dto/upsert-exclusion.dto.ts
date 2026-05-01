import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class UpsertStoryExclusionDto {
  @ApiProperty({ description: 'User ID to exclude from viewing your stories' })
  @IsUUID()
  @IsNotEmpty()
  excludedUserId!: string;
}
