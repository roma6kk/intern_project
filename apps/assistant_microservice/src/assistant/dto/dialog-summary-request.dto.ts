import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsOptional,
  IsUUID,
  Max,
  Min,
  ValidateNested,
  ArrayMaxSize,
} from 'class-validator';
import { RecentMessageDto } from './recent-message.dto';

export class DialogSummaryRequestDto {
  @IsUUID()
  chatId!: string;

  @IsUUID()
  requesterId!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RecentMessageDto)
  @ArrayMaxSize(100)
  recentMessages!: RecentMessageDto[];

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(12)
  maxBullets?: number;
}
