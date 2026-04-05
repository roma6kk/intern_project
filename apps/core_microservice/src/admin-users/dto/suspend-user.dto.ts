import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsString, Length } from 'class-validator';

export class SuspendUserDto {
  @ApiProperty({ description: 'ISO datetime until suspension is active' })
  @Type(() => Date)
  @IsDate()
  until!: Date;

  @ApiProperty()
  @IsString()
  @Length(3, 1000)
  reason!: string;
}
