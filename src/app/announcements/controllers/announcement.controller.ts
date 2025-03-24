import { Body, Controller, Delete, Get, Param, Put } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AnnouncementService } from '../services/announcement.service';
import { Roles } from 'src/app/auth/decorators/roles.decorator';
import { Role } from 'src/app/users/enums/role.enum';
import { CurrentUserId } from 'src/app/auth/decorators/current-user-id.decorator';
import { AnnouncementDTO } from '../dtos/announcement.dto';
import { AnnouncementMapper } from '../mappers/announcement.mapper';
import { UpdateAnnouncementDTO } from '../dtos/update-announcement.dto';

@ApiTags('Announcements')
@Controller('announcements')
export class AnnouncementController {
  constructor(private readonly announcementService: AnnouncementService) {}

  @Get(':id')
  @Roles([Role.PROFESSOR])
  @ApiOperation({
    summary: 'Get announcement by id',
  })
  @ApiOkResponse({ description: 'The announcement was successfully retreived' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @ApiNotFoundResponse({ description: 'Annoucement not found' })
  async getAnnouncementById(
    @Param('id') announcementId: string,
    @CurrentUserId() currentUserId: string,
  ): Promise<AnnouncementDTO> {
    const announcement = await this.announcementService.getById(
      announcementId,
      currentUserId,
    );
    return AnnouncementMapper.toDto(announcement);
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
    @Param('id') announcementId: string,
    @Body() data: UpdateAnnouncementDTO,
    @CurrentUserId() currentUserId: string,
  ): Promise<AnnouncementDTO> {
    const announcementData = AnnouncementMapper.fromUpdateDto(data);
    const announcement = await this.announcementService.update(
      announcementId,
      announcementData,
      currentUserId,
    );

    return AnnouncementMapper.toDto(announcement);
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
    await this.announcementService.remove(sessionId, currentUserId);
  }
}
