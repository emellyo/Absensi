import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { CalendarIcon, ClockIcon, LogoutIcon, UserIcon } from './Icons'

const NAV = [
  { to: '/profil', label: 'Profil', Icon: UserIcon },
  { to: '/absen', label: 'Absen', Icon: ClockIcon },
  { to: '/summary', label: 'Summary', Icon: CalendarIcon },
]

export function AppLayout() {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-dvh lg:flex">
      {/* Sidebar hanya di layar besar */}
      <aside className="hidden w-64 shrink-0 border-r border-ink-200 bg-white lg:flex lg:flex-col">
        <div className="flex items-center gap-2.5 px-5 py-5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-sm font-extrabold text-white">
            D
          </span>
          <div>
            <p className="text-sm font-extrabold text-ink-900">Dexa Absensi</p>
            <p className="text-xs text-ink-500">Portal Karyawan</p>
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
            <p className="truncate text-sm font-bold text-ink-800">
              {user?.name}
            </p>
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
        {/* Header mobile */}
        <header className="flex items-center justify-between border-b border-ink-200 bg-white px-4 py-3 lg:hidden">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-sm font-extrabold text-white">
              D
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-extrabold text-ink-900">
                Dexa Absensi
              </p>
              <p className="truncate text-xs text-ink-500">{user?.name}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={logout}
            aria-label="Keluar dari akun"
            className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl text-ink-500 transition-colors duration-200 hover:bg-red-50 hover:text-red-600"
          >
            <LogoutIcon />
          </button>
        </header>

        {/* pb-24 memberi ruang untuk bottom nav di mobile */}
        <main className="flex-1 px-4 py-5 pb-24 sm:px-6 lg:px-8 lg:pb-8">
          <div className="mx-auto w-full max-w-4xl">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Bottom nav di mobile */}
      <nav className="fixed inset-x-0 bottom-0 z-10 flex border-t border-ink-200 bg-white pb-[env(safe-area-inset-bottom)] lg:hidden">
        {NAV.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex min-h-16 flex-1 flex-col items-center justify-center gap-1 text-xs font-semibold transition-colors duration-200 ${
                isActive ? 'text-brand-600' : 'text-ink-500'
              }`
            }
          >
            <Icon />
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
