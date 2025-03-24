import { Body, Controller, Delete, Get, Param, Put } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UserService } from '../services/user.service';
import { StudentDTO } from '../dtos/student.dto';
import { ProfessorDTO } from '../dtos/professor.dto';
import { UserMapper } from '../mappers/user.mapper';
import { Role } from '../enums/role.enum';
import { UpdateUserDTO } from '../dtos/update-user.dto';
import { CurrentUserId } from 'src/app/auth/decorators/current-user-id.decorator';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  @ApiOkResponse({ description: 'The user was successfully retreived' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @ApiNotFoundResponse({ description: 'User not found' })
  async getUserById(
    @Param('id') id: string,
  ): Promise<StudentDTO | ProfessorDTO> {
    const user = await this.userService.getById(id);
    return user.role === Role.STUDENT
      ? UserMapper.toStudentDto(user)
      : UserMapper.toProfessorDto(user);
  }

  @Put(':id')
  @ApiOkResponse({ description: 'The user was successfully updated' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @ApiNotFoundResponse({ description: 'User not found' })
  async updateUser(
    @Param('id') id: string,
    @Body() dto: UpdateUserDTO,
    @CurrentUserId() currentUserId: string,
  ) {
    const user = UserMapper.fromUpdateDto(dto);
    return this.userService.update(id, user, currentUserId);
  }

  @Delete(':id')
  @ApiOkResponse({ description: 'The user was successfully retreived' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @ApiNotFoundResponse({ description: 'User not found' })
  async removeUser(
    @Param('id') id: string,
    @CurrentUserId() currentUserId: string,
  ): Promise<void> {
    return await this.userService.remove(id, currentUserId);
  }
}
