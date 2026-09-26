import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AttendanceStatus } from '@app/contracts';
import { Between, Repository } from 'typeorm';
import { AuthenticatedUser } from '../common/auth.types.js';
import {
  formatLocalDateLong,
  startOfCurrentMonth,
  toLocalDate,
  toLocalTime,
} from '../common/date.util.js';
import { Attendance } from '../database/entities/attendance.entity.js';
import {
  AdminAttendanceQueryDto,
  AttendanceRangeDto,
} from './dto/attendance-query.dto.js';

interface SummaryRow {
  date: string;
  masuk: string | null;
  pulang: string | null;
}

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private readonly attendances: Repository<Attendance>,
  ) {}

  async checkIn(user: AuthenticatedUser) {
    return this.record(user, AttendanceStatus.MASUK);
  }

  async checkOut(user: AuthenticatedUser) {
    const now = new Date();
    const today = toLocalDate(now);

    const masuk = await this.attendances.findOne({
      where: {
        employeeId: user.id,
        attendanceDate: today,
        status: AttendanceStatus.MASUK,
      },
    });

    if (!masuk) {
      throw new BadRequestException(
        'Anda belum melakukan absen masuk hari ini',
      );
    }

    return this.record(user, AttendanceStatus.PULANG, now);
  }

  /** Status absen hari ini, dipakai untuk menentukan tombol yang aktif di UI. */
  async today(user: AuthenticatedUser) {
    const today = toLocalDate(new Date());
    const rows = await this.attendances.find({
      where: { employeeId: user.id, attendanceDate: today },
    });

    const find = (status: AttendanceStatus) =>
      rows.find((row) => row.status === status)?.attendanceTime ?? null;

    return {
      date: today,
      masuk: find(AttendanceStatus.MASUK),
      pulang: find(AttendanceStatus.PULANG),
    };
  }

  async summary(user: AuthenticatedUser, query: AttendanceRangeDto) {
    const { from, to } = this.resolveRange(query);

    const rows = await this.attendances.find({
      where: {
        employeeId: user.id,
        attendanceDate: Between(from, to),
      },
      order: { attendanceDate: 'DESC', attendanceTime: 'ASC' },
    });

    const grouped = new Map<string, SummaryRow>();
    for (const row of rows) {
      const entry = grouped.get(row.attendanceDate) ?? {
        date: row.attendanceDate,
        masuk: null,
        pulang: null,
      };

      if (row.status === AttendanceStatus.MASUK) {
        entry.masuk = row.attendanceTime;
      } else {
        entry.pulang = row.attendanceTime;
      }

      grouped.set(row.attendanceDate, entry);
    }

    const items = [...grouped.values()];

    return {
      from,
      to,
      items,
      totals: {
        hariMasuk: items.filter((item) => item.masuk).length,
        hariPulang: items.filter((item) => item.pulang).length,
      },
    };
  }

  /** Dipakai admin HRD: absensi seluruh karyawan, read only. */
  async findAllForAdmin(query: AdminAttendanceQueryDto) {
    const { from, to } = this.resolveRange(query);
    const page = query.page ?? 1;
    const limit = query.limit ?? 25;

    const builder = this.attendances
      .createQueryBuilder('attendance')
      .innerJoin('attendance.employee', 'employee')
      .addSelect([
        'employee.id',
        'employee.name',
        'employee.email',
        'employee.position',
      ])
      .where('attendance.attendance_date BETWEEN :from AND :to', { from, to })
      .orderBy('attendance.attendance_date', 'DESC')
      .addOrderBy('attendance.attendance_time', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    if (query.employeeId) {
      builder.andWhere('attendance.employee_id = :employeeId', {
        employeeId: query.employeeId,
      });
    }

    const [rows, total] = await builder.getManyAndCount();

    return {
      from,
      to,
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
      items: rows.map((row) => ({
        id: row.id,
        date: row.attendanceDate,
        time: row.attendanceTime,
        status: row.status,
        recordedAt: row.recordedAt,
        employee: {
          id: row.employee.id,
          name: row.employee.name,
          email: row.employee.email,
          position: row.employee.position,
        },
      })),
    };
  }

  private async record(
    user: AuthenticatedUser,
    status: AttendanceStatus,
    now: Date = new Date(),
  ) {
    const attendanceDate = toLocalDate(now);
    const attendanceTime = toLocalTime(now);

    const existing = await this.attendances.findOne({
      where: { employeeId: user.id, attendanceDate, status },
    });

    if (existing) {
      throw new ConflictException(
        status === AttendanceStatus.MASUK
          ? 'Anda sudah melakukan absen masuk hari ini'
          : 'Anda sudah melakukan absen pulang hari ini',
      );
    }

    const saved = await this.attendances.save(
      this.attendances.create({
        employeeId: user.id,
        attendanceDate,
        attendanceTime,
        status,
        recordedAt: now,
      }),
    );

    const label = status === AttendanceStatus.MASUK ? 'masuk' : 'pulang';

    return {
      id: saved.id,
      date: saved.attendanceDate,
      time: saved.attendanceTime,
      status: saved.status,
      message: `Absen ${label} tercatat ${formatLocalDateLong(attendanceDate)} pukul ${attendanceTime}`,
    };
  }

  private resolveRange(query: AttendanceRangeDto) {
    const from = query.from ?? startOfCurrentMonth();
    const to = query.to ?? toLocalDate(new Date());

    if (from > to) {
      throw new BadRequestException(
        'Tanggal awal tidak boleh melebihi tanggal akhir',
      );
    }

    return { from, to };
  }
}
