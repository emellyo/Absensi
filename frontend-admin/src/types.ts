export interface AuthUser {
  id: number
  name: string
  email: string
  position: string
  role: 'EMPLOYEE' | 'ADMIN'
}

export interface Employee {
  id: number
  name: string
  email: string
  position: string
  phone: string | null
  photoUrl: string | null
  role: 'EMPLOYEE' | 'ADMIN'
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface EmployeeListResponse {
  page: number
  limit: number
  total: number
  totalPages: number
  items: Employee[]
}

export interface AttendanceRow {
  id: number
  date: string
  time: string
  status: 'MASUK' | 'PULANG'
  recordedAt: string
  employee: {
    id: number
    name: string
    email: string
    position: string
  }
}

export interface AttendanceListResponse {
  from: string
  to: string
  page: number
  limit: number
  total: number
  totalPages: number
  items: AttendanceRow[]
}

export interface EmployeeUpdatedNotification {
  eventId: string
  action: string
  employeeId: number
  employeeName: string
  employeeEmail: string
  message: string
  changes: { field: string; before: string | null; after: string | null }[]
  occurredAt: string
}
