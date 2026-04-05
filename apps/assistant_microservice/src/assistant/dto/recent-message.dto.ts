import { IsOptional, IsString, IsUUID } from 'class-validator';

export class RecentMessageDto {
  @IsUUID()
  id!: string;

  @IsUUID()
  senderId!: string;

  @IsOptional()
  @IsString()
  content!: string | null;

  @IsString()
  createdAt!: string;
}
