import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attendance } from '../../api/src/database/entities/attendance.entity.js';
import { Employee } from '../../api/src/database/entities/employee.entity.js';
import { SeedService } from './seed.service.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.getOrThrow<string>('DB_HOST'),
        port: Number(config.getOrThrow<string>('DB_PORT')),
        username: config.getOrThrow<string>('DB_USER'),
        password: config.getOrThrow<string>('DB_PASSWORD'),
        database: config.getOrThrow<string>('DB_MAIN_NAME'),
        entities: [Employee, Attendance],
        // Seed sekaligus membuat skema, jadi bisa dijalankan dari database kosong.
        synchronize: true,
        timezone: 'Z',
        charset: 'utf8mb4',
      }),
    }),
    TypeOrmModule.forFeature([Employee, Attendance]),
  ],
  providers: [SeedService],
})
export class SeedModule {}
