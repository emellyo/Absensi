import { randomUUID } from 'node:crypto';
import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import {
  ACTIVITY_LOG_JOB,
  ACTIVITY_LOG_QUEUE,
  ActivityAction,
  ActivityChange,
  ActivityLogJobData,
  Role,
} from '@app/contracts';
import { Queue } from 'bullmq';
import { AuthenticatedUser } from '../common/auth.types.js';
import { NotificationsGateway } from './notifications.gateway.js';

interface RecordActivityInput {
  action: ActivityAction;
  actor: AuthenticatedUser;
  target: { id: number; name: string; email: string };
  changes: ActivityChange[];
}

const MESSAGES: Record<ActivityAction, (name: string) => string> = {
  [ActivityAction.PROFILE_PHOTO_UPDATED]: (n) => `${n} memperbarui foto profil`,
  [ActivityAction.PROFILE_PHONE_UPDATED]: (n) =>
    `${n} memperbarui nomor handphone`,
  [ActivityAction.PROFILE_PASSWORD_CHANGED]: (n) =>
    `${n} mengubah password akun`,
  [ActivityAction.EMPLOYEE_CREATED]: (n) => `Karyawan baru ditambahkan: ${n}`,
  [ActivityAction.EMPLOYEE_UPDATED]: (n) => `Data karyawan ${n} diperbarui`,
};

@Injectable()
export class ActivityService {
  private readonly logger = new Logger(ActivityService.name);

  constructor(
    @InjectQueue(ACTIVITY_LOG_QUEUE) private readonly queue: Queue,
    private readonly gateway: NotificationsGateway,
  ) {}

  /**
   * Perubahan data memicu dua jalur: job ke message queue (dikonsumsi
   * logging-service untuk ditulis ke database log terpisah) dan notifikasi
   * realtime ke dashboard admin. Keduanya sengaja tidak menggagalkan request
   * utama kalau bermasalah.
   */
  async record(input: RecordActivityInput): Promise<void> {
    const eventId = randomUUID();
    const occurredAt = new Date().toISOString();

    const jobData: ActivityLogJobData = {
      eventId,
      action: input.action,
      targetEmployeeId: input.target.id,
      targetEmployeeName: input.target.name,
      targetEmployeeEmail: input.target.email,
      actorId: input.actor.id,
      actorName: input.actor.name,
      actorRole: input.actor.role as Role,
      changes: input.changes,
      occurredAt,
    };

    try {
      await this.queue.add(ACTIVITY_LOG_JOB, jobData, {
        jobId: eventId,
        attempts: 5,
        backoff: { type: 'exponential', delay: 1000 },
        removeOnComplete: 1000,
        removeOnFail: 5000,
      });
    } catch (error) {
      this.logger.error(
        `Gagal mengirim activity log ke queue: ${(error as Error).message}`,
      );
    }

    try {
      this.gateway.notifyAdmins({
        eventId,
        action: input.action,
        employeeId: input.target.id,
        employeeName: input.target.name,
        employeeEmail: input.target.email,
        message: MESSAGES[input.action](input.target.name),
        changes: input.changes,
        occurredAt,
      });
    } catch (error) {
      this.logger.error(
        `Gagal mengirim notifikasi realtime: ${(error as Error).message}`,
      );
    }
  }
}
