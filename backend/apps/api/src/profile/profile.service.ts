import { unlink } from 'node:fs/promises';
import { join } from 'node:path';
import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { ActivityAction } from '@app/contracts';
import { compare, hash } from 'bcryptjs';
import { Repository } from 'typeorm';
import { ActivityService } from '../activity/activity.service.js';
import { AuthenticatedUser } from '../common/auth.types.js';
import { toEmployeeResponse } from '../common/employee.presenter.js';
import { Employee } from '../database/entities/employee.entity.js';
import { ChangePasswordDto } from './dto/change-password.dto.js';
import { UpdateProfileDto } from './dto/update-profile.dto.js';

@Injectable()
export class ProfileService {
  private readonly logger = new Logger(ProfileService.name);

  constructor(
    @InjectRepository(Employee)
    private readonly employees: Repository<Employee>,
    private readonly activity: ActivityService,
    private readonly config: ConfigService,
  ) {}

  async findMe(user: AuthenticatedUser) {
    return toEmployeeResponse(await this.getOrFail(user.id));
  }

  async updatePhone(user: AuthenticatedUser, dto: UpdateProfileDto) {
    const employee = await this.getOrFail(user.id);
    const before = employee.phone;

    employee.phone = dto.phone;
    const saved = await this.employees.save(employee);

    if (before !== dto.phone) {
      await this.activity.record({
        action: ActivityAction.PROFILE_PHONE_UPDATED,
        actor: user,
        target: { id: saved.id, name: saved.name, email: saved.email },
        changes: [{ field: 'phone', before, after: dto.phone }],
      });
    }

    return toEmployeeResponse(saved);
  }

  async updatePhoto(user: AuthenticatedUser, filename: string) {
    const employee = await this.getOrFail(user.id);
    const before = employee.photoPath;

    employee.photoPath = filename;
    const saved = await this.employees.save(employee);

    if (before) {
      await this.removeFile(before);
    }

    await this.activity.record({
      action: ActivityAction.PROFILE_PHOTO_UPDATED,
      actor: user,
      target: { id: saved.id, name: saved.name, email: saved.email },
      changes: [{ field: 'photo', before, after: filename }],
    });

    return toEmployeeResponse(saved);
  }

  async changePassword(user: AuthenticatedUser, dto: ChangePasswordDto) {
    const employee = await this.getOrFail(user.id);

    if (!(await compare(dto.currentPassword, employee.passwordHash))) {
      throw new BadRequestException('Password saat ini salah');
    }

    if (await compare(dto.newPassword, employee.passwordHash)) {
      throw new BadRequestException(
        'Password baru tidak boleh sama dengan password lama',
      );
    }

    employee.passwordHash = await hash(dto.newPassword, 10);
    await this.employees.save(employee);

    await this.activity.record({
      action: ActivityAction.PROFILE_PASSWORD_CHANGED,
      actor: user,
      target: { id: employee.id, name: employee.name, email: employee.email },
      changes: [{ field: 'password', before: null, after: null }],
    });

    return { message: 'Password berhasil diperbarui' };
  }

  private async getOrFail(id: number): Promise<Employee> {
    const employee = await this.employees.findOne({ where: { id } });
    if (!employee) {
      throw new NotFoundException('Data karyawan tidak ditemukan');
    }
    return employee;
  }

  private async removeFile(filename: string): Promise<void> {
    const dir = this.config.get<string>('UPLOAD_DIR', 'uploads');
    try {
      await unlink(join(process.cwd(), dir, filename));
    } catch (error) {
      this.logger.warn(`Foto lama gagal dihapus: ${(error as Error).message}`);
    }
  }
}
