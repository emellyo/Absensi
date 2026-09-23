import { useState } from 'react'
import type { FormEvent } from 'react'
import { Navigate } from 'react-router-dom'
import { LoginArrowIcon } from '../components/Icons'
import { Alert } from '../components/ui/Alert'
import { Button } from '../components/ui/Button'
import { Field } from '../components/ui/Field'
import { useAuth } from '../hooks/useAuth'
import { errorMessage } from '../lib/api'

export function LoginPage() {
  const { user, login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (user) {
    return <Navigate to="/karyawan" replace />
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
    } catch (err) {
      setError(
        err instanceof Error && err.message === 'Akun ini bukan admin HRD'
          ? 'Akun ini bukan admin HRD. Gunakan portal karyawan.'
          : errorMessage(err, 'Login gagal'),
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-dvh flex-col justify-center px-4 py-10 sm:px-6">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-7 text-center">
          <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-800 text-xl font-extrabold text-white shadow-lg shadow-brand-800/25">
            D
          </span>
          <h1 className="text-2xl font-extrabold text-ink-900">
            Monitoring Karyawan
          </h1>
          <p className="mt-1.5 text-sm text-ink-500">
            Portal khusus admin HRD
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-2xl border border-ink-200 bg-white p-6 shadow-sm"
          noValidate
        >
          {error && <Alert tone="error" message={error} />}

          <Field
            label="Email Admin"
            type="email"
            autoComplete="email"
            placeholder="hrd@dexagroup.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Field
            label="Password"
            type="password"
            autoComplete="current-password"
            placeholder="Masukkan password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button type="submit" size="lg" fullWidth loading={loading}>
            {!loading && <LoginArrowIcon />}
            Masuk
          </Button>
        </form>

        <p className="mt-5 text-center text-xs leading-relaxed text-ink-500">
          Akun demo admin
          <br />
          <span className="font-semibold text-ink-700">hrd@dexagroup.com</span>{' '}
          / <span className="font-semibold text-ink-700">Admin123!</span>
        </p>
      </div>
    </div>
  )
}
