import { ApiProperty } from '@nestjs/swagger';
import { Matches } from 'class-validator';

export const PHONE_PATTERN = /^(\+62|62|0)8[1-9][0-9]{6,11}$/;

export class UpdateProfileDto {
  @ApiProperty({ example: '081234567890' })
  @Matches(PHONE_PATTERN, {
    message:
      'Nomor handphone tidak valid. Gunakan format Indonesia, contoh 081234567890',
  })
  phone: string;
}
