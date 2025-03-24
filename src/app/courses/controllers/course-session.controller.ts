import { Body, Controller, Delete, Get, Param, Put } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CurrentUserId } from 'src/app/auth/decorators/current-user-id.decorator';
import { CourseSessionDTO } from '../dtos/course_sessions/course-session.dto';
import { CourseSessionMapper } from '../mappers/course-session.mapper';
import { CourseSessionService } from '../services/course-session.service';
import { Roles } from 'src/app/auth/decorators/roles.decorator';
import { Role } from 'src/app/users/enums/role.enum';
import { UpdateSessionDTO } from '../dtos/course_sessions/update-session.dto';

@ApiTags('Course Sessions')
@Controller('sessions')
export class CourseSessionController {
  constructor(private readonly courseSessionService: CourseSessionService) {}

  @Get(':id')
  @Roles([Role.PROFESSOR])
  @ApiOperation({
    summary: 'Get session by id',
  })
  @ApiOkResponse({ description: 'The session was successfully retreived' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @ApiNotFoundResponse({ description: 'Session not found' })
  async getSessionById(
    @Param('id') sessionId: string,
    @CurrentUserId() currentUserId: string,
  ): Promise<CourseSessionDTO> {
    const session = await this.courseSessionService.getById(
      sessionId,
      currentUserId,
    );
    return CourseSessionMapper.toDto(session);
  }

  @Put(':id')
  @Roles([Role.PROFESSOR])
  @ApiOperation({
    summary: 'Update session',
  })
  @ApiOkResponse({ description: 'The session was successfully updated' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @ApiNotFoundResponse({ description: 'Session not found' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  async updateSession(
    @Param('id') sessionId: string,
    @Body() data: UpdateSessionDTO,
    @CurrentUserId() currentUserId: string,
  ): Promise<CourseSessionDTO> {
    const sessionData = CourseSessionMapper.fromUpdateDto(data);
    const session = await this.courseSessionService.update(
      sessionId,
      sessionData,
      currentUserId,
    );

    return CourseSessionMapper.toDto(session);
  }

  @Delete(':id')
  @Roles([Role.PROFESSOR])
  @ApiOperation({
    summary: 'Update session',
  })
  @ApiOkResponse({ description: 'The session was successfully updated' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @ApiNotFoundResponse({ description: 'Session not found' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  async removeSession(
    @Param('id') sessionId: string,
    @CurrentUserId() currentUserId: string,
  ): Promise<void> {
    await this.courseSessionService.remove(sessionId, currentUserId);
  }
}
