import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ActivityAction, ActivityChange, Role } from '@app/contracts';
import { hash } from 'bcryptjs';
import { Like, Repository } from 'typeorm';
import { ActivityService } from '../activity/activity.service.js';
import { AuthenticatedUser } from '../common/auth.types.js';
import { toEmployeeResponse } from '../common/employee.presenter.js';
import { Employee } from '../database/entities/employee.entity.js';
import { CreateEmployeeDto } from './dto/create-employee.dto.js';
import { ListEmployeesDto } from './dto/list-employees.dto.js';
import { UpdateEmployeeDto } from './dto/update-employee.dto.js';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private readonly employees: Repository<Employee>,
    private readonly activity: ActivityService,
  ) {}

  async findAll(query: ListEmployeesDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 25;
    const search = query.search?.trim();

    const where = search
      ? [{ name: Like(`%${search}%`) }, { email: Like(`%${search}%`) }]
      : {};

    const [rows, total] = await this.employees.findAndCount({
      where,
      order: { name: 'ASC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
      items: rows.map(toEmployeeResponse),
    };
  }

  async findOne(id: number) {
    return toEmployeeResponse(await this.getOrFail(id));
  }

  async create(actor: AuthenticatedUser, dto: CreateEmployeeDto) {
    const email = dto.email.toLowerCase().trim();

    if (await this.employees.existsBy({ email })) {
      throw new ConflictException('Email perusahaan sudah terdaftar');
    }

    const saved = await this.employees.save(
      this.employees.create({
        name: dto.name.trim(),
        email,
        passwordHash: await hash(dto.password, 10),
        position: dto.position.trim(),
        phone: dto.phone ?? null,
        role: dto.role ?? Role.EMPLOYEE,
      }),
    );

    await this.activity.record({
      action: ActivityAction.EMPLOYEE_CREATED,
      actor,
      target: { id: saved.id, name: saved.name, email: saved.email },
      changes: [
        { field: 'name', before: null, after: saved.name },
        { field: 'email', before: null, after: saved.email },
        { field: 'position', before: null, after: saved.position },
      ],
    });

    return toEmployeeResponse(saved);
  }

  async update(actor: AuthenticatedUser, id: number, dto: UpdateEmployeeDto) {
    const employee = await this.getOrFail(id);
    const changes: ActivityChange[] = [];

    type Trackable = string | boolean | null | undefined;

    const track = (field: string, before: Trackable, after: Trackable) => {
      if (after !== undefined && after !== before) {
        changes.push({
          field,
          before: before === null ? null : String(before),
          after: after === null ? null : String(after),
        });
      }
    };

    track('name', employee.name, dto.name);
    track('position', employee.position, dto.position);
    track('phone', employee.phone, dto.phone);
    track('role', employee.role, dto.role);
    track('isActive', employee.isActive, dto.isActive);

    if (dto.name !== undefined) employee.name = dto.name.trim();
    if (dto.position !== undefined) employee.position = dto.position.trim();
    if (dto.phone !== undefined) employee.phone = dto.phone;
    if (dto.role !== undefined) employee.role = dto.role;
    if (dto.isActive !== undefined) employee.isActive = dto.isActive;

    if (dto.password) {
      employee.passwordHash = await hash(dto.password, 10);
      changes.push({ field: 'password', before: null, after: null });
    }

    const saved = await this.employees.save(employee);

    if (changes.length) {
      await this.activity.record({
        action: ActivityAction.EMPLOYEE_UPDATED,
        actor,
        target: { id: saved.id, name: saved.name, email: saved.email },
        changes,
      });
    }

    return toEmployeeResponse(saved);
  }

  private async getOrFail(id: number): Promise<Employee> {
    const employee = await this.employees.findOne({ where: { id } });
    if (!employee) {
      throw new NotFoundException('Data karyawan tidak ditemukan');
    }
    return employee;
  }
}
