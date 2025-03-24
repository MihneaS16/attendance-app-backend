import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CourseSession } from '../entities/course-session.entity';
import { Course } from '../entities/course.entity';

@Injectable()
export class CourseSessionRepository {
  constructor(
    @InjectRepository(CourseSession)
    private readonly courseSessionRepository: Repository<CourseSession>,
  ) {}

  async getById(id: string): Promise<CourseSession | null> {
    return this.courseSessionRepository.findOne({
      where: { id },
      relations: ['course', 'attendances'],
    });
  }

  async getAllByCourse(course: Course): Promise<CourseSession[]> {
    return this.courseSessionRepository.find({
      where: { course },
      relations: ['course'],
    });
  }

  async create(
    data: Omit<CourseSession, 'id' | 'attendances'>,
  ): Promise<CourseSession> {
    return this.courseSessionRepository.save(data);
  }

  async update(data: CourseSession): Promise<CourseSession> {
    return this.courseSessionRepository.save(data);
  }

  async remove(id: string): Promise<void> {
    await this.courseSessionRepository.delete(id);
  }
}
