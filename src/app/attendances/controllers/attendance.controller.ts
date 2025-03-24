import {
  Controller,
  Post,
  Delete,
  Get,
  Param,
  Body,
  Put,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { AttendanceService } from '../services/attendance.service';
import { CurrentUserId } from 'src/app/auth/decorators/current-user-id.decorator';
import { Roles } from 'src/app/auth/decorators/roles.decorator';
import { Role } from 'src/app/users/enums/role.enum';
import { UpdateAttendanceDTO } from '../dtos/update-attendance.dto';
import { AttendanceMapper } from '../mappers/attendance.mapper';
import { AttendanceDTO } from '../dtos/attendance.dto';

@ApiTags('Attendance')
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post('mark/:sessionId')
  @Roles([Role.STUDENT])
  @ApiOperation({ summary: 'Mark attendance via QR code token' })
  @ApiOkResponse({ description: 'Attendance recorded' })
  @ApiUnauthorizedResponse({ description: 'Invalid or expired QR code' })
  @ApiNotFoundResponse({ description: 'Session or user not found' })
  async markAttendance(
    @Param('sessionId') sessionId: string,
    @Body() data: { token: string },
    @CurrentUserId() currentUserId: string,
  ): Promise<AttendanceDTO> {
    const attendance = await this.attendanceService.markAttendance(
      sessionId,
      currentUserId,
      data.token,
    );
    return AttendanceMapper.toDto(attendance);
  }

  @Put(':attendanceId')
  @Roles([Role.PROFESSOR])
  @ApiOperation({ summary: 'Update attendance (professor only)' })
  async updateAttendance(
    @Param('attendanceId') attendanceId: string,
    @Body() data: UpdateAttendanceDTO,
    @CurrentUserId() currentUserId: string,
  ): Promise<AttendanceDTO> {
    const attendance = await this.attendanceService.updateAttendanceStatus(
      attendanceId,
      currentUserId,
      data.status,
      data.excuseReason,
    );

    return AttendanceMapper.toDto(attendance);
  }

  @Get(':attendanceId')
  @ApiOperation({ summary: 'Get attendance record by id' })
  async getAttendance(
    @Param('attendanceId') attendanceId: string,
  ): Promise<AttendanceDTO> {
    const attendance =
      await this.attendanceService.getAttendanceById(attendanceId);

    return AttendanceMapper.toDto(attendance);
  }

  @Delete(':attendanceId')
  @Roles([Role.PROFESSOR])
  @ApiOperation({ summary: 'Delete attendance (professor only)' })
  async removeAttendance(
    @Param('attendanceId') attendanceId: string,
    @CurrentUserId() currentUserId: string,
  ): Promise<void> {
    await this.attendanceService.removeAttendance(attendanceId, currentUserId);
  }
}
