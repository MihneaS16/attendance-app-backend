import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Announcement } from './entities/announcement.entity';
import { AnnouncementRepository } from './repositories/announcement.repository';
import { AnnouncementService } from './services/announcement.service';
import { AnnouncementController } from './controllers/announcement.controller';
import { CoursesModule } from '../courses/courses.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Announcement]),
    forwardRef(() => CoursesModule),
    UsersModule,
  ],
  providers: [AnnouncementRepository, AnnouncementService],
  exports: [AnnouncementService],
  controllers: [AnnouncementController],
})
export class AnnouncementsModule {}
