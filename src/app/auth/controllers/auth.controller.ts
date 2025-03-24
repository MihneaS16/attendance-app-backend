import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { CreateUserDTO } from 'src/app/users/dtos/create-user.dto';
import { StudentDTO } from 'src/app/users/dtos/student.dto';
import { ProfessorDTO } from 'src/app/users/dtos/professor.dto';
import { UserMapper } from 'src/app/users/mappers/user.mapper';
import { Role } from 'src/app/users/enums/role.enum';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { Public } from '../decorators/public.decorator';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { CurrentUser } from '../decorators/current-user.decorator';
import { User } from 'src/app/users/entities/user.entity';
import { JwtRefreshGuard } from '../guards/jwt-refresh.guard';
import { AuthPayloadDTO } from '../dtos/auth-payload.dto';
import { Response } from 'express';
import { CurrentUserId } from '../decorators/current-user-id.decorator';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @ApiOperation({
    summary: 'User register',
  })
  @ApiOkResponse({
    description: 'New user successfully registered',
  })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  async registerUser(
    @Body() data: CreateUserDTO,
    @Res({ passthrough: true }) response: Response,
  ): Promise<StudentDTO | ProfessorDTO> {
    const userData = UserMapper.fromCreateDto(data);
    const user = await this.authService.register(
      userData,
      response,
      data.deviceId,
    );

    return user.role === Role.STUDENT
      ? UserMapper.toStudentDto(user as User)
      : UserMapper.toProfessorDto(user as User);
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({
    summary: 'User login',
  })
  @ApiBody({
    description: 'User credentials',
    type: AuthPayloadDTO,
  })
  @ApiOkResponse({
    description: 'User successfully logged in',
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid credentials',
  })
  async loginUser(
    @CurrentUser() user: Omit<User, 'password'>,
    @Res({ passthrough: true }) response: Response,
  ): Promise<StudentDTO | ProfessorDTO> {
    await this.authService.login(user, response);
    return user.role === Role.STUDENT
      ? UserMapper.toStudentDto(user as User)
      : UserMapper.toProfessorDto(user as User);
  }

  @Post('logout')
  @ApiOperation({
    summary: 'User logout',
  })
  @ApiOkResponse({
    description: 'User successfully logged out',
  })
  @ApiUnauthorizedResponse({
    description: 'You must be logged in first in order to log out',
  })
  async logoutUser(
    @CurrentUserId() userId: string,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    await this.authService.logout(userId, response);
  }

  @Public()
  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  @ApiOperation({
    summary: 'Refresh tokens',
    description: 'Exchange a valid refresh token for a new Access/Refresh pair',
  })
  @ApiOkResponse({
    description: 'Tokens successfully refreshed',
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid refresh token',
  })
  async refreshTokens(
    @CurrentUser() user: Omit<User, 'password'>,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    await this.authService.login(user, response);
  }
}
