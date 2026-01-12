import { IsString, IsOptional, IsNotEmpty, IsUUID } from 'class-validator';
export class CreatePostDto {
  @IsNotEmpty({ message: 'Author ID can not be empty' })
  @IsUUID()
  authorId: string;

  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  description?: string;
}
