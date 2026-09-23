import { Role } from './enums.js';

export const ACTIVITY_LOG_QUEUE = 'activity-log';
export const ACTIVITY_LOG_JOB = 'record-activity';

export enum ActivityAction {
  PROFILE_PHOTO_UPDATED = 'PROFILE_PHOTO_UPDATED',
  PROFILE_PHONE_UPDATED = 'PROFILE_PHONE_UPDATED',
  PROFILE_PASSWORD_CHANGED = 'PROFILE_PASSWORD_CHANGED',
  EMPLOYEE_CREATED = 'EMPLOYEE_CREATED',
  EMPLOYEE_UPDATED = 'EMPLOYEE_UPDATED',
}

export interface ActivityChange {
  field: string;
  before: string | null;
  after: string | null;
}

export interface ActivityLogJobData {
  eventId: string;
  action: ActivityAction;
  targetEmployeeId: number;
  targetEmployeeName: string;
  targetEmployeeEmail: string;
  actorId: number;
  actorName: string;
  actorRole: Role;
  changes: ActivityChange[];
  occurredAt: string;
}
