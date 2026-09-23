import { useToast } from '../hooks/useToast'
import { AlertIcon, BellIcon, CheckCircleIcon } from './Icons'

const TONES = {
  success: {
    ring: 'ring-emerald-200',
    iconWrap: 'bg-emerald-50 text-emerald-600',
    Icon: CheckCircleIcon,
  },
  error: {
    ring: 'ring-red-200',
    iconWrap: 'bg-red-50 text-red-600',
    Icon: AlertIcon,
  },
  info: {
    ring: 'ring-brand-200',
    iconWrap: 'bg-brand-50 text-brand-600',
    Icon: BellIcon,
  },
}

export function ToastHost() {
  const { toasts, dismissToast } = useToast()

  if (toasts.length === 0) return null

  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="pointer-events-none fixed inset-x-4 top-4 z-50 flex flex-col items-end gap-2 sm:inset-x-auto sm:right-6 sm:w-96"
    >
      {toasts.map((toast) => {
        const { ring, iconWrap, Icon } = TONES[toast.tone]

        return (
          <div
            key={toast.id}
            role="status"
            className={`pointer-events-auto flex w-full items-start gap-3 rounded-xl bg-white p-3.5 shadow-lg ring-1 ${ring}`}
          >
            <span className={`shrink-0 rounded-lg p-1.5 ${iconWrap}`}>
              <Icon className="h-5 w-5" />
            </span>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-ink-900">{toast.title}</p>
              {toast.description && (
                <p className="mt-0.5 truncate text-xs text-ink-500">
                  {toast.description}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              aria-label="Tutup notifikasi"
              className="-m-1 shrink-0 cursor-pointer rounded-lg p-1 text-ink-400 transition-colors hover:bg-ink-100 hover:text-ink-600"
            >
              <svg
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path strokeLinecap="round" d="M5 5l10 10M15 5L5 15" />
              </svg>
            </button>
          </div>
        )
      })}
    </div>
  )
}
