import { BullModule } from '@nestjs/bullmq';
import { Controller, Get, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ACTIVITY_LOG_QUEUE } from '@app/contracts';
import { ActivityLog } from './activity-log.entity.js';
import { ActivityLogProcessor } from './activity-log.processor.js';

@Controller('health')
class HealthController {
  @Get()
  check() {
    return {
      status: 'ok',
      service: 'logging-service',
      timestamp: new Date().toISOString(),
    };
  }
}

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
        // Database terpisah khusus log, tidak dipakai API.
        database: config.getOrThrow<string>('DB_LOGS_NAME'),
        entities: [ActivityLog],
        synchronize: true,
        timezone: 'Z',
        charset: 'utf8mb4',
      }),
    }),

    TypeOrmModule.forFeature([ActivityLog]),

    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        connection: {
          host: config.getOrThrow<string>('REDIS_HOST'),
          port: Number(config.getOrThrow<string>('REDIS_PORT')),
        },
      }),
    }),

    BullModule.registerQueue({ name: ACTIVITY_LOG_QUEUE }),
  ],
  controllers: [HealthController],
  providers: [ActivityLogProcessor],
})
export class LoggingServiceModule {}
