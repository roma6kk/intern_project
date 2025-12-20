import { IsString, IsNotEmpty, IsUUID } from 'class-validator';
export class CreateLikeDto {
  @IsString({ message: 'Author ID must be a string.' })
  @IsNotEmpty({ message: 'Author ID can not be empty.' })
  authorId: string;

  @IsUUID()
  @IsNotEmpty({ message: 'Post ID can not be empty.' })
  postId: string;
}
