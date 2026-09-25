import { useCallback, useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { EmployeeFormModal } from '../components/EmployeeFormModal'
import { PencilIcon, PlusIcon, SearchIcon } from '../components/Icons'
import { Alert } from '../components/ui/Alert'
import { Avatar } from '../components/ui/Avatar'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Pagination } from '../components/ui/Pagination'
import { api, errorMessage, photoSrc } from '../lib/api'
import type { Employee, EmployeeListResponse } from '../types'

export function EmployeesPage() {
  const [data, setData] = useState<EmployeeListResponse | null>(null)
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Employee | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const { data } = await api.get<EmployeeListResponse>('/admin/employees', {
        params: { search: search || undefined, page, limit: 10 },
      })
      setData(data)
    } catch (err) {
      setError(errorMessage(err, 'Gagal memuat data karyawan'))
    } finally {
      setLoading(false)
    }
  }, [search, page])

  useEffect(() => {
    load()
  }, [load])

  const submitSearch = (event: FormEvent) => {
    event.preventDefault()
    setPage(1)
    setSearch(searchInput.trim())
  }

  const openCreate = () => {
    setEditing(null)
    setModalOpen(true)
  }

  const openEdit = (employee: Employee) => {
    setEditing(employee)
    setModalOpen(true)
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-ink-900">Data Karyawan</h1>
          <p className="text-sm text-ink-500">
            Tambah karyawan baru atau perbarui data yang sudah ada
          </p>
        </div>
        <Button onClick={openCreate}>
          <PlusIcon className="h-4 w-4" />
          Tambah Karyawan
        </Button>
      </div>

      <Card className="p-5">
        <form onSubmit={submitSearch} className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-ink-400">
              <SearchIcon className="h-4 w-4" />
            </span>
            <input
              type="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Cari nama atau email karyawan"
              aria-label="Cari karyawan"
              className="min-h-11 w-full rounded-xl border border-ink-300 bg-white pr-3.5 pl-9 text-sm text-ink-800 transition-colors placeholder:text-ink-400 focus:border-brand-500"
            />
          </div>
          <Button type="submit" loading={loading}>
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
                  No. Handphone
                </th>
                <th scope="col" className="px-5 py-3 font-bold text-ink-600">
                  Status
                </th>
                <th scope="col" className="px-5 py-3 text-right font-bold text-ink-600">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {data?.items.map((employee) => (
                <tr key={employee.id} className="transition-colors hover:bg-ink-50">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar
                        name={employee.name}
                        src={photoSrc(employee.photoUrl)}
                      />
                      <div className="min-w-0">
                        <p className="font-bold text-ink-900">{employee.name}</p>
                        <p className="truncate text-xs text-ink-500">
                          {employee.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap text-ink-600">
                    {employee.position}
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap tabular-nums text-ink-600">
                    {employee.phone ?? '-'}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex flex-wrap gap-1.5">
                      <Badge tone={employee.isActive ? 'success' : 'neutral'}>
                        {employee.isActive ? 'Aktif' : 'Nonaktif'}
                      </Badge>
                      {employee.role === 'ADMIN' && <Badge tone="brand">HRD</Badge>}
                    </div>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => openEdit(employee)}
                      className="inline-flex min-h-11 cursor-pointer items-center gap-1.5 rounded-lg px-3 text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-50"
                    >
                      <PencilIcon className="h-4 w-4" />
                      Update
                    </button>
                  </td>
                </tr>
              ))}

              {!loading && data?.items.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-sm text-ink-500">
                    Tidak ada karyawan yang cocok dengan pencarian.
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

      <EmployeeFormModal
        open={modalOpen}
        employee={editing}
        onClose={() => setModalOpen(false)}
        onSaved={load}
      />
    </div>
  )
}
