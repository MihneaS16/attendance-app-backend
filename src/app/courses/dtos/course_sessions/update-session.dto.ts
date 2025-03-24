import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsString,
} from '@nestjs/class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateSessionDTO {
  @ApiProperty({ description: 'The session label', example: 'Laboratory 1' })
  @IsNotEmpty()
  @IsString()
  sessionLabel: string;

  @ApiProperty({ description: 'The session date', example: '2025-04-01' })
  @IsNotEmpty()
  @IsDateString()
  sessionDate: Date;

  @ApiPropertyOptional({
    description: 'The cancellation status of the session',
    example: true,
  })
  @IsNotEmpty()
  @IsBoolean()
  isCancelled: boolean;
}
