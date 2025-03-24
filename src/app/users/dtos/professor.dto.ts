import { ApiProperty } from '@nestjs/swagger';
import { UserDTO } from './user.dto';
import { CourseDTO } from 'src/app/courses/dtos/courses/course.dto';

export class ProfessorDTO extends UserDTO {
  @ApiProperty({
    description: 'The courses the professor teaches',
    type: [CourseDTO],
    isArray: true,
  })
  coursesTaught: CourseDTO[];
}
