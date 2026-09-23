import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { ClipboardIcon, LogoutIcon, UsersIcon } from './Icons'
import { NotificationBell } from './NotificationBell'

const NAV = [
  { to: '/karyawan', label: 'Data Karyawan', Icon: UsersIcon },
  { to: '/absensi', label: 'Monitoring Absensi', Icon: ClipboardIcon },
]

export function AdminLayout() {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-dvh lg:flex">
      <aside className="hidden w-68 shrink-0 border-r border-ink-200 bg-white lg:flex lg:flex-col">
        <div className="flex items-center gap-2.5 px-5 py-5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-800 text-sm font-extrabold text-white">
            D
          </span>
          <div>
            <p className="text-sm font-extrabold text-ink-900">Dexa Monitoring</p>
            <p className="text-xs text-ink-500">Portal Admin HRD</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-2">
          {NAV.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold transition-colors duration-200 ${
                  isActive
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-ink-600 hover:bg-ink-100'
                }`
              }
            >
              <Icon />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-ink-100 p-3">
          <div className="mb-2 px-2">
            <p className="truncate text-sm font-bold text-ink-800">{user?.name}</p>
            <p className="truncate text-xs text-ink-500">{user?.position}</p>
          </div>
          <button
            type="button"
            onClick={logout}
            className="flex min-h-11 w-full cursor-pointer items-center gap-3 rounded-xl px-3 text-sm font-semibold text-ink-600 transition-colors duration-200 hover:bg-red-50 hover:text-red-600"
          >
            <LogoutIcon />
            Keluar
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between gap-3 border-b border-ink-200 bg-white px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2.5 lg:hidden">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-800 text-sm font-extrabold text-white">
              D
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-extrabold text-ink-900">
                Dexa Monitoring
              </p>
              <p className="truncate text-xs text-ink-500">{user?.name}</p>
            </div>
          </div>

          <p className="hidden text-sm font-semibold text-ink-500 lg:block">
            Aplikasi Monitoring Karyawan
          </p>

          <div className="flex items-center gap-1">
            <NotificationBell />
            <button
              type="button"
              onClick={logout}
              aria-label="Keluar dari akun"
              className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl text-ink-500 transition-colors duration-200 hover:bg-red-50 hover:text-red-600 lg:hidden"
            >
              <LogoutIcon />
            </button>
          </div>
        </header>

        <nav className="flex border-b border-ink-200 bg-white px-2 lg:hidden">
          {NAV.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex min-h-12 flex-1 items-center justify-center gap-2 border-b-2 px-2 text-xs font-bold transition-colors duration-200 ${
                  isActive
                    ? 'border-brand-600 text-brand-700'
                    : 'border-transparent text-ink-500'
                }`
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>

        <main className="flex-1 px-4 py-5 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-6xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
