import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min, IsIn, IsBoolean } from 'class-validator';

export class PaginationDto {
  @ApiPropertyOptional({ default: 1, description: 'Page number' })
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

  @ApiPropertyOptional({ description: 'Filter posts from following users only' })
  @Type(() => Boolean)
  @IsBoolean()
  @IsOptional()
  followingOnly?: boolean = false;
}
