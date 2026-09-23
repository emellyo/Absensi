import { ApiPropertyOptional, OmitType, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { CreateEmployeeDto } from './create-employee.dto.js';

export class UpdateEmployeeDto extends PartialType(
  OmitType(CreateEmployeeDto, ['email'] as const),
) {
  @ApiPropertyOptional({
    description: 'Nonaktifkan karyawan tanpa menghapus riwayat absensinya',
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
