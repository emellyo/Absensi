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
