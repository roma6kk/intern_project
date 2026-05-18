import { Type } from 'class-transformer';
import {
  IsArray,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
  ValidateNested,
  ArrayMaxSize,
} from 'class-validator';
import { RecentMessageDto } from './recent-message.dto';
import { TargetUserProfileDto } from './target-user-profile.dto';

export class ChatQaRequestDto {
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

  @IsString()
  @MinLength(1)
  @MaxLength(2000)
  question!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RecentMessageDto)
  @ArrayMaxSize(100)
  recentMessages!: RecentMessageDto[];
}
