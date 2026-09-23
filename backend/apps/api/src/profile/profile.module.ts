import { randomUUID } from 'node:crypto';
import { extname, join } from 'node:path';
import { BadRequestException, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import multer from 'multer';
import { ActivityModule } from '../activity/activity.module.js';
import { Employee } from '../database/entities/employee.entity.js';
import { ProfileController } from './profile.controller.js';
import { ProfileService } from './profile.service.js';

const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp'];

@Module({
  imports: [
    TypeOrmModule.forFeature([Employee]),
    ActivityModule,
    MulterModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        storage: multer.diskStorage({
          destination: join(
            process.cwd(),
            config.get<string>('UPLOAD_DIR', 'uploads'),
          ),
          filename: (_req, file, cb) =>
            cb(null, `${randomUUID()}${extname(file.originalname)}`),
        }),
        limits: {
          fileSize:
            Number(config.get<string>('MAX_UPLOAD_SIZE_MB', '2')) * 1024 * 1024,
        },
        fileFilter: (_req, file, cb) => {
          if (!ALLOWED_MIME.includes(file.mimetype)) {
            cb(
              new BadRequestException(
                'Format foto harus JPG, PNG, atau WEBP',
              ) as unknown as Error,
              false,
            );
            return;
          }
          cb(null, true);
        },
      }),
    }),
  ],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}
