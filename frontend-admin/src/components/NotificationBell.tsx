import { useEffect, useRef, useState } from 'react'
import { useNotifications } from '../hooks/useNotifications'
import { BellIcon } from './Icons'

function timeAgo(iso: string): string {
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (seconds < 60) return 'baru saja'
  if (seconds < 3600) return `${Math.floor(seconds / 60)} menit lalu`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} jam lalu`
  return `${Math.floor(seconds / 86400)} hari lalu`
}

export function NotificationBell() {
  const { notifications, unreadCount, markAllRead, connected } = useNotifications()
  const [open, setOpen] = useState(false)
  const container = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return

    const onClickOutside = (event: MouseEvent) => {
      if (!container.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [open])

  const toggle = () => {
    setOpen((value) => !value)
    if (!open) markAllRead()
  }

  return (
    <div ref={container} className="relative">
      <button
        type="button"
        onClick={toggle}
        aria-label={`Notifikasi${unreadCount > 0 ? `, ${unreadCount} belum dibaca` : ''}`}
        aria-expanded={open}
        className="relative flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl text-ink-500 transition-colors duration-200 hover:bg-ink-100 hover:text-ink-700"
      >
        <BellIcon />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-30 mt-2 w-80 overflow-hidden rounded-xl border border-ink-200 bg-white shadow-lg">
          <div className="flex items-center justify-between border-b border-ink-100 px-4 py-3">
            <p className="text-sm font-bold text-ink-900">Perubahan Data</p>
            <span
              className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
                connected ? 'text-emerald-600' : 'text-ink-400'
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${connected ? 'bg-emerald-500' : 'bg-ink-300'}`}
                aria-hidden="true"
              />
              {connected ? 'Realtime aktif' : 'Terputus'}
            </span>
          </div>

          <ul className="max-h-80 divide-y divide-ink-100 overflow-y-auto">
            {notifications.map((item) => (
              <li key={item.eventId} className="px-4 py-3">
                <p className="text-sm font-semibold text-ink-800">
                  {item.message}
                </p>
                <p className="mt-0.5 truncate text-xs text-ink-500">
                  {item.employeeEmail}
                </p>
                <p className="mt-1 text-xs text-ink-400">
                  {timeAgo(item.occurredAt)}
                </p>
              </li>
            ))}

            {notifications.length === 0 && (
              <li className="px-4 py-8 text-center text-sm text-ink-500">
                Belum ada perubahan data karyawan.
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  )
}
