import { Announcement } from 'src/app/announcements/entities/announcement.entity';
import { User } from 'src/app/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CourseSession } from './course-session.entity';

@Entity()
export class Course {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ name: 'max_missed', nullable: true })
  maxMissed: number;

  @Column({ name: 'join_code', nullable: false, unique: true })
  joinCode: string;

  @ManyToOne(() => User, (user) => user.coursesTaught, { eager: true })
  @JoinColumn({ name: 'professor_id' })
  professor: User;

  @ManyToMany(() => User, (user) => user.coursesAttended, {
    cascade: ['insert'],
  })
  @JoinTable({
    name: 'enrollments',
    joinColumn: {
      name: 'course_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'student_id',
      referencedColumnName: 'id',
    },
  })
  students: User[];

  @OneToMany(() => Announcement, (announcement) => announcement.postedBy)
  announcements: Announcement[];

  @OneToMany(() => CourseSession, (courseSession) => courseSession.course)
  courseSessions: CourseSession[];
}
