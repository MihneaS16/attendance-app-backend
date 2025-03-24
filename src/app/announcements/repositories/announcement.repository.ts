import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Announcement } from '../entities/announcement.entity';
import { Course } from 'src/app/courses/entities/course.entity';

@Injectable()
export class AnnouncementRepository {
  constructor(
    @InjectRepository(Announcement)
    private readonly announcementRepository: Repository<Announcement>,
  ) {}

  async getById(id: string): Promise<Announcement | null> {
    return this.announcementRepository.findOne({
      where: { id },
      relations: ['course'],
    });
  }

  async getAllByCourse(course: Course): Promise<Announcement[]> {
    return this.announcementRepository.find({
      where: { course },
      relations: ['course'],
    });
  }

  async create(data: Omit<Announcement, 'id'>): Promise<Announcement> {
    return this.announcementRepository.save(data);
  }

  async update(data: Announcement): Promise<Announcement> {
    return this.announcementRepository.save(data);
  }

  async remove(id: string): Promise<void> {
    await this.announcementRepository.delete(id);
  }
}
