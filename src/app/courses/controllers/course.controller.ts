import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CourseDTO } from '../dtos/courses/course.dto';
import { CourseService } from '../services/course.service';
import { CourseMapper } from '../mappers/course.mapper';
import { CreateCourseDTO } from '../dtos/courses/create-course.dto';
import { Roles } from 'src/app/auth/decorators/roles.decorator';
import { Role } from 'src/app/users/enums/role.enum';
import { CurrentUserId } from 'src/app/auth/decorators/current-user-id.decorator';
import { UpdateCourseDTO } from '../dtos/courses/update-course.dto';
import { CourseSessionDTO } from '../dtos/course_sessions/course-session.dto';
import { CourseSessionService } from '../services/course-session.service';
import { CourseSessionMapper } from '../mappers/course-session.mapper';
import { CreateSessionDTO } from '../dtos/course_sessions/create-session.dto';
import { AnnouncementDTO } from 'src/app/announcements/dtos/announcement.dto';
import { AnnouncementMapper } from 'src/app/announcements/mappers/announcement.mapper';
import { AnnouncementService } from 'src/app/announcements/services/announcement.service';
import { CreateAnnouncementDTO } from 'src/app/announcements/dtos/create-announcement.dto';
import { JoinCourseDTO } from '../dtos/courses/join-course.dto';

@ApiTags('Courses')
@Controller('courses')
export class CourseController {
  constructor(
    private readonly courseService: CourseService,
    private readonly courseSessionService: CourseSessionService,
    private readonly announcementService: AnnouncementService,
  ) {}

  @Get('joined')
  @Roles([Role.STUDENT])
  @ApiOperation({
    summary: 'Get courses joined by student',
  })
  @ApiOkResponse({ description: 'The courses were successfully retreived' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  async getCoursesJoinedByUser(
    @CurrentUserId() currentUserId: string,
  ): Promise<CourseDTO[]> {
    const courses = await this.courseService.getAllJoinedByUser(currentUserId);
    return courses.map((course) => CourseMapper.toDto(course));
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get course by id',
  })
  @ApiOkResponse({ description: 'The course was successfully retreived' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @ApiNotFoundResponse({ description: 'Course not found' })
  async getCourseById(
    @Param('id') courseId: string,
    @CurrentUserId() currentUserId: string,
  ): Promise<CourseDTO> {
    const course = await this.courseService.getByIdWithRelations(
      courseId,
      currentUserId,
    );
    return CourseMapper.toDto(course);
  }

  @Get(':id/sessions')
  @ApiOperation({
    summary: 'Get the sessions of a course',
  })
  @ApiOkResponse({ description: 'The sessions were successfully retreived' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  async getCourseSessions(
    @Param('id') courseId: string,
    @CurrentUserId() currentUserId: string,
  ): Promise<CourseSessionDTO[]> {
    const courseSessions = await this.courseSessionService.getAllByCourse(
      courseId,
      currentUserId,
    );
    return courseSessions.map((courseSession) =>
      CourseSessionMapper.toDtoWithoutAttendances(courseSession),
    );
  }

  @Get(':id/announcements')
  @ApiOperation({
    summary: 'Get the announcements of a course',
  })
  @ApiOkResponse({
    description: 'The announcements were successfully retreived',
  })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  async getCourseAnnouncements(
    @Param('id') courseId: string,
    @CurrentUserId() currentUserId: string,
  ): Promise<AnnouncementDTO[]> {
    const announcements = await this.announcementService.getAllByCourse(
      courseId,
      currentUserId,
    );
    return announcements.map((announcement) =>
      AnnouncementMapper.toDto(announcement),
    );
  }

  @Post(':id/sessions')
  @Roles([Role.PROFESSOR])
  @ApiOperation({
    summary: 'Create a course session',
  })
  @ApiOkResponse({ description: 'The session was successfully created' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  async createCourseSession(
    @Param('id') courseId: string,
    @Body() data: CreateSessionDTO,
    @CurrentUserId() currentUserId: string,
  ): Promise<CourseSessionDTO> {
    const sessionData = CourseSessionMapper.fromCreateDto(data);
    const session = await this.courseSessionService.create(
      courseId,
      sessionData,
      currentUserId,
    );
    return CourseSessionMapper.toDto(session);
  }

  @Post(':id/announcements')
  @Roles([Role.PROFESSOR])
  @ApiOperation({
    summary: 'Create a course announcement',
  })
  @ApiOkResponse({ description: 'The announcement was successfully created' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  async createAnnouncement(
    @Param('id') courseId: string,
    @Body() data: CreateAnnouncementDTO,
    @CurrentUserId() currentUserId: string,
  ): Promise<AnnouncementDTO> {
    const announcementData = AnnouncementMapper.fromCreateDto(data);
    const announcement = await this.announcementService.create(
      courseId,
      announcementData,
      currentUserId,
    );
    return AnnouncementMapper.toDto(announcement);
  }

  @Post('join')
  @Roles([Role.STUDENT])
  @ApiOperation({
    summary: 'Join a course (as a student)',
  })
  @ApiOkResponse({ description: 'The course was succesfully joined' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  async joinCourse(
    @Body() data: JoinCourseDTO,
    @CurrentUserId() currentUserId: string,
  ): Promise<CourseDTO> {
    const joinedCourse = await this.courseService.joinCourseByCode(
      data.joinCode,
      currentUserId,
    );
    return CourseMapper.toDto(joinedCourse);
  }

  @Post()
  @Roles([Role.PROFESSOR])
  @ApiOperation({ summary: 'Create course' })
  @ApiOkResponse({ description: 'The course was successfully created' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  async createCourse(
    @Body() data: CreateCourseDTO,
    @CurrentUserId() currentUserId: string,
  ): Promise<CourseDTO> {
    const courseData = CourseMapper.fromCreateDto(data);
    const course = await this.courseService.create(courseData, currentUserId);
    return CourseMapper.toDto(course);
  }

  @Put(':id')
  @Roles([Role.PROFESSOR])
  @ApiOperation({ summary: 'Update course' })
  @ApiOkResponse({ description: 'The course was successfully updated' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  async updateCourse(
    @Param('id') courseId: string,
    @Body() data: UpdateCourseDTO,
    @CurrentUserId() currentUserId: string,
  ): Promise<CourseDTO> {
    const courseData = CourseMapper.fromUpdateDto(data);
    const course = await this.courseService.update(
      courseId,
      courseData,
      currentUserId,
    );
    return CourseMapper.toDto(course);
  }

  @Put(':id/leave')
  @Roles([Role.STUDENT])
  @ApiOperation({
    summary: 'Leave a course (as a student)',
  })
  @ApiOkResponse({ description: 'The course was succesfully left' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  async leaveCourse(
    @Param('id') courseId: string,
    @CurrentUserId() currentUserId: string,
  ): Promise<void> {
    await this.courseService.leaveCourse(courseId, currentUserId);
  }

  @Delete(':id')
  @Roles([Role.PROFESSOR])
  @ApiOperation({ summary: 'Delete course' })
  @ApiOkResponse({ description: 'The course was successfully deleted' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  async removeCourse(
    @Param('id') courseId: string,
    @CurrentUserId() currentUserId: string,
  ): Promise<void> {
    await this.courseService.remove(courseId, currentUserId);
  }
}
