import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({ example: 'Password123!' })
  @IsString()
  currentPassword: string;

  @ApiProperty({ example: 'PasswordBaru123!' })
  @IsString()
  @MinLength(8, { message: 'Password baru minimal 8 karakter' })
  @Matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: 'Password baru harus memuat huruf besar, huruf kecil, dan angka',
  })
  newPassword: string;
}
