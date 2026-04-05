import { IsOptional, IsString, IsUUID } from 'class-validator';

export class TargetUserProfileDto {
  @IsUUID()
  userId!: string;

  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  secondName?: string;

  @IsOptional()
  @IsString()
  bio?: string | null;

  @IsOptional()
  @IsString()
  platformRole?: string;

  @IsOptional()
  @IsString()
  locale?: string;
}
