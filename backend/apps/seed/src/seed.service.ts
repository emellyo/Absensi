import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AttendanceStatus, Role } from '@app/contracts';
import { hash } from 'bcryptjs';
import { Repository } from 'typeorm';
import { Attendance } from '../../api/src/database/entities/attendance.entity.js';
import { Employee } from '../../api/src/database/entities/employee.entity.js';
import {
  startOfCurrentMonth,
  toLocalDate,
} from '../../api/src/common/date.util.js';

interface SeedPerson {
  name: string;
  email: string;
  password: string;
  position: string;
  phone: string;
  role: Role;
}

const PEOPLE: SeedPerson[] = [
  {
    name: 'Rina Hartati',
    email: 'hrd@dexagroup.com',
    password: 'Admin123!',
    position: 'HR Business Partner',
    phone: '081200010001',
    role: Role.ADMIN,
  },
  {
    name: 'Bayu',
    email: 'bayu@dexagroup.com',
    password: 'Password123!',
    position: 'Software Engineer',
    phone: '081200020002',
    role: Role.EMPLOYEE,
  },
  {
    name: 'Siti Rahmawati',
    email: 'siti.rahmawati@dexagroup.com',
    password: 'Password123!',
    position: 'QA Engineer',
    phone: '081200030003',
    role: Role.EMPLOYEE,
  },
  {
    name: 'Andi Wijaya',
    email: 'andi.wijaya@dexagroup.com',
    password: 'Password123!',
    position: 'Product Designer',
    phone: '081200040004',
    role: Role.EMPLOYEE,
  },
  {
    name: 'Dewi Lestari',
    email: 'dewi.lestari@dexagroup.com',
    password: 'Password123!',
    position: 'Business Analyst',
    phone: '081200050005',
    role: Role.EMPLOYEE,
  },
];

@Injectable()
export class SeedService {
  private readonly logger = new Logger('Seed');

  constructor(
    @InjectRepository(Employee)
    private readonly employees: Repository<Employee>,
    @InjectRepository(Attendance)
    private readonly attendances: Repository<Attendance>,
  ) {}

  async run(): Promise<void> {
    const saved: Employee[] = [];

    for (const person of PEOPLE) {
      const existing = await this.employees.findOne({
        where: { email: person.email },
      });

      if (existing) {
        saved.push(existing);
        this.logger.log(`Karyawan sudah ada: ${person.email}`);
        continue;
      }

      saved.push(
        await this.employees.save(
          this.employees.create({
            name: person.name,
            email: person.email,
            passwordHash: await hash(person.password, 10),
            position: person.position,
            phone: person.phone,
            role: person.role,
          }),
        ),
      );
      this.logger.log(`Karyawan dibuat: ${person.email}`);
    }

    for (const employee of saved.filter((e) => e.role === Role.EMPLOYEE)) {
      await this.seedAttendance(employee);
    }

    this.logger.log('Seed selesai.');
    this.logger.log('Admin HRD  : hrd@dexagroup.com / Admin123!');
    this.logger.log('Karyawan   : bayu@dexagroup.com / Password123!');
  }

  /** Riwayat absensi hari kerja dari awal bulan berjalan sampai hari ini. */
  private async seedAttendance(employee: Employee): Promise<void> {
    const existing = await this.attendances.countBy({ employeeId: employee.id });
    if (existing > 0) {
      this.logger.log(`Absensi ${employee.email} sudah ada, dilewati`);
      return;
    }

    const today = toLocalDate(new Date());
    const rows: Attendance[] = [];

    for (const date of workdaysBetween(startOfCurrentMonth(), today)) {
      // Sesekali karyawan tidak absen, supaya data terlihat wajar.
      if (Math.random() < 0.12) {
        continue;
      }

      const masuk = randomTime(7, 45, 8, 40);
      rows.push(
        this.attendances.create({
          employeeId: employee.id,
          attendanceDate: date,
          attendanceTime: masuk,
          status: AttendanceStatus.MASUK,
          recordedAt: new Date(`${date}T${masuk}+07:00`),
        }),
      );

      // Hari ini absen pulang belum tentu sudah dilakukan.
      if (date === today && new Date().getUTCHours() < 10) {
        continue;
      }

      const pulang = randomTime(17, 0, 18, 30);
      rows.push(
        this.attendances.create({
          employeeId: employee.id,
          attendanceDate: date,
          attendanceTime: pulang,
          status: AttendanceStatus.PULANG,
          recordedAt: new Date(`${date}T${pulang}+07:00`),
        }),
      );
    }

    await this.attendances.save(rows);
    this.logger.log(`Absensi ${employee.email}: ${rows.length} baris`);
  }
}

function workdaysBetween(from: string, to: string): string[] {
  const dates: string[] = [];
  const cursor = new Date(`${from}T00:00:00Z`);
  const end = new Date(`${to}T00:00:00Z`);

  while (cursor <= end) {
    const day = cursor.getUTCDay();
    if (day !== 0 && day !== 6) {
      dates.push(cursor.toISOString().slice(0, 10));
    }
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  return dates;
}

function randomTime(
  fromHour: number,
  fromMinute: number,
  toHour: number,
  toMinute: number,
): string {
  const start = fromHour * 60 + fromMinute;
  const end = toHour * 60 + toMinute;
  const total = start + Math.floor(Math.random() * (end - start));
  const hour = String(Math.floor(total / 60)).padStart(2, '0');
  const minute = String(total % 60).padStart(2, '0');
  return `${hour}:${minute}:00`;
}
