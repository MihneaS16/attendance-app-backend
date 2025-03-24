import { Attendance } from '../entities/attendance.entity';
import { AttendanceDTO } from '../dtos/attendance.dto';
import { UpdateAttendanceDTO } from '../dtos/update-attendance.dto';
import { CourseSessionMapper } from '../../courses/mappers/course-session.mapper';
import { UserMapper } from '../../users/mappers/user.mapper';

export class AttendanceMapper {
  static toDto(entity: Attendance): AttendanceDTO {
    return {
      id: entity.id,
      student: UserMapper.toStudentDto(entity.student),
      courseSession: CourseSessionMapper.toDto(entity.session),
      status: entity.status,
      excuseReason: entity.excuseReason ?? undefined,
    };
  }

  static fromUpdateDto(dto: UpdateAttendanceDTO): Partial<Attendance> {
    return {
      status: dto.status,
      excuseReason: dto.excuseReason ?? undefined,
    };
  }
}
