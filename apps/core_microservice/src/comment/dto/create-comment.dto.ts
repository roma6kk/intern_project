import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateCommentDto {
  @IsUUID()
  @IsNotEmpty()
  authorId: string;

  @IsUUID()
  @IsNotEmpty()
  postId: string;

  @IsString()
  @IsNotEmpty()
  content: string;
}
