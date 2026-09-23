import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { AdminLayout } from './components/AdminLayout'
import { ToastHost } from './components/ToastHost'
import { AuthProvider } from './context/AuthContext'
import { NotificationProvider } from './context/NotificationContext'
import { ToastProvider } from './context/ToastContext'
import { useAuth } from './hooks/useAuth'
import { EmployeesPage } from './pages/EmployeesPage'
import { LoginPage } from './pages/LoginPage'
import { MonitoringPage } from './pages/MonitoringPage'

function ProtectedRoutes() {
  const { user, initializing } = useAuth()

  if (initializing) {
    return (
      <div className="flex min-h-dvh items-center justify-center text-sm text-ink-500">
        Memuat...
      </div>
    )
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <NotificationProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<LoginPage />} />

              <Route element={<ProtectedRoutes />}>
                <Route element={<AdminLayout />}>
                  <Route path="/karyawan" element={<EmployeesPage />} />
                  <Route path="/absensi" element={<MonitoringPage />} />
                </Route>
              </Route>

              <Route path="*" element={<Navigate to="/karyawan" replace />} />
            </Routes>
          </BrowserRouter>
          <ToastHost />
        </NotificationProvider>
      </ToastProvider>
    </AuthProvider>
  )
}
