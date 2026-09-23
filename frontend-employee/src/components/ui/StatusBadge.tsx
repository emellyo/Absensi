interface StatusBadgeProps {
  time: string | null
  tone: 'masuk' | 'pulang'
}

/** Menampilkan jam absen, atau penanda netral kalau belum ada datanya. */
export function StatusBadge({ time, tone }: StatusBadgeProps) {
  if (!time) {
    return (
      <span className="inline-flex items-center rounded-lg bg-ink-100 px-2.5 py-1 text-xs font-semibold text-ink-400">
        Belum absen
      </span>
    )
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold tabular-nums ${
        tone === 'masuk'
          ? 'bg-emerald-50 text-emerald-700'
          : 'bg-amber-50 text-amber-700'
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${tone === 'masuk' ? 'bg-emerald-500' : 'bg-amber-500'}`}
        aria-hidden="true"
      />
      {time.slice(0, 5)}
    </span>
  )
}
