import { useEffect, useState } from 'react'
import { SunriseIcon, SunsetIcon } from '../components/Icons'
import { Alert } from '../components/ui/Alert'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { api, errorMessage } from '../lib/api'
import { formatDateLong, formatDateShort, formatTime } from '../lib/format'
import type { TodayAttendance } from '../types'

type Feedback = { tone: 'success' | 'error'; message: string } | null

function useClock(): string {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // Dirakit manual supaya pemisahnya titik dua, konsisten dengan jam absen
  // lain di aplikasi (locale id-ID memakai titik: "22.30.15").
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Jakarta',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(now)

  const value = (type: string) =>
    parts.find((part) => part.type === type)?.value ?? '00'

  return `${value('hour')}:${value('minute')}:${value('second')}`
}

export function AttendancePage() {
  const clock = useClock()
  const [today, setToday] = useState<TodayAttendance | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<'masuk' | 'pulang' | null>(null)
  const [feedback, setFeedback] = useState<Feedback>(null)

  const refresh = () =>
    api.get<TodayAttendance>('/attendance/today').then((r) => setToday(r.data))

  useEffect(() => {
    refresh()
      .catch(() => setFeedback({ tone: 'error', message: 'Gagal memuat status absen' }))
      .finally(() => setLoading(false))
  }, [])

  const submit = async (type: 'masuk' | 'pulang') => {
    setFeedback(null)
    setSaving(type)
    try {
      const path = type === 'masuk' ? '/attendance/check-in' : '/attendance/check-out'
      const { data } = await api.post(path)
      setFeedback({ tone: 'success', message: data.message })
      await refresh()
    } catch (err) {
      setFeedback({ tone: 'error', message: errorMessage(err) })
    } finally {
      setSaving(null)
    }
  }

  if (loading) {
    return <p className="py-10 text-center text-sm text-ink-500">Memuat...</p>
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-extrabold text-ink-900">Absen</h1>
        <p className="text-sm text-ink-500">
          Catat kehadiran masuk dan pulang Anda hari ini
        </p>
      </div>

      <Card className="overflow-hidden">
        <div className="bg-gradient-to-br from-brand-600 to-brand-800 px-5 py-7 text-center text-white">
          <p className="text-sm font-medium text-brand-100">
            {today && formatDateLong(today.date)}
          </p>
          <p className="mt-1.5 font-mono text-5xl font-extrabold tracking-tight tabular-nums sm:text-6xl">
            {clock}
          </p>
          <p className="mt-1 text-xs font-medium text-brand-200">
            Waktu Indonesia Barat
          </p>
        </div>

        <div className="space-y-4 p-5">
          {feedback && <Alert tone={feedback.tone} message={feedback.message} />}

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-ink-200 bg-ink-50 p-4">
              <div className="flex items-center gap-2 text-ink-500">
                <SunriseIcon className="h-4 w-4" />
                <span className="text-xs font-bold tracking-wide uppercase">
                  Masuk
                </span>
              </div>
              <p className="mt-1.5 text-2xl font-extrabold tabular-nums text-ink-900">
                {formatTime(today?.masuk ?? null)}
              </p>
              {today?.masuk && (
                <p className="mt-0.5 text-xs font-medium text-ink-500">
                  {formatDateShort(today.date)}
                </p>
              )}
            </div>

            <div className="rounded-xl border border-ink-200 bg-ink-50 p-4">
              <div className="flex items-center gap-2 text-ink-500">
                <SunsetIcon className="h-4 w-4" />
                <span className="text-xs font-bold tracking-wide uppercase">
                  Pulang
                </span>
              </div>
              <p className="mt-1.5 text-2xl font-extrabold tabular-nums text-ink-900">
                {formatTime(today?.pulang ?? null)}
              </p>
              {today?.pulang && (
                <p className="mt-0.5 text-xs font-medium text-ink-500">
                  {formatDateShort(today.date)}
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {/* Sudah absen ditampilkan netral, bukan primary pudar. */}
            <Button
              size="lg"
              fullWidth
              variant={today?.masuk ? 'secondary' : 'primary'}
              disabled={Boolean(today?.masuk)}
              loading={saving === 'masuk'}
              onClick={() => submit('masuk')}
            >
              {!saving && <SunriseIcon className="h-5 w-5" />}
              {today?.masuk ? 'Sudah Absen Masuk' : 'Absen Masuk'}
            </Button>

            <Button
              size="lg"
              fullWidth
              variant={today?.masuk && !today?.pulang ? 'primary' : 'secondary'}
              disabled={!today?.masuk || Boolean(today?.pulang)}
              loading={saving === 'pulang'}
              onClick={() => submit('pulang')}
            >
              {!saving && <SunsetIcon className="h-5 w-5" />}
              {today?.pulang ? 'Sudah Absen Pulang' : 'Absen Pulang'}
            </Button>
          </div>

          {!today?.masuk && (
            <p className="text-center text-xs text-ink-500">
              Absen pulang tersedia setelah Anda melakukan absen masuk.
            </p>
          )}
        </div>
      </Card>
    </div>
  )
}
