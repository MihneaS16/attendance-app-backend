import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  MinLength,
} from '@nestjs/class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SessionFrequency } from '../../enums/session-frequency.enum';

export class CreateCourseDTO {
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

  @ApiPropertyOptional({
    description: 'The number of predefined sessions for the course',
    example: 14,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  predefinedSessions?: number;

  @ApiPropertyOptional({
    description:
      'The predefined sessions frequency (weekly, biweekly, monthly)',
    enum: SessionFrequency,
    example: SessionFrequency.WEEKLY,
  })
  @IsOptional()
  @IsEnum(SessionFrequency)
  sessionFrequency?: SessionFrequency;

  @ApiPropertyOptional({
    description: 'The start date for the automatically generated sessions',
    example: '2025-04-01',
  })
  @IsOptional()
  @IsDateString()
  startDate?: Date;
}
