import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { Role } from '../enums/role.enum';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getById(userId: string): Promise<User> {
    const user = await this.userRepository.getById(userId);
    if (!user) {
      throw new NotFoundException('No user found with the given id');
    }
    return user;
  }

  async getByIdWithCoursesAttended(userId: string): Promise<User> {
    const user = await this.userRepository.getByIdWithCoursesAttended(userId);
    if (!user) {
      throw new NotFoundException('No user found with the given id');
    }
    return user;
  }

  async getByEmail(email: string): Promise<User> {
    const user = await this.userRepository.getByEmail(email);
    if (!user) {
      throw new NotFoundException('No user found with the given email');
    }
    return user;
  }

  async isEmailAvailable(email: string): Promise<boolean> {
    const user = await this.userRepository.getByEmail(email);
    return user ? false : true;
  }

  async create(data: Omit<User, 'id'>, deviceId?: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const isEmailAvailable = await this.isEmailAvailable(data.email);

    if (!isEmailAvailable) {
      throw new ConflictException('A user already exists with this email');
    }

    if (data.role === Role.STUDENT && !deviceId) {
      throw new ConflictException('Students must have a device ID');
    }

    if (data.role === Role.PROFESSOR && deviceId) {
      throw new ConflictException('Teachers must not have a device ID');
    }

    return this.userRepository.create({
      ...data,
      password: hashedPassword,
      deviceId: data.role === Role.STUDENT ? deviceId : undefined,
      deviceLastChanged: data.role === Role.STUDENT ? new Date() : undefined,
    });
  }

  async update(
    userId: string,
    data: Partial<User>,
    currentUserId: string,
  ): Promise<User> {
    const user = await this.getById(userId);

    if (!user) {
      throw new NotFoundException('There is no user with the given id');
    }

    if (userId !== currentUserId) {
      throw new UnauthorizedException('You are not allowed to do this');
    }

    user.deviceId = data.deviceId;

    return this.userRepository.update(user);
  }

  async updateRefreshToken(
    userId: string,
    refreshToken: string | null,
  ): Promise<void> {
    await this.userRepository.partialUpdate(userId, { refreshToken });
  }

  async remove(userId: string, currentUserId: string): Promise<void> {
    const user = await this.getById(userId);

    if (!user) {
      throw new NotFoundException('No user found with the given id');
    }

    if (userId !== currentUserId) {
      throw new UnauthorizedException('You are not allowed to do this');
    }
    await this.userRepository.remove(userId);
  }
}
