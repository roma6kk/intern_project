import { IsString, IsNotEmpty, MaxLength, IsUUID } from 'class-validator';
export class CreateMessageDto {
  @IsString({ message: 'Content must be a string' })
  @IsNotEmpty({ message: 'Content can not be empty' })
  @MaxLength(255, {
    message: 'Content length can not be larger than 255 symbols',
  })
  content: string;

  @IsUUID()
  @IsNotEmpty({ message: 'Chat ID can not be empty' })
  chatId: string;

  @IsUUID()
  @IsNotEmpty({ message: 'Sender ID can not be empty' })
  senderId: string;
}
