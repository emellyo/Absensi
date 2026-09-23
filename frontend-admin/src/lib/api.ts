import axios from 'axios'

export const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

export const TOKEN_KEY = 'dexa.admin.token'

export const api = axios.create({ baseURL: `${API_BASE_URL}/api` })

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && localStorage.getItem(TOKEN_KEY)) {
      localStorage.removeItem(TOKEN_KEY)
      window.location.assign('/login')
    }
    return Promise.reject(error)
  },
)

/** Pesan error dari backend bisa berupa string atau array (validasi class-validator). */
export function errorMessage(error: unknown, fallback = 'Terjadi kesalahan'): string {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message
    if (Array.isArray(message)) return message.join(', ')
    if (typeof message === 'string') return message
    if (!error.response) return 'Tidak dapat terhubung ke server'
  }
  return fallback
}

export function photoSrc(photoUrl: string | null): string | null {
  return photoUrl ? `${API_BASE_URL}${photoUrl}` : null
}
