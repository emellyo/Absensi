import { ActivityAction, ActivityChange } from './activity-log.contract.js';

export const NOTIFICATIONS_NAMESPACE = '/notifications';
export const ADMIN_ROOM = 'admins';
export const EVENT_EMPLOYEE_UPDATED = 'employee.updated';

export interface EmployeeUpdatedNotification {
  eventId: string;
  action: ActivityAction;
  employeeId: number;
  employeeName: string;
  employeeEmail: string;
  message: string;
  changes: ActivityChange[];
  occurredAt: string;
}
