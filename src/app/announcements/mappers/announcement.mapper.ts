import { Announcement } from '../entities/announcement.entity';
import { AnnouncementDTO } from '../dtos/announcement.dto';
import { CreateAnnouncementDTO } from '../dtos/create-announcement.dto';
import { UpdateAnnouncementDTO } from '../dtos/update-announcement.dto';
import { UserMapper } from '../../users/mappers/user.mapper';

export class AnnouncementMapper {
  static toDto(entity: Announcement): AnnouncementDTO {
    return {
      id: entity.id,
      title: entity.title,
      content: entity.content,
      createdAt: entity.createdAt,
      postedBy: UserMapper.toProfessorDto(entity.postedBy),
    };
  }

  static fromCreateDto(
    dto: CreateAnnouncementDTO,
  ): Omit<Announcement, 'id' | 'createdAt' | 'postedBy' | 'course'> {
    return {
      title: dto.title,
      content: dto.content,
    };
  }

  static fromUpdateDto(
    dto: UpdateAnnouncementDTO,
  ): Omit<Announcement, 'id' | 'createdAt' | 'postedBy' | 'course'> {
    return {
      title: dto.title,
      content: dto.content,
    };
  }
}
