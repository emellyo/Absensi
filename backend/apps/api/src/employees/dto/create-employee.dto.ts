import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '@app/contracts';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { PHONE_PATTERN } from '../../profile/dto/update-profile.dto.js';

export class CreateEmployeeDto {
  @ApiProperty({ example: 'Bayu' })
  @IsString()
  @MinLength(3, { message: 'Nama minimal 3 karakter' })
  @MaxLength(120)
  name: string;

  @ApiProperty({ example: 'bayu@dexagroup.com' })
  @IsEmail({}, { message: 'Format email tidak valid' })
  @MaxLength(160)
  email: string;

  @ApiProperty({ example: 'Password123!' })
  @IsString()
  @MinLength(8, { message: 'Password minimal 8 karakter' })
  @Matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: 'Password harus memuat huruf besar, huruf kecil, dan angka',
  })
  password: string;

  @ApiProperty({ example: 'Software Engineer' })
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  position: string;

  @ApiPropertyOptional({ example: '081234567890' })
  @IsOptional()
  @Matches(PHONE_PATTERN, { message: 'Nomor handphone tidak valid' })
  phone?: string;

  @ApiPropertyOptional({ enum: Role, default: Role.EMPLOYEE })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}
