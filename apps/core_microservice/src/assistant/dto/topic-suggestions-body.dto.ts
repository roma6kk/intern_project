import { IsUUID } from 'class-validator';

export class TopicSuggestionsBodyDto {
  @IsUUID()
  chatId!: string;
}
