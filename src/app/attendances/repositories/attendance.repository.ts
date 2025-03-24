import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attendance } from '../entities/attendance.entity';
import { User } from 'src/app/users/entities/user.entity';
import { CourseSession } from 'src/app/courses/entities/course-session.entity';

@Injectable()
export class AttendanceRepository {
  constructor(
    @InjectRepository(Attendance)
    private readonly attendanceRepository: Repository<Attendance>,
  ) {}

  async getById(id: string): Promise<Attendance | null> {
    return this.attendanceRepository.findOneBy({ id });
  }

  async getByStudentAndSession(
    student: User,
    session: CourseSession,
  ): Promise<Attendance | null> {
    return this.attendanceRepository.findOne({
      where: { student: { id: student.id }, session: { id: session.id } },
    });
  }

  async create(
    data: Omit<Attendance, 'id' | 'excuseReason'>,
  ): Promise<Attendance> {
    return this.attendanceRepository.save(data);
  }

  async update(data: Attendance): Promise<Attendance> {
    return this.attendanceRepository.save(data);
  }

  async remove(id: string): Promise<void> {
    await this.attendanceRepository.delete(id);
  }
}
