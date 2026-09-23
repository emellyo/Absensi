import { useCallback, useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { SearchIcon } from '../components/Icons'
import { Alert } from '../components/ui/Alert'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Field } from '../components/ui/Field'
import { StatusBadge } from '../components/ui/StatusBadge'
import { api, errorMessage } from '../lib/api'
import { firstDayOfCurrentMonth, formatDateShort, todayLocalDate } from '../lib/format'
import type { AttendanceSummary } from '../types'

export function SummaryPage() {
  const [from, setFrom] = useState(firstDayOfCurrentMonth)
  const [to, setTo] = useState(todayLocalDate)
  const [summary, setSummary] = useState<AttendanceSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async (rangeFrom: string, rangeTo: string) => {
    setLoading(true)
    setError('')
    try {
      const { data } = await api.get<AttendanceSummary>('/attendance/summary', {
        params: { from: rangeFrom, to: rangeTo },
      })
      setSummary(data)
    } catch (err) {
      setError(errorMessage(err, 'Gagal memuat summary absen'))
    } finally {
      setLoading(false)
    }
  }, [])

  // Default tampilan: awal bulan berjalan sampai hari ini.
  useEffect(() => {
    load(firstDayOfCurrentMonth(), todayLocalDate())
  }, [load])

  const search = (event: FormEvent) => {
    event.preventDefault()
    load(from, to)
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-extrabold text-ink-900">Summary Absen</h1>
        <p className="text-sm text-ink-500">
          Default menampilkan data awal bulan berjalan sampai hari ini
        </p>
      </div>

      <Card className="p-5">
        <form onSubmit={search} className="space-y-4">
          <p className="text-sm font-bold text-ink-700">
            Filter Tanggal (From - To)
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field
              label="Dari Tanggal"
              type="date"
              value={from}
              max={to}
              onChange={(e) => setFrom(e.target.value)}
            />
            <Field
              label="Sampai Tanggal"
              type="date"
              value={to}
              min={from}
              onChange={(e) => setTo(e.target.value)}
            />
          </div>
          <Button type="submit" loading={loading}>
            {!loading && <SearchIcon className="h-4 w-4" />}
            Cari
          </Button>
        </form>
      </Card>

      {error && <Alert tone="error" message={error} />}

      {summary && !error && (
        <>
          <div className="grid grid-cols-2 gap-3">
            <Card className="p-4">
              <p className="text-xs font-semibold tracking-wide text-ink-500 uppercase">
                Hari Absen Masuk
              </p>
              <p className="mt-1 text-2xl font-extrabold tabular-nums text-ink-900">
                {summary.totals.hariMasuk}
              </p>
            </Card>
            <Card className="p-4">
              <p className="text-xs font-semibold tracking-wide text-ink-500 uppercase">
                Hari Absen Pulang
              </p>
              <p className="mt-1 text-2xl font-extrabold tabular-nums text-ink-900">
                {summary.totals.hariPulang}
              </p>
            </Card>
          </div>

          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-md text-left text-sm">
                <thead className="border-b border-ink-200 bg-ink-50">
                  <tr>
                    <th scope="col" className="px-5 py-3 font-bold text-ink-600">
                      Tanggal
                    </th>
                    <th scope="col" className="px-5 py-3 font-bold text-ink-600">
                      Masuk
                    </th>
                    <th scope="col" className="px-5 py-3 font-bold text-ink-600">
                      Pulang
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-100">
                  {summary.items.map((item) => (
                    <tr key={item.date} className="transition-colors hover:bg-ink-50">
                      <td className="px-5 py-3 font-semibold whitespace-nowrap text-ink-800">
                        {formatDateShort(item.date)}
                      </td>
                      <td className="px-5 py-3">
                        <StatusBadge time={item.masuk} tone="masuk" />
                      </td>
                      <td className="px-5 py-3">
                        <StatusBadge time={item.pulang} tone="pulang" />
                      </td>
                    </tr>
                  ))}

                  {summary.items.length === 0 && (
                    <tr>
                      <td
                        colSpan={3}
                        className="px-5 py-10 text-center text-sm text-ink-500"
                      >
                        Tidak ada data absensi pada rentang tanggal ini.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </div>
  )
}
