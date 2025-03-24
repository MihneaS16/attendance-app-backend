import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CourseSessionDTO } from 'src/app/courses/dtos/course_sessions/course-session.dto';
import { StudentDTO } from 'src/app/users/dtos/student.dto';
import { AttendanceStatus } from '../enums/attendance-status.enum';

export class AttendanceDTO {
  @ApiProperty({ description: 'The id of the attendance' })
  id: string;

  @ApiProperty({
    description: 'The student for which the attendance was made',
    type: StudentDTO,
  })
  student: StudentDTO;

  @ApiProperty({
    description: 'The session for which the attendance was made',
    type: CourseSessionDTO,
  })
  courseSession: CourseSessionDTO;

  @ApiProperty({
    description: 'The status of the attendance',
    enum: AttendanceStatus,
  })
  status: AttendanceStatus;

  @ApiPropertyOptional({ description: 'The excuse reason for the absence' })
  excuseReason?: string;
}
