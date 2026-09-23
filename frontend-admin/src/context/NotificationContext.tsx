import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { io } from 'socket.io-client'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '../hooks/useToast'
import { API_BASE_URL, TOKEN_KEY } from '../lib/api'
import type { EmployeeUpdatedNotification } from '../types'

interface NotificationContextValue {
  connected: boolean
  notifications: EmployeeUpdatedNotification[]
  unreadCount: number
  markAllRead: () => void
}

// eslint-disable-next-line react-refresh/only-export-components
export const NotificationContext =
  createContext<NotificationContextValue | null>(null)

const MAX_KEPT = 15

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const { showToast } = useToast()
  const [connected, setConnected] = useState(false)
  const [notifications, setNotifications] = useState<EmployeeUpdatedNotification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (!user || !token) {
      return
    }

    const socket = io(`${API_BASE_URL}/notifications`, {
      auth: { token },
      transports: ['websocket'],
    })

    socket.on('connect', () => setConnected(true))
    socket.on('disconnect', () => setConnected(false))

    socket.on('employee.updated', (payload: EmployeeUpdatedNotification) => {
      setNotifications((current) => [payload, ...current].slice(0, MAX_KEPT))
      setUnreadCount((count) => count + 1)
      showToast({
        tone: 'info',
        title: payload.message,
        description: payload.employeeEmail,
      })
    })

    return () => {
      socket.close()
    }
  }, [user, showToast])

  const markAllRead = useCallback(() => setUnreadCount(0), [])

  const value = useMemo(
    () => ({ connected, notifications, unreadCount, markAllRead }),
    [connected, notifications, unreadCount, markAllRead],
  )

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}
