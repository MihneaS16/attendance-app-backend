import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CourseRepository } from '../repositories/course.repository';
import { Course } from '../entities/course.entity';
import { UserService } from 'src/app/users/services/user.service';
import { Role } from 'src/app/users/enums/role.enum';

@Injectable()
export class CourseService {
  constructor(
    private readonly courseRepository: CourseRepository,
    private readonly userService: UserService,
  ) {}

  async getByIdWithRelations(
    courseId: string,
    currentUserId: string,
  ): Promise<Course> {
    const course = await this.courseRepository.getByIdWithRelations(courseId);

    if (!course) {
      throw new NotFoundException('No course found with the given id');
    }

    const isProfessor = course.professor.id === currentUserId;
    const isStudent = course.students.some(
      (student) => student.id === currentUserId,
    );

    if (!isProfessor && !isStudent) {
      throw new UnauthorizedException(
        'You are not allowed to access this course',
      );
    }

    return course;
  }

  async getById(courseId: string): Promise<Course> {
    const course = await this.courseRepository.getById(courseId);

    if (!course) {
      throw new NotFoundException('No course found with the given id');
    }

    return course;
  }

  async getAllJoinedByUser(currentUserId: string): Promise<Course[]> {
    return this.courseRepository.getAllJoinedByUser(currentUserId);
  }

  async create(
    data: Omit<
      Course,
      | 'id'
      | 'professor'
      | 'students'
      | 'announcements'
      | 'courseSessions'
      | 'joinCode'
    >,
    currentUserId: string,
  ): Promise<Course> {
    const currentUser = await this.userService.getById(currentUserId);

    if (!currentUser || currentUser.role !== Role.PROFESSOR) {
      throw new UnauthorizedException('Only professors can create courses');
    }

    const joinCode = await this.generateJoinCode();

    const courseData: Omit<
      Course,
      'id' | 'students' | 'announcements' | 'courseSessions'
    > = { ...data, professor: currentUser, joinCode };

    return this.courseRepository.create(courseData);
  }

  async generateJoinCode(): Promise<string> {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

    let joinCode: string = Array.from({ length: 6 })
      .map(() => characters[Math.floor(Math.random() * characters.length)])
      .join('');

    let isUnique = (await this.courseRepository.getByJoinCode(joinCode))
      ? true
      : false;

    if (!isUnique) {
      while (!isUnique) {
        joinCode = Array.from({ length: 5 })
          .map(() => characters[Math.floor(Math.random() * characters.length)])
          .join('');

        const existsCourse =
          await this.courseRepository.getByJoinCode(joinCode);

        if (!existsCourse) {
          isUnique = true;
        }
      }
    }

    return joinCode;
  }

  async joinCourseByCode(
    joinCode: string,
    currentUserId: string,
  ): Promise<Course> {
    const course =
      await this.courseRepository.getByJoinCodeWithStudents(joinCode);

    if (!course) {
      throw new NotFoundException(
        'There is no course having the given join code',
      );
    }

    const user = await this.userService.getById(currentUserId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isAlreadyEnrolled = course.students.some(
      (student) => student.id === currentUserId,
    );

    if (isAlreadyEnrolled) {
      throw new ConflictException('You are already enrolled in this course');
    }

    course.students.push(user);

    return await this.courseRepository.update(course);
  }

  async leaveCourse(courseId: string, currentUserId: string): Promise<void> {
    const course = await this.courseRepository.getByIdWithStudents(courseId);

    if (!course) {
      throw new NotFoundException('There is no course with the given id');
    }

    const isEnrolled = course.students.some(
      (student) => student.id === currentUserId,
    );

    if (!isEnrolled) {
      throw new ForbiddenException(
        'You must be enrolled in a course in order to leave it',
      );
    }

    course.students = course.students.filter(
      (student) => student.id !== currentUserId,
    );

    await this.courseRepository.update(course);
  }

  async update(
    courseId: string,
    data: Omit<
      Course,
      | 'id'
      | 'professor'
      | 'students'
      | 'announcements'
      | 'courseSessions'
      | 'joinCode'
    >,
    currentUserId: string,
  ): Promise<Course> {
    const course = await this.courseRepository.getByIdWithRelations(courseId);

    if (!course) {
      throw new NotFoundException('No course found with the given id');
    }

    if (currentUserId !== course.professor.id) {
      throw new UnauthorizedException('You are not allowed to do this');
    }

    course.name = data.name;
    course.maxMissed = data.maxMissed;

    return this.courseRepository.update(course);
  }

  async remove(courseId: string, currentUserId: string): Promise<void> {
    const course = await this.courseRepository.getById(courseId);

    if (!course) {
      throw new NotFoundException('No course found with the given id');
    }

    if (currentUserId !== course.professor.id) {
      throw new UnauthorizedException('You are not allowed to do this');
    }

    await this.courseRepository.remove(courseId);
  }
}
