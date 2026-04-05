import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID, Length } from 'class-validator';

export class CreateReportDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  postId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  commentId?: string;

  @ApiProperty()
  @IsString()
  @Length(5, 1000)
  reason!: string;
}
