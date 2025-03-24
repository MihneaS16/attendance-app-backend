import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AttendanceRepository } from '../repositories/attendance.repository';
import { CourseSessionService } from 'src/app/courses/services/course-session.service';
import { UserService } from 'src/app/users/services/user.service';
import { AttendanceGateway } from '../gateway/attendance.gateway';
import { Attendance } from '../entities/attendance.entity';
import { CourseSession } from 'src/app/courses/entities/course-session.entity';
import { User } from 'src/app/users/entities/user.entity';
import { Role } from 'src/app/users/enums/role.enum';
import { AttendanceStatus } from '../enums/attendance-status.enum';

@Injectable()
export class AttendanceService {
  constructor(
    private readonly attendanceRepository: AttendanceRepository,
    private readonly courseSessionService: CourseSessionService,
    private readonly userService: UserService,
    private readonly attendanceGateway: AttendanceGateway,
  ) {}

  async markAttendance(
    sessionId: string,
    currentUserId: string,
    token: string,
  ): Promise<Attendance> {
    const session: CourseSession =
      await this.courseSessionService.getByIdWithoutAuthorization(sessionId);

    if (!session) {
      throw new NotFoundException('No session found with the given id');
    }

    const currentCode =
      this.attendanceGateway.getCurrentCodeForSession(sessionId);
    if (!currentCode || currentCode !== token) {
      throw new UnauthorizedException('Invalid or expired QR code');
    }

    const user: User =
      await this.userService.getByIdWithCoursesAttended(currentUserId);
    if (!user) {
      throw new NotFoundException('No user found with the given id');
    }

    if (user.role !== Role.STUDENT) {
      throw new ForbiddenException(
        'Only students can add themselves to the attendance list',
      );
    }

    const isEnrolled = user.coursesAttended?.some(
      (course) => course.id === session.course.id,
    );
    if (!isEnrolled && user.id !== session.course.professor.id) {
      throw new UnauthorizedException('User not enrolled in this course');
    }

    let attendance = await this.attendanceRepository.getByStudentAndSession(
      user,
      session,
    );
    if (!attendance) {
      attendance = await this.attendanceRepository.create({
        session,
        student: user,
        status: AttendanceStatus.PRESENT,
      });
    } else {
      attendance.status = AttendanceStatus.PRESENT;
      attendance = await this.attendanceRepository.update(attendance);
    }

    return attendance;
  }

  async updateAttendanceStatus(
    attendanceId: string,
    currentUserId: string,
    newStatus: AttendanceStatus,
    excuseReason?: string,
  ): Promise<Attendance> {
    const attendance = await this.attendanceRepository.getById(attendanceId);
    if (!attendance) {
      throw new NotFoundException('No attendance record with the given id');
    }

    if (attendance.session.course.professor.id !== currentUserId) {
      throw new UnauthorizedException(
        'You are not the professor of this course',
      );
    }

    attendance.status = newStatus;
    attendance.excuseReason = excuseReason ?? undefined;

    return this.attendanceRepository.update(attendance);
  }

  async getAttendanceById(id: string): Promise<Attendance> {
    const attendance = await this.attendanceRepository.getById(id);
    if (!attendance) {
      throw new NotFoundException(
        'No attendance record found with the given id',
      );
    }
    return attendance;
  }

  async removeAttendance(id: string, currentUserId: string): Promise<void> {
    const attendance = await this.attendanceRepository.getById(id);
    if (!attendance) {
      throw new NotFoundException(
        'No attendance record found with the given id',
      );
    }
    if (attendance.session.course.professor.id !== currentUserId) {
      throw new UnauthorizedException('You are not allowed to do this');
    }

    await this.attendanceRepository.remove(id);
  }
}
