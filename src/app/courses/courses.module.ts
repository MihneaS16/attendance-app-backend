import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './entities/course.entity';
import { UsersModule } from '../users/users.module';
import { CourseService } from './services/course.service';
import { CourseController } from './controllers/course.controller';
import { CourseRepository } from './repositories/course.repository';
import { CourseSession } from './entities/course-session.entity';
import { CourseSessionRepository } from './repositories/course-session.repository';
import { CourseSessionService } from './services/course-session.service';
import { CourseSessionController } from './controllers/course-session.controller';
import { AnnouncementsModule } from '../announcements/announcements.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Course, CourseSession]),
    UsersModule,
    forwardRef(() => AnnouncementsModule),
  ],
  providers: [
    CourseRepository,
    CourseService,
    CourseSessionRepository,
    CourseSessionService,
  ],
  exports: [CourseService, CourseSessionService],
  controllers: [CourseController, CourseSessionController],
})
export class CoursesModule {}
