import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class SetStoryReactionDto {
  @ApiProperty({ description: 'Reaction emoji', example: '🔥' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(8)
  emoji!: string;
}

