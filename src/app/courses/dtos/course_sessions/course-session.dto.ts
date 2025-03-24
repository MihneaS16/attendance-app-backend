import { ApiProperty } from '@nestjs/swagger';
import { CourseDTO } from '../courses/course.dto';
import { AttendanceDTO } from 'src/app/attendances/dtos/attendance.dto';

export class CourseSessionDTO {
  @ApiProperty({ description: 'The id of the course session' })
  id: string;

  @ApiProperty({
    description: 'The course for which the session was created',
    type: CourseDTO,
  })
  course: CourseDTO;

  @ApiProperty({ description: 'The session label' })
  sessionLabel: string;

  @ApiProperty({ description: 'The sesssion date' })
  sessionDate: Date;

  @ApiProperty({ description: 'The cancellation status of the session' })
  isCancelled: boolean;

  @ApiProperty({
    description: 'The attendances for the current session',
    type: [AttendanceDTO],
    isArray: true,
  })
  attendances?: AttendanceDTO[];
}
