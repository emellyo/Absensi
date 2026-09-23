import { Controller, Get, HttpCode, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { AuthenticatedUser } from '../common/auth.types.js';
import { CurrentUser } from '../common/current-user.decorator.js';
import { AttendanceService } from './attendance.service.js';
import { AttendanceRangeDto } from './dto/attendance-query.dto.js';

@ApiTags('attendance')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post('check-in')
  @HttpCode(201)
  @ApiOperation({ summary: 'Absen masuk' })
  checkIn(@CurrentUser() user: AuthenticatedUser) {
    return this.attendanceService.checkIn(user);
  }

  @Post('check-out')
  @HttpCode(201)
  @ApiOperation({ summary: 'Absen pulang' })
  checkOut(@CurrentUser() user: AuthenticatedUser) {
    return this.attendanceService.checkOut(user);
  }

  @Get('today')
  @ApiOperation({ summary: 'Status absen hari ini' })
  today(@CurrentUser() user: AuthenticatedUser) {
    return this.attendanceService.today(user);
  }

  @Get('summary')
  @ApiOperation({
    summary:
      'Summary absen. Default awal bulan berjalan sampai hari ini, bisa difilter date range',
  })
  summary(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: AttendanceRangeDto,
  ) {
    return this.attendanceService.summary(user, query);
  }
}
