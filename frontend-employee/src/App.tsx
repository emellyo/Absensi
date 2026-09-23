import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/AppLayout'
import { AuthProvider } from './context/AuthContext'
import { useAuth } from './hooks/useAuth'
import { AttendancePage } from './pages/AttendancePage'
import { LoginPage } from './pages/LoginPage'
import { ProfilePage } from './pages/ProfilePage'
import { SummaryPage } from './pages/SummaryPage'

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
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route element={<ProtectedRoutes />}>
            <Route element={<AppLayout />}>
              <Route path="/profil" element={<ProfilePage />} />
              <Route path="/absen" element={<AttendancePage />} />
              <Route path="/summary" element={<SummaryPage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/profil" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
