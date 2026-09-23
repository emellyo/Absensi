import { join } from 'node:path';
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityModule } from './activity/activity.module.js';
import { AttendanceModule } from './attendance/attendance.module.js';
import { AuthModule } from './auth/auth.module.js';
import { Attendance } from './database/entities/attendance.entity.js';
import { Employee } from './database/entities/employee.entity.js';
import { EmployeesModule } from './employees/employees.module.js';
import { HealthController } from './health.controller.js';
import { ProfileModule } from './profile/profile.module.js';

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
        // Skema dibuat otomatis agar reviewer cukup menjalankan seed.
        // Untuk produksi diganti migration.
        synchronize: true,
        timezone: 'Z',
        charset: 'utf8mb4',
      }),
    }),

    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        connection: {
          host: config.getOrThrow<string>('REDIS_HOST'),
          port: Number(config.getOrThrow<string>('REDIS_PORT')),
        },
      }),
    }),

    ServeStaticModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          rootPath: join(
            process.cwd(),
            config.get<string>('UPLOAD_DIR', 'uploads'),
          ),
          serveRoot: '/uploads',
          serveStaticOptions: { fallthrough: false },
        },
      ],
    }),

    AuthModule,
    ActivityModule,
    ProfileModule,
    AttendanceModule,
    EmployeesModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
