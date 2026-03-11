import { AssetType } from '@prisma/client';
import { IsEnum, IsOptional, IsString, IsUUID, IsUrl } from 'class-validator';

export class CreateAssetDto {
  @IsString()
  @IsUrl()
  url: string;

  @IsOptional()
  @IsEnum(AssetType)
  type?: AssetType;

  @IsOptional()
  @IsUUID()
  postId?: string;
}
