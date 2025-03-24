import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Course } from './course.entity';
import { Attendance } from 'src/app/attendances/entities/attendance.entity';

@Entity()
export class CourseSession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'session_label', nullable: false })
  sessionLabel: string;

  @CreateDateColumn({ name: 'session_date' })
  sessionDate: Date;

  @Column({ name: 'is_cancelled', nullable: false, default: false })
  isCancelled: boolean;

  @ManyToOne(() => Course, (course) => course.courseSessions, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'course_id' })
  course: Course;

  @OneToMany(() => Attendance, (attendance) => attendance.session)
  attendances: Attendance[];
}
