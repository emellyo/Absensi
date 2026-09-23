import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { useToast } from '../hooks/useToast'
import { api, errorMessage } from '../lib/api'
import type { Employee } from '../types'
import { Alert } from './ui/Alert'
import { Button } from './ui/Button'
import { Field } from './ui/Field'
import { Modal } from './ui/Modal'

interface EmployeeFormModalProps {
  open: boolean
  employee: Employee | null
  onClose: () => void
  onSaved: () => void
}

const EMPTY = { name: '', email: '', password: '', position: '', phone: '' }

export function EmployeeFormModal({
  open,
  employee,
  onClose,
  onSaved,
}: EmployeeFormModalProps) {
  const { showToast } = useToast()
  const [form, setForm] = useState(EMPTY)
  const [isActive, setIsActive] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const isEdit = Boolean(employee)

  useEffect(() => {
    if (!open) return

    setError('')
    if (employee) {
      setForm({
        name: employee.name,
        email: employee.email,
        password: '',
        position: employee.position,
        phone: employee.phone ?? '',
      })
      setIsActive(employee.isActive)
    } else {
      setForm(EMPTY)
      setIsActive(true)
    }
  }, [open, employee])

  const update = (key: keyof typeof EMPTY, value: string) =>
    setForm((current) => ({ ...current, [key]: value }))

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError('')
    setSaving(true)

    try {
      if (employee) {
        const payload: Record<string, unknown> = {
          name: form.name,
          position: form.position,
          isActive,
        }
        if (form.phone) payload.phone = form.phone
        if (form.password) payload.password = form.password

        await api.patch(`/admin/employees/${employee.id}`, payload)
        showToast({ tone: 'success', title: 'Data karyawan diperbarui' })
      } else {
        const payload: Record<string, unknown> = {
          name: form.name,
          email: form.email,
          password: form.password,
          position: form.position,
        }
        if (form.phone) payload.phone = form.phone

        await api.post('/admin/employees', payload)
        showToast({ tone: 'success', title: 'Karyawan baru ditambahkan' })
      }

      onSaved()
      onClose()
    } catch (err) {
      setError(errorMessage(err, 'Gagal menyimpan data karyawan'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal
      open={open}
      title={isEdit ? 'Update Data Karyawan' : 'Tambah Karyawan'}
      description={
        isEdit
          ? 'Email perusahaan tidak dapat diubah'
          : 'Karyawan dapat langsung login dengan email dan password ini'
      }
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {error && <Alert tone="error" message={error} />}

        <Field
          label="Nama Lengkap"
          value={form.name}
          onChange={(e) => update('name', e.target.value)}
          required
        />

        <Field
          label="Email Perusahaan"
          type="email"
          value={form.email}
          onChange={(e) => update('email', e.target.value)}
          disabled={isEdit}
          required={!isEdit}
        />

        <Field
          label="Posisi"
          value={form.position}
          onChange={(e) => update('position', e.target.value)}
          required
        />

        <Field
          label="Nomor Handphone"
          type="tel"
          inputMode="numeric"
          placeholder="081234567890"
          hint="Opsional. Format Indonesia, contoh 081234567890"
          value={form.phone}
          onChange={(e) => update('phone', e.target.value)}
        />

        <Field
          label={isEdit ? 'Reset Password' : 'Password'}
          type="password"
          autoComplete="new-password"
          hint={
            isEdit
              ? 'Kosongkan bila password tidak diubah'
              : 'Minimal 8 karakter, memuat huruf besar, huruf kecil, dan angka'
          }
          value={form.password}
          onChange={(e) => update('password', e.target.value)}
          required={!isEdit}
        />

        {isEdit && (
          <label className="flex min-h-11 cursor-pointer items-center gap-2.5 rounded-xl border border-ink-300 px-3.5">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="h-4 w-4 cursor-pointer accent-brand-600"
            />
            <span className="text-sm font-semibold text-ink-700">
              Karyawan aktif
            </span>
          </label>
        )}

        <div className="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-end">
          <Button type="button" variant="secondary" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit" loading={saving}>
            {isEdit ? 'Simpan Perubahan' : 'Tambah Karyawan'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
