import { User } from '../entities/user.entity';
import { UserDTO } from '../dtos/user.dto';
import { ProfessorDTO } from '../dtos/professor.dto';
import { StudentDTO } from '../dtos/student.dto';
import { CreateUserDTO } from '../dtos/create-user.dto';
import { UpdateUserDTO } from '../dtos/update-user.dto';
import { CourseMapper } from '../../courses/mappers/course.mapper';
import { AttendanceMapper } from '../../attendances/mappers/attendance.mapper';

export class UserMapper {
  static toDto(entity: User): UserDTO {
    return {
      id: entity.id,
      email: entity.email,
      firstName: entity.firstName,
      lastName: entity.lastName,
      role: entity.role,
    };
  }

  static toProfessorDto(entity: User): ProfessorDTO {
    return {
      ...this.toDto(entity),
      coursesTaught: entity.coursesTaught
        ? entity.coursesTaught.map((course) => CourseMapper.toDto(course))
        : [],
    };
  }

  static toStudentDto(entity: User): StudentDTO {
    return {
      ...this.toDto(entity),
      deviceId: entity.deviceId ?? '',
      deviceLastChanged: entity.deviceLastChanged ?? new Date(0),
      coursesAttended: entity.coursesAttended
        ? entity.coursesAttended.map((course) => CourseMapper.toDto(course))
        : [],
      attendances: entity.attendances
        ? entity.attendances.map((attendance) =>
            AttendanceMapper.toDto(attendance),
          )
        : [],
    };
  }

  static fromCreateDto(
    dto: CreateUserDTO,
  ): Omit<User, 'id' | 'deviceId' | 'deviceLastChanged'> {
    return {
      email: dto.email,
      password: dto.password,
      firstName: dto.firstName,
      lastName: dto.lastName,
      role: dto.role,
    };
  }

  static fromUpdateDto(dto: UpdateUserDTO): Partial<User> {
    return {
      deviceId: dto.deviceId,
    };
  }
}
