import { IsString, IsUUID, MaxLength, MinLength } from 'class-validator';

export class ChatQaBodyDto {
  @IsUUID()
  chatId!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(2000)
  question!: string;
}
