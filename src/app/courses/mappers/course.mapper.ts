import { Course } from '../entities/course.entity';
import { UserMapper } from '../../users/mappers/user.mapper';
import { CourseSessionMapper } from './course-session.mapper';
import { CourseDTO } from '../dtos/courses/course.dto';
import { CreateCourseDTO } from '../dtos/courses/create-course.dto';
import { UpdateCourseDTO } from '../dtos/courses/update-course.dto';
import { AnnouncementMapper } from 'src/app/announcements/mappers/announcement.mapper';

export class CourseMapper {
  static toDto(entity: Course): CourseDTO {
    return {
      id: entity.id,
      name: entity.name,
      maxMissed: entity.maxMissed,
      joinCode: entity.joinCode,
      professor: UserMapper.toProfessorDto(entity.professor),
      students: entity.students
        ? entity.students.map((student) => UserMapper.toStudentDto(student))
        : [],
      announcements: entity.announcements
        ? entity.announcements.map((announcement) =>
            AnnouncementMapper.toDto(announcement),
          )
        : [],
      courseSessions: entity.courseSessions
        ? entity.courseSessions.map((session) =>
            CourseSessionMapper.toDto(session),
          )
        : [],
    };
  }

  static fromCreateDto(
    dto: CreateCourseDTO,
  ): Omit<
    Course,
    | 'id'
    | 'professor'
    | 'students'
    | 'announcements'
    | 'courseSessions'
    | 'joinCode'
  > {
    return {
      name: dto.name,
      maxMissed: dto.maxMissed,
    };
  }

  static fromUpdateDto(
    dto: UpdateCourseDTO,
  ): Omit<
    Course,
    | 'id'
    | 'professor'
    | 'students'
    | 'announcements'
    | 'courseSessions'
    | 'joinCode'
  > {
    return {
      name: dto.name,
      maxMissed: dto.maxMissed,
    };
  }
}
