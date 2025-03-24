import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from '@nestjs/class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AttendanceStatus } from '../enums/attendance-status.enum';

export class UpdateAttendanceDTO {
  @ApiProperty({
    description: 'The status of the attendance',
    example: AttendanceStatus.EXCUSED,
  })
  @IsNotEmpty()
  @IsEnum(AttendanceStatus)
  status: AttendanceStatus;

  @ApiPropertyOptional({
    description: 'The excuse reason for the attendance',
    example: 'The student was sick',
  })
  @IsOptional()
  @IsString()
  excuseReason?: string;
}
