import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ACTIVITY_LOG_QUEUE, ActivityLogJobData } from '@app/contracts';
import { Job } from 'bullmq';
import { Repository } from 'typeorm';
import { ActivityLog } from './activity-log.entity.js';

@Processor(ACTIVITY_LOG_QUEUE)
export class ActivityLogProcessor extends WorkerHost {
  private readonly logger = new Logger(ActivityLogProcessor.name);

  constructor(
    @InjectRepository(ActivityLog)
    private readonly logs: Repository<ActivityLog>,
  ) {
    super();
  }

  async process(job: Job<ActivityLogJobData>): Promise<void> {
    const data = job.data;

    if (await this.logs.existsBy({ eventId: data.eventId })) {
      this.logger.debug(`Event ${data.eventId} sudah tercatat, dilewati`);
      return;
    }

    await this.logs.save(
      this.logs.create({
        eventId: data.eventId,
        action: data.action,
        targetEmployeeId: data.targetEmployeeId,
        targetEmployeeName: data.targetEmployeeName,
        targetEmployeeEmail: data.targetEmployeeEmail,
        actorId: data.actorId,
        actorName: data.actorName,
        actorRole: data.actorRole,
        changes: data.changes,
        occurredAt: new Date(data.occurredAt),
      }),
    );

    this.logger.log(
      `Tercatat: ${data.action} pada ${data.targetEmployeeEmail} oleh ${data.actorName}`,
    );
  }
}
