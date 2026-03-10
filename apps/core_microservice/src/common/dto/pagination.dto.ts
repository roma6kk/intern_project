import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsIn,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class PaginationDto {
  @ApiPropertyOptional({
    default: 1,
    description:
      'Page number (used only for trending sort with offset-based pagination)',
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({ default: 10, description: 'Items per page' })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  limit?: number = 10;

  @ApiPropertyOptional({
    description:
      'Opaque cursor token for cursor-based pagination (all sorts except trending)',
  })
  @IsOptional()
  @IsString()
  cursor?: string;

  @ApiPropertyOptional({ description: 'Search term' })
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({ description: 'Sort by: newest, oldest, or trending' })
  @IsOptional()
  @IsIn(['newest', 'oldest', 'trending'])
  sort?: string = 'newest';

  @ApiPropertyOptional({ description: 'Filter posts with media only' })
  @Type(() => Boolean)
  @IsBoolean()
  @IsOptional()
  mediaOnly?: boolean = false;

  @ApiPropertyOptional({
    description: 'Filter posts from following users only',
  })
  @Type(() => Boolean)
  @IsBoolean()
  @IsOptional()
  followingOnly?: boolean = false;

  @ApiPropertyOptional({
    description: 'Include archived posts (only for own posts)',
  })
  @Type(() => Boolean)
  @IsBoolean()
  @IsOptional()
  includeArchived?: boolean = false;

  @ApiPropertyOptional({
    description: 'Filter posts by author ID',
  })
  @IsOptional()
  authorId?: string;

  @ApiPropertyOptional({
    description: 'Filter posts liked by user ID (for own profile)',
  })
  @IsOptional()
  likedByUserId?: string;

  @ApiPropertyOptional({
    description: 'Filter posts commented by user ID (for own profile)',
  })
  @IsOptional()
  commentedByUserId?: string;
}
