import { ApiProperty } from '@nestjs/swagger';
import { UserDTO } from './user.dto';
import { CourseDTO } from 'src/app/courses/dtos/courses/course.dto';
import { AttendanceDTO } from 'src/app/attendances/dtos/attendance.dto';

export class StudentDTO extends UserDTO {
  @ApiProperty({ description: 'The device id of the user' })
  deviceId: string;

  @ApiProperty({ description: 'The date the device was last changed' })
  deviceLastChanged: Date;

  @ApiProperty({
    description: 'The courses the student is enrolled in',
    type: [CourseDTO],
    isArray: true,
  })
  coursesAttended: CourseDTO[];

  @ApiProperty({
    description: 'The attendances of the user',
    type: [AttendanceDTO],
    isArray: true,
  })
  attendances: AttendanceDTO[];
}
