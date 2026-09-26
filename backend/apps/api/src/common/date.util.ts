export const APP_TIMEZONE = 'Asia/Jakarta';

function partsOf(date: Date): Record<string, string> {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: APP_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  });

  return Object.fromEntries(
    formatter.formatToParts(date).map((part) => [part.type, part.value]),
  );
}

/** Tanggal lokal Jakarta dalam format YYYY-MM-DD. */
export function toLocalDate(date: Date): string {
  const p = partsOf(date);
  return `${p.year}-${p.month}-${p.day}`;
}

/** Waktu lokal Jakarta dalam format HH:mm:ss. */
export function toLocalTime(date: Date): string {
  const p = partsOf(date);
  return `${p.hour}:${p.minute}:${p.second}`;
}

/** Tanggal pertama bulan berjalan (waktu Jakarta) dalam format YYYY-MM-DD. */
export function startOfCurrentMonth(now: Date = new Date()): string {
  const p = partsOf(now);
  return `${p.year}-${p.month}-01`;
}

const DAYS = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
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
];

/** '2026-09-26' -> 'Sabtu, 26 September 2026' */
export function formatLocalDateLong(isoDate: string): string {
  const [year, month, day] = isoDate.split('-').map(Number);
  const weekday = new Date(Date.UTC(year, month - 1, day)).getUTCDay();
  return `${DAYS[weekday]}, ${day} ${MONTHS[month - 1]} ${year}`;
}
