import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { AppConfigPaths } from './shared/config/app.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoursesModule } from './courses/courses.module';
import { AnnouncementsModule } from './announcements/announcements.module';
import { AttendancesModule } from './attendances/attendances.module';
import { User } from './users/entities/user.entity';
import { Course } from './courses/entities/course.entity';
import { Announcement } from './announcements/entities/announcement.entity';
import { CourseSession } from './courses/entities/course-session.entity';
import { Attendance } from './attendances/entities/attendance.entity';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: Joi.object({
        [AppConfigPaths.database.host]: Joi.string().required(),
        [AppConfigPaths.database.port]: Joi.string().required(),
        [AppConfigPaths.database.username]: Joi.string().required(),
        [AppConfigPaths.database.password]: Joi.string().required(),
        [AppConfigPaths.database.database]: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.getOrThrow<string>(AppConfigPaths.database.host),
        port: +configService.getOrThrow<string>(AppConfigPaths.database.port),
        username: configService.getOrThrow<string>(
          AppConfigPaths.database.username,
        ),
        password: configService.getOrThrow<string>(
          AppConfigPaths.database.password,
        ),
        database: configService.getOrThrow<string>(
          AppConfigPaths.database.database,
        ),
        entities: [User, Course, Announcement, CourseSession, Attendance],
        autoLoadEntities: true,
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    CoursesModule,
    AnnouncementsModule,
    AttendancesModule,
    AuthModule,
    HealthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
