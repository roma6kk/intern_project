import { IsOptional, IsString, MaxLength, IsUUID } from 'class-validator';

export class RecentMessageDto {
  @IsUUID()
  id!: string;

  @IsUUID()
  senderId!: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  senderUsername?: string;

  @IsOptional()
  @IsString()
  content!: string | null;

  @IsString()
  createdAt!: string;
}
