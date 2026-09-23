import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { compare } from 'bcryptjs';
import { Repository } from 'typeorm';
import { JwtPayload } from '../common/auth.types.js';
import { Employee } from '../database/entities/employee.entity.js';
import { LoginDto } from './dto/login.dto.js';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Employee)
    private readonly employees: Repository<Employee>,
    private readonly jwt: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const employee = await this.employees.findOne({
      where: { email: dto.email.toLowerCase().trim() },
    });

    if (!employee || !(await compare(dto.password, employee.passwordHash))) {
      throw new UnauthorizedException('Email atau password salah');
    }

    if (!employee.isActive) {
      throw new UnauthorizedException('Akun Anda sudah dinonaktifkan');
    }

    const payload: JwtPayload = {
      sub: employee.id,
      email: employee.email,
      name: employee.name,
      role: employee.role,
    };

    return {
      accessToken: await this.jwt.signAsync(payload),
      user: {
        id: employee.id,
        name: employee.name,
        email: employee.email,
        position: employee.position,
        role: employee.role,
      },
    };
  }
}
