import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsArray, IsUUID } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdatePostDto {
  @ApiPropertyOptional({ description: 'Text content of the post' })
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  description?: string;

  @ApiPropertyOptional({
    description: 'Array of asset IDs to delete',
    type: [String],
  })
  @IsOptional()
  @Transform(({ value }: { value: unknown }) => {
    if (Array.isArray(value)) return value as string[];
    if (typeof value === 'string') return [value];
    return [];
  })
  @IsArray()
  @IsUUID('4', { each: true })
  deleteAssetIds?: string[];

  @ApiPropertyOptional({ type: 'string', format: 'binary', isArray: true })
  files?: any[];
}
