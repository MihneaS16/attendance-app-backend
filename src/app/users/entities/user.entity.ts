import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from '../enums/role.enum';
import { Course } from 'src/app/courses/entities/course.entity';
import { Attendance } from 'src/app/attendances/entities/attendance.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'email', unique: true, nullable: false })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.STUDENT,
    nullable: false,
  })
  role: Role;

  @Column({ name: 'first_name', nullable: false })
  firstName: string;

  @Column({ name: 'last_name', nullable: false })
  lastName: string;

  @Column({ nullable: true, type: 'text' })
  refreshToken?: string | null;

  @Column({ name: 'device_id', nullable: true, unique: true, type: 'text' })
  deviceId?: string;

  @Column({
    name: 'device_last_changed',
    nullable: true,
    unique: true,
    type: 'timestamp',
  })
  deviceLastChanged?: Date;

  @OneToMany(() => Course, (course) => course.professor)
  coursesTaught?: Course[];

  @OneToMany(() => Attendance, (attendance) => attendance.student)
  attendances?: Attendance[];

  @ManyToMany(() => Course, (course) => course.students)
  coursesAttended?: Course[];
}
