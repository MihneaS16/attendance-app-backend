import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  MaxLength,
  MinLength,
} from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCourseDTO {
  @ApiProperty({ description: 'The name of the course', example: 'Algebra' })
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name: string;

  @ApiProperty({
    description: 'The maximum number of allowed missed attendances',
    example: 2,
  })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  maxMissed: number;
}
