import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ACTIVITY_LOG_QUEUE } from '@app/contracts';
import { AuthModule } from '../auth/auth.module.js';
import { ActivityService } from './activity.service.js';
import { NotificationsGateway } from './notifications.gateway.js';

@Module({
  imports: [AuthModule, BullModule.registerQueue({ name: ACTIVITY_LOG_QUEUE })],
  providers: [ActivityService, NotificationsGateway],
  exports: [ActivityService],
})
export class ActivityModule {}
