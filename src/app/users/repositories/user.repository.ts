import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async getById(id: string): Promise<User | null> {
    return this.userRepository.findOneBy({ id });
  }

  async getByIdWithCoursesAttended(id: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id },
      relations: ['coursesAttended'],
    });
  }

  async getByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOneBy({ email });
  }

  async create(data: Omit<User, 'id'>): Promise<User> {
    return this.userRepository.save(data);
  }

  async partialUpdate(id: string, data: Partial<User>): Promise<User> {
    await this.userRepository.update(id, data);
    return this.userRepository.findOneByOrFail({ id });
  }

  async update(data: User): Promise<User> {
    return this.userRepository.save(data);
  }

  async remove(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }
}
