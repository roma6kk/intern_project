import { Type } from 'class-transformer';
import {
  IsArray,
  IsOptional,
  IsUUID,
  ValidateNested,
  ArrayMaxSize,
} from 'class-validator';
import { RecentMessageDto } from './recent-message.dto';
import { TargetUserProfileDto } from './target-user-profile.dto';

export class TopicSuggestionsRequestDto {
  @IsUUID()
  chatId!: string;

  @IsUUID()
  requesterId!: string;

  /** User who invoked the assistant — personalisation target. Must match requesterId. */
  @ValidateNested()
  @Type(() => TargetUserProfileDto)
  requesterUserProfile!: TargetUserProfileDto;

  @ValidateNested()
  @Type(() => TargetUserProfileDto)
  targetUserProfile!: TargetUserProfileDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RecentMessageDto)
  @ArrayMaxSize(100)
  recentMessages!: RecentMessageDto[];

  @IsOptional()
  @IsUUID()
  targetUserId?: string;
}
