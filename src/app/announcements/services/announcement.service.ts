import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Announcement } from '../entities/announcement.entity';
import { CourseService } from 'src/app/courses/services/course.service';
import { AnnouncementRepository } from '../repositories/announcement.repository';
import { UserService } from 'src/app/users/services/user.service';

@Injectable()
export class AnnouncementService {
  constructor(
    private readonly announcementRepository: AnnouncementRepository,
    private readonly courseService: CourseService,
    private readonly userService: UserService,
  ) {}

  async getById(
    announcementId: string,
    currentUserId: string,
  ): Promise<Announcement> {
    const announcement =
      await this.announcementRepository.getById(announcementId);

    if (!announcement) {
      throw new NotFoundException('No session found with the given id');
    }

    if (currentUserId !== announcement.course.professor.id) {
      throw new UnauthorizedException('You are not allowed to do this');
    }

    return announcement;
  }

  async getAllByCourse(
    courseId: string,
    currentUserId: string,
  ): Promise<Announcement[]> {
    const course = await this.courseService.getByIdWithRelations(
      courseId,
      currentUserId,
    );
    return this.announcementRepository.getAllByCourse(course);
  }

  async create(
    courseId: string,
    data: Omit<Announcement, 'id' | 'createdAt' | 'postedBy' | 'course'>,
    currentUserId: string,
  ): Promise<Announcement> {
    const course = await this.courseService.getById(courseId);
    const user = await this.userService.getById(currentUserId);

    if (currentUserId !== course.professor.id) {
      throw new UnauthorizedException('You are not allowed to do this');
    }

    const createdAt = new Date();

    const announcementData: Omit<Announcement, 'id'> = {
      ...data,
      createdAt,
      course,
      postedBy: user,
    };

    return this.announcementRepository.create(announcementData);
  }

  async update(
    announcementId: string,
    data: Omit<Announcement, 'id' | 'createdAt' | 'postedBy' | 'course'>,
    currentUserId: string,
  ): Promise<Announcement> {
    const announcement =
      await this.announcementRepository.getById(announcementId);

    if (!announcement) {
      throw new NotFoundException('No session found with the given id');
    }

    if (currentUserId !== announcement.course.professor.id) {
      throw new UnauthorizedException('You are not allowed to do this');
    }

    announcement.content = data.content;
    announcement.title = data.title;

    return this.announcementRepository.update(announcement);
  }

  async remove(announcementId: string, currentUserId: string): Promise<void> {
    const announcement =
      await this.announcementRepository.getById(announcementId);

    if (!announcement) {
      throw new NotFoundException('No session found with the given id');
    }

    if (currentUserId !== announcement.course.professor.id) {
      throw new UnauthorizedException('You are not allowed to do this');
    }

    await this.announcementRepository.remove(announcementId);
  }
}
