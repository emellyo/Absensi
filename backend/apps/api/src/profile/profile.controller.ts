import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthenticatedUser } from '../common/auth.types.js';
import { CurrentUser } from '../common/current-user.decorator.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { ChangePasswordDto } from './dto/change-password.dto.js';
import { UpdateProfileDto } from './dto/update-profile.dto.js';
import { ProfileService } from './profile.service.js';

@ApiTags('profile')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  @ApiOperation({ summary: 'Profil karyawan yang sedang login' })
  findMe(@CurrentUser() user: AuthenticatedUser) {
    return this.profileService.findMe(user);
  }

  @Patch()
  @ApiOperation({ summary: 'Ubah nomor handphone' })
  updatePhone(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.profileService.updatePhone(user, dto);
  }

  @Post('photo')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Ubah foto karyawan' })
  @UseInterceptors(FileInterceptor('photo'))
  updatePhoto(
    @CurrentUser() user: AuthenticatedUser,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('File foto wajib diunggah');
    }
    return this.profileService.updatePhoto(user, file.filename);
  }

  @Patch('password')
  @ApiOperation({ summary: 'Ubah password akun' })
  changePassword(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: ChangePasswordDto,
  ) {
    return this.profileService.changePassword(user, dto);
  }
}
