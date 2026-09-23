import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { api, TOKEN_KEY } from '../lib/api'
import type { AuthUser } from '../types'

interface AuthContextValue {
  user: AuthUser | null
  initializing: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [initializing, setInitializing] = useState(true)

  useEffect(() => {
    if (!localStorage.getItem(TOKEN_KEY)) {
      setInitializing(false)
      return
    }

    api
      .get<AuthUser>('/auth/me')
      .then((response) => {
        if (response.data.role === 'ADMIN') {
          setUser(response.data)
        } else {
          localStorage.removeItem(TOKEN_KEY)
        }
      })
      .catch(() => localStorage.removeItem(TOKEN_KEY))
      .finally(() => setInitializing(false))
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const { data } = await api.post('/auth/login', { email, password })

    // Portal ini khusus admin HRD, akun karyawan biasa ditolak di sisi klien
    // (endpoint admin di backend tetap dijaga RolesGuard).
    if (data.user.role !== 'ADMIN') {
      throw new Error('Akun ini bukan admin HRD')
    }

    localStorage.setItem(TOKEN_KEY, data.accessToken)
    setUser(data.user)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({ user, initializing, login, logout }),
    [user, initializing, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
