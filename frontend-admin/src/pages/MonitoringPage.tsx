import { useCallback, useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { SearchIcon } from '../components/Icons'
import { Alert } from '../components/ui/Alert'
import { Avatar } from '../components/ui/Avatar'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Field } from '../components/ui/Field'
import { Pagination } from '../components/ui/Pagination'
import { api, errorMessage } from '../lib/api'
import {
  firstDayOfCurrentMonth,
  formatDateShort,
  formatTime,
  todayLocalDate,
} from '../lib/format'
import type {
  AttendanceListResponse,
  Employee,
  EmployeeListResponse,
} from '../types'

interface Filters {
  from: string
  to: string
  employeeId: string
}

export function MonitoringPage() {
  const [draft, setDraft] = useState<Filters>(() => ({
    from: firstDayOfCurrentMonth(),
    to: todayLocalDate(),
    employeeId: '',
  }))
  const [applied, setApplied] = useState<Filters>(draft)
  const [page, setPage] = useState(1)

  const [data, setData] = useState<AttendanceListResponse | null>(null)
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api
      .get<EmployeeListResponse>('/admin/employees', { params: { limit: 100 } })
      .then((response) => setEmployees(response.data.items))
      .catch(() => setEmployees([]))
  }, [])

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const { data } = await api.get<AttendanceListResponse>('/admin/attendance', {
        params: {
          from: applied.from,
          to: applied.to,
          employeeId: applied.employeeId || undefined,
          page,
          limit: 15,
        },
      })
      setData(data)
    } catch (err) {
      setError(errorMessage(err, 'Gagal memuat data absensi'))
    } finally {
      setLoading(false)
    }
  }, [applied, page])

  useEffect(() => {
    load()
  }, [load])

  const search = (event: FormEvent) => {
    event.preventDefault()
    setPage(1)
    setApplied(draft)
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-extrabold text-ink-900">
          Monitoring Absensi
        </h1>
        <p className="text-sm text-ink-500">
          Absensi seluruh karyawan, hanya dapat dilihat (read only)
        </p>
      </div>

      <Card className="p-5">
        <form onSubmit={search} className="space-y-4">
          <p className="text-sm font-bold text-ink-700">
            Filter Tanggal (From - To)
          </p>

          <div className="grid gap-3 sm:grid-cols-3">
            <Field
              label="Dari Tanggal"
              type="date"
              value={draft.from}
              max={draft.to}
              onChange={(e) => setDraft({ ...draft, from: e.target.value })}
            />
            <Field
              label="Sampai Tanggal"
              type="date"
              value={draft.to}
              min={draft.from}
              onChange={(e) => setDraft({ ...draft, to: e.target.value })}
            />

            <div className="space-y-1.5">
              <label
                htmlFor="employee-filter"
                className="block text-sm font-semibold text-ink-700"
              >
                Karyawan
              </label>
              <select
                id="employee-filter"
                value={draft.employeeId}
                onChange={(e) => setDraft({ ...draft, employeeId: e.target.value })}
                className="min-h-11 w-full cursor-pointer rounded-xl border border-ink-300 bg-white px-3.5 text-sm text-ink-800 transition-colors focus:border-brand-500"
              >
                <option value="">Semua Karyawan</option>
                {employees.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <Button type="submit" loading={loading}>
            {!loading && <SearchIcon className="h-4 w-4" />}
            Cari
          </Button>
        </form>
      </Card>

      {error && <Alert tone="error" message={error} />}

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-3xl text-left text-sm">
            <thead className="border-b border-ink-200 bg-ink-50">
              <tr>
                <th scope="col" className="px-5 py-3 font-bold text-ink-600">
                  Karyawan
                </th>
                <th scope="col" className="px-5 py-3 font-bold text-ink-600">
                  Posisi
                </th>
                <th scope="col" className="px-5 py-3 font-bold text-ink-600">
                  Tanggal
                </th>
                <th scope="col" className="px-5 py-3 font-bold text-ink-600">
                  Waktu
                </th>
                <th scope="col" className="px-5 py-3 font-bold text-ink-600">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {data?.items.map((row) => (
                <tr key={row.id} className="transition-colors hover:bg-ink-50">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar name={row.employee.name} src={null} />
                      <div className="min-w-0">
                        <p className="font-bold text-ink-900">
                          {row.employee.name}
                        </p>
                        <p className="truncate text-xs text-ink-500">
                          {row.employee.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap text-ink-600">
                    {row.employee.position}
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap font-semibold text-ink-800">
                    {formatDateShort(row.date)}
                  </td>
                  <td className="px-5 py-3 font-bold tabular-nums whitespace-nowrap text-ink-800">
                    {formatTime(row.time)}
                  </td>
                  <td className="px-5 py-3">
                    <Badge tone={row.status === 'MASUK' ? 'success' : 'warning'}>
                      {row.status === 'MASUK' ? 'Masuk' : 'Pulang'}
                    </Badge>
                  </td>
                </tr>
              ))}

              {!loading && data?.items.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-sm text-ink-500">
                    Tidak ada data absensi pada filter ini.
                  </td>
                </tr>
              )}

              {loading && !data && (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-sm text-ink-500">
                    Memuat data...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {data && (
          <Pagination
            page={data.page}
            totalPages={data.totalPages}
            total={data.total}
            onChange={setPage}
          />
        )}
      </Card>
    </div>
  )
}
