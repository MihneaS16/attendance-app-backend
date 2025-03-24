import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CourseSessionRepository } from '../repositories/course-session.repository';
import { CourseSession } from '../entities/course-session.entity';
import { CourseService } from './course.service';

@Injectable()
export class CourseSessionService {
  constructor(
    private readonly courseSessionRepository: CourseSessionRepository,
    private readonly courseService: CourseService,
  ) {}

  async getById(
    sessionId: string,
    currentUserId: string,
  ): Promise<CourseSession> {
    const session = await this.courseSessionRepository.getById(sessionId);

    if (!session) {
      throw new NotFoundException('No session found with the given id');
    }

    if (currentUserId !== session.course.professor.id) {
      throw new UnauthorizedException('You are not allowed to do this');
    }

    return session;
  }

  async getByIdWithoutAuthorization(sessionId: string): Promise<CourseSession> {
    const session = await this.courseSessionRepository.getById(sessionId);

    if (!session) {
      throw new NotFoundException('No session found with the given id');
    }

    return session;
  }

  async getAllByCourse(
    courseId: string,
    currentUserId: string,
  ): Promise<CourseSession[]> {
    const course = await this.courseService.getByIdWithRelations(
      courseId,
      currentUserId,
    );
    return this.courseSessionRepository.getAllByCourse(course);
  }

  async create(
    courseId: string,
    data: Omit<CourseSession, 'id' | 'course' | 'attendances'>,
    currentUserId: string,
  ): Promise<CourseSession> {
    const course = await this.courseService.getById(courseId);

    if (currentUserId !== course.professor.id) {
      throw new UnauthorizedException('You are not allowed to do this');
    }

    const sessionData: Omit<CourseSession, 'id' | 'attendances'> = {
      ...data,
      course,
    };

    return this.courseSessionRepository.create(sessionData);
  }

  async update(
    sessionId: string,
    data: Omit<CourseSession, 'id' | 'course' | 'attendances'>,
    currentUserId: string,
  ): Promise<CourseSession> {
    const session = await this.courseSessionRepository.getById(sessionId);

    if (!session) {
      throw new NotFoundException('No session found with the given id');
    }

    if (currentUserId !== session.course.professor.id) {
      throw new UnauthorizedException('You are not allowed to do this');
    }

    session.sessionLabel = data.sessionLabel;
    session.sessionDate = data.sessionDate;
    session.isCancelled = data.isCancelled;

    return this.courseSessionRepository.update(session);
  }

  async remove(sessionId: string, currentUserId: string): Promise<void> {
    const session = await this.courseSessionRepository.getById(sessionId);

    if (!session) {
      throw new NotFoundException('No session found with the given id');
    }

    if (currentUserId !== session.course.professor.id) {
      throw new UnauthorizedException('You are not allowed to do this');
    }

    await this.courseSessionRepository.remove(sessionId);
  }
}
