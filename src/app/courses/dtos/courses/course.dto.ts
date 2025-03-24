import { ApiProperty } from '@nestjs/swagger';
import { AnnouncementDTO } from 'src/app/announcements/dtos/announcement.dto';
import { ProfessorDTO } from 'src/app/users/dtos/professor.dto';
import { StudentDTO } from 'src/app/users/dtos/student.dto';
import { CourseSessionDTO } from '../course_sessions/course-session.dto';

export class CourseDTO {
  @ApiProperty({ description: 'The id of the course' })
  id: string;

  @ApiProperty({
    description: 'The name of the course',
    minLength: 2,
    maxLength: 100,
  })
  name: string;

  @ApiProperty({
    description: 'The maximum number of missed attendances',
  })
  maxMissed: number;

  @ApiProperty({ description: 'The join code for the course' })
  joinCode: string;

  @ApiProperty({
    description: 'The professor teaching the course',
    type: ProfessorDTO,
  })
  professor: ProfessorDTO;

  @ApiProperty({
    description: 'The list of students attending the course',
    type: [StudentDTO],
    isArray: true,
  })
  students: StudentDTO[];

  @ApiProperty({
    description: 'The list of announcements associated with the course',
    type: [AnnouncementDTO],
    isArray: true,
  })
  announcements: AnnouncementDTO[];

  @ApiProperty({
    description: 'The list of course sessions associated with the course',
    type: [CourseSessionDTO],
    isArray: true,
  })
  courseSessions: CourseSessionDTO[];
}
