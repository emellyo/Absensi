interface PaginationProps {
  page: number
  totalPages: number
  total: number
  onChange: (page: number) => void
}

export function Pagination({ page, totalPages, total, onChange }: PaginationProps) {
  if (total === 0) return null

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-ink-100 px-5 py-3">
      <p className="text-xs text-ink-500">
        Halaman <span className="font-bold text-ink-700">{page}</span> dari{' '}
        <span className="font-bold text-ink-700">{totalPages}</span> &middot;{' '}
        <span className="font-bold text-ink-700">{total}</span> data
      </p>

      <div className="flex gap-2">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onChange(page - 1)}
          className="min-h-11 cursor-pointer rounded-lg border border-ink-300 px-3.5 text-sm font-semibold text-ink-700 transition-colors hover:bg-ink-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Sebelumnya
        </button>
        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onChange(page + 1)}
          className="min-h-11 cursor-pointer rounded-lg border border-ink-300 px-3.5 text-sm font-semibold text-ink-700 transition-colors hover:bg-ink-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Berikutnya
        </button>
      </div>
    </div>
  )
}
