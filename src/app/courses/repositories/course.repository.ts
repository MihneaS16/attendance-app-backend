import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from '../entities/course.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CourseRepository {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
  ) {}

  async getAllJoinedByUser(userId: string): Promise<Course[]> {
    return this.courseRepository
      .createQueryBuilder('course')
      .innerJoin('course.students', 'student', 'student.id = :userId', {
        userId,
      })
      .leftJoinAndSelect('course.professor', 'professor')
      .getMany();
  }

  async getByIdWithRelations(id: string): Promise<Course | null> {
    return this.courseRepository.findOne({
      where: { id },
      relations: ['students', 'announcements'],
    });
  }

  async getByIdWithStudents(id: string): Promise<Course | null> {
    return this.courseRepository.findOne({
      where: { id },
      relations: ['students'],
    });
  }

  async getById(id: string): Promise<Course | null> {
    return this.courseRepository.findOneBy({ id });
  }

  async getByJoinCode(joinCode: string): Promise<Course | null> {
    return this.courseRepository.findOneBy({ joinCode });
  }

  async getByJoinCodeWithStudents(joinCode: string): Promise<Course | null> {
    return this.courseRepository.findOne({
      where: { joinCode },
      relations: ['students'],
    });
  }

  async create(
    data: Omit<Course, 'id' | 'students' | 'announcements' | 'courseSessions'>,
  ): Promise<Course> {
    return this.courseRepository.save(data);
  }

  async update(data: Course): Promise<Course> {
    return this.courseRepository.save(data);
  }

  async remove(id: string): Promise<void> {
    await this.courseRepository.delete(id);
  }
}
