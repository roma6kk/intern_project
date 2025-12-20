import { ArrayMinSize, IsArray, IsUUID } from 'class-validator';

export class CreateChatDto {
  @IsArray()
  @ArrayMinSize(2)
  @IsUUID('4', { each: true })
  memberIds: string[];
}
