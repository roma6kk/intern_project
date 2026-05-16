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
import { TargetUserProfileDto } from './target-user-profile.dto';

export class DialogSummaryRequestDto {
  @IsUUID()
  chatId!: string;

  @IsUUID()
  requesterId!: string;

  @ValidateNested()
  @Type(() => TargetUserProfileDto)
  requesterUserProfile!: TargetUserProfileDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => TargetUserProfileDto)
  targetUserProfile?: TargetUserProfileDto;

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
