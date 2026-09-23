export interface AuthUser {
  id: number
  name: string
  email: string
  position: string
  role: 'EMPLOYEE' | 'ADMIN'
}

export interface Profile {
  id: number
  name: string
  email: string
  position: string
  phone: string | null
  photoUrl: string | null
  role: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface TodayAttendance {
  date: string
  masuk: string | null
  pulang: string | null
}

export interface SummaryRow {
  date: string
  masuk: string | null
  pulang: string | null
}

export interface AttendanceSummary {
  from: string
  to: string
  items: SummaryRow[]
  totals: { hariMasuk: number; hariPulang: number }
}
