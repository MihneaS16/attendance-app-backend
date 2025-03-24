import { IsDateString, IsNotEmpty, IsString } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSessionDTO {
  @ApiProperty({ description: 'The session label', example: 'Laboratory 1' })
  @IsNotEmpty()
  @IsString()
  sessionLabel: string;

  @ApiProperty({ description: 'The session date', example: '2025-04-01' })
  @IsNotEmpty()
  @IsDateString()
  sessionDate: Date;
}
