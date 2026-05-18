import { IsOptional, IsUUID } from 'class-validator';

export class TopicSuggestionsBodyDto {
  @IsUUID()
  chatId!: string;

  @IsOptional()
  @IsUUID()
  targetUserId?: string;
}
