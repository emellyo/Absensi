import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ActivityChange } from '@app/contracts';

@Entity('activity_logs')
export class ActivityLog {
  @PrimaryGeneratedColumn()
  id: number;

  // Idempotency: satu event hanya boleh tercatat sekali walau job di-retry.
  @Index('uq_activity_logs_event_id', { unique: true })
  @Column({ name: 'event_id', length: 64 })
  eventId: string;

  @Column({ length: 64 })
  action: string;

  @Column({ name: 'target_employee_id' })
  targetEmployeeId: number;

  @Column({ name: 'target_employee_name', length: 120 })
  targetEmployeeName: string;

  @Column({ name: 'target_employee_email', length: 160 })
  targetEmployeeEmail: string;

  @Column({ name: 'actor_id' })
  actorId: number;

  @Column({ name: 'actor_name', length: 120 })
  actorName: string;

  @Column({ name: 'actor_role', length: 20 })
  actorRole: string;

  @Column({ type: 'json' })
  changes: ActivityChange[];

  @Index('idx_activity_logs_occurred_at')
  @Column({ name: 'occurred_at', type: 'datetime', precision: 3 })
  occurredAt: Date;

  @CreateDateColumn({ name: 'logged_at', type: 'datetime' })
  loggedAt: Date;
}
