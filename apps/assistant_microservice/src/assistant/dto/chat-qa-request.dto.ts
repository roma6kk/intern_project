import { Type } from 'class-transformer';
import {
  IsArray,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
  ValidateNested,
  ArrayMaxSize,
} from 'class-validator';
import { RecentMessageDto } from './recent-message.dto';

export class ChatQaRequestDto {
  @IsUUID()
  chatId!: string;

  @IsUUID()
  requesterId!: string;

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
