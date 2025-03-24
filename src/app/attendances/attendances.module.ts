import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoursesModule } from '../courses/courses.module';
import { AttendanceRepository } from './repositories/attendance.repository';
import { AttendanceService } from './services/attendance.service';
import { AttendanceController } from './controllers/attendance.controller';
import { UsersModule } from '../users/users.module';
import { Attendance } from './entities/attendance.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Attendance]), CoursesModule, UsersModule],
  providers: [AttendanceRepository, AttendanceService],
  exports: [AttendanceService],
  controllers: [AttendanceController],
})
export class AttendancesModule {}
