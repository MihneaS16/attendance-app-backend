import { CourseSession } from 'src/app/courses/entities/course-session.entity';
import { User } from 'src/app/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AttendanceStatus } from '../enums/attendance-status.enum';

@Entity()
export class Attendance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: AttendanceStatus, nullable: false })
  status: AttendanceStatus;

  @Column({ name: 'excuse_reason', nullable: true })
  excuseReason?: string;

  @ManyToOne(() => User, (user) => user.attendances, { eager: true })
  @JoinColumn({ name: 'student_id' })
  student: User;

  @ManyToOne(
    () => CourseSession,
    (courseSession) => courseSession.attendances,
    { eager: true, onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'session_id' })
  session: CourseSession;
}
