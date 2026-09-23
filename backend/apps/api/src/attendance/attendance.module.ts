import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attendance } from '../database/entities/attendance.entity.js';
import { AdminAttendanceController } from './admin-attendance.controller.js';
import { AttendanceController } from './attendance.controller.js';
import { AttendanceService } from './attendance.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Attendance])],
  controllers: [AttendanceController, AdminAttendanceController],
  providers: [AttendanceService],
})
export class AttendanceModule {}
