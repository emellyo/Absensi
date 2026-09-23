import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AttendanceStatus } from '@app/contracts';
import { Employee } from './employee.entity.js';

// Satu karyawan hanya boleh punya satu MASUK dan satu PULANG per tanggal.
@Index('uq_attendance_per_day', ['employeeId', 'attendanceDate', 'status'], {
  unique: true,
})
@Entity('attendances')
export class Attendance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'employee_id' })
  employeeId: number;

  @ManyToOne(() => Employee, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @Column({ name: 'attendance_date', type: 'date' })
  attendanceDate: string;

  @Column({ name: 'attendance_time', type: 'time' })
  attendanceTime: string;

  @Column({ type: 'enum', enum: AttendanceStatus })
  status: AttendanceStatus;

  @Column({ name: 'recorded_at', type: 'datetime', precision: 3 })
  recordedAt: Date;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;
}
