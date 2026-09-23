import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '@app/contracts';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { AuthenticatedUser } from '../common/auth.types.js';
import { CurrentUser } from '../common/current-user.decorator.js';
import { Roles, RolesGuard } from '../common/roles.guard.js';
import { CreateEmployeeDto } from './dto/create-employee.dto.js';
import { ListEmployeesDto } from './dto/list-employees.dto.js';
import { UpdateEmployeeDto } from './dto/update-employee.dto.js';
import { EmployeesService } from './employees.service.js';

@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('admin/employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Get()
  @ApiOperation({ summary: 'Daftar karyawan' })
  findAll(@Query() query: ListEmployeesDto) {
    return this.employeesService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detail satu karyawan' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.employeesService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Tambah karyawan baru' })
  create(
    @CurrentUser() actor: AuthenticatedUser,
    @Body() dto: CreateEmployeeDto,
  ) {
    return this.employeesService.create(actor, dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update data karyawan' })
  update(
    @CurrentUser() actor: AuthenticatedUser,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateEmployeeDto,
  ) {
    return this.employeesService.update(actor, id, dto);
  }
}
