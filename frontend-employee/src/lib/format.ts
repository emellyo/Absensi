const MONTHS = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
]

const DAYS = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']

/** '2026-09-23' -> 'Rabu, 23 September 2026' */
export function formatDateLong(isoDate: string): string {
  const [year, month, day] = isoDate.split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))
  return `${DAYS[date.getUTCDay()]}, ${day} ${MONTHS[month - 1]} ${year}`
}

/** '2026-09-23' -> '23 Sep 2026' */
export function formatDateShort(isoDate: string): string {
  const [year, month, day] = isoDate.split('-').map(Number)
  return `${day} ${MONTHS[month - 1].slice(0, 3)} ${year}`
}

/** '08:15:00' -> '08:15' */
export function formatTime(time: string | null): string {
  return time ? time.slice(0, 5) : '-'
}

export function todayLocalDate(): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Jakarta' })
}

export function firstDayOfCurrentMonth(): string {
  return `${todayLocalDate().slice(0, 7)}-01`
}
