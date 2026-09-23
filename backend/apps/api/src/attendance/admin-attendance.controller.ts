import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '@app/contracts';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { Roles, RolesGuard } from '../common/roles.guard.js';
import { AttendanceService } from './attendance.service.js';
import { AdminAttendanceQueryDto } from './dto/attendance-query.dto.js';

@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('admin/attendance')
export class AdminAttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Get()
  @ApiOperation({ summary: 'Absensi seluruh karyawan (read only)' })
  findAll(@Query() query: AdminAttendanceQueryDto) {
    return this.attendanceService.findAllForAdmin(query);
  }
}
