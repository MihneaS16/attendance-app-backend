import { CourseSession } from '../entities/course-session.entity';
import { CourseMapper } from './course.mapper';
import { AttendanceMapper } from '../../attendances/mappers/attendance.mapper';
import { CourseSessionDTO } from '../dtos/course_sessions/course-session.dto';
import { CreateSessionDTO } from '../dtos/course_sessions/create-session.dto';
import { UpdateSessionDTO } from '../dtos/course_sessions/update-session.dto';

export class CourseSessionMapper {
  static toDto(entity: CourseSession): CourseSessionDTO {
    return {
      id: entity.id,
      course: CourseMapper.toDto(entity.course),
      sessionLabel: entity.sessionLabel,
      sessionDate: entity.sessionDate,
      isCancelled: entity.isCancelled,
      attendances: entity.attendances
        ? entity.attendances.map((attendance) =>
            AttendanceMapper.toDto(attendance),
          )
        : [],
    };
  }

  static toDtoWithoutAttendances(entity: CourseSession): CourseSessionDTO {
    return {
      id: entity.id,
      course: CourseMapper.toDto(entity.course),
      sessionLabel: entity.sessionLabel,
      sessionDate: entity.sessionDate,
      isCancelled: entity.isCancelled,
    };
  }

  static fromCreateDto(
    dto: CreateSessionDTO,
  ): Omit<CourseSession, 'id' | 'course' | 'attendances'> {
    return {
      sessionLabel: dto.sessionLabel,
      sessionDate: dto.sessionDate,
      isCancelled: false,
    };
  }

  static fromUpdateDto(
    dto: UpdateSessionDTO,
  ): Omit<CourseSession, 'id' | 'course' | 'attendances'> {
    return {
      sessionLabel: dto.sessionLabel,
      sessionDate: dto.sessionDate,
      isCancelled: dto.isCancelled,
    };
  }
}
