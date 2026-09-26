import { useEffect, useRef, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { CameraIcon, LockIcon, UserIcon } from '../components/Icons'
import { Alert } from '../components/ui/Alert'
import { Avatar } from '../components/ui/Avatar'
import { Button } from '../components/ui/Button'
import { Card, CardHeader } from '../components/ui/Card'
import { Field } from '../components/ui/Field'
import { api, errorMessage, photoSrc } from '../lib/api'
import { compressImage } from '../lib/image'
import type { Profile } from '../types'

type Feedback = { tone: 'success' | 'error'; message: string } | null

export function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  const [phone, setPhone] = useState('')
  const [phoneSaving, setPhoneSaving] = useState(false)
  const [phoneFeedback, setPhoneFeedback] = useState<Feedback>(null)

  const [photoSaving, setPhotoSaving] = useState(false)
  const [photoFeedback, setPhotoFeedback] = useState<Feedback>(null)
  const fileInput = useRef<HTMLInputElement>(null)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [passwordSaving, setPasswordSaving] = useState(false)
  const [passwordFeedback, setPasswordFeedback] = useState<Feedback>(null)

  useEffect(() => {
    api
      .get<Profile>('/profile')
      .then((response) => {
        setProfile(response.data)
        setPhone(response.data.phone ?? '')
      })
      .catch(() => setPhoneFeedback({ tone: 'error', message: 'Gagal memuat profil' }))
      .finally(() => setLoading(false))
  }, [])

  const savePhone = async (event: FormEvent) => {
    event.preventDefault()
    setPhoneFeedback(null)
    setPhoneSaving(true)
    try {
      const { data } = await api.patch<Profile>('/profile', { phone })
      setProfile(data)
      setPhoneFeedback({ tone: 'success', message: 'Nomor handphone berhasil diperbarui' })
    } catch (err) {
      setPhoneFeedback({ tone: 'error', message: errorMessage(err) })
    } finally {
      setPhoneSaving(false)
    }
  }

  const uploadPhoto = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setPhotoFeedback(null)
    setPhotoSaving(true)
    try {
      const form = new FormData()
      form.append('photo', await compressImage(file))


      const { data } = await api.post<Profile>('/profile/photo', form)
      setProfile(data)
      setPhotoFeedback({ tone: 'success', message: 'Foto berhasil diperbarui' })
    } catch (err) {
      setPhotoFeedback({ tone: 'error', message: errorMessage(err) })
    } finally {
      setPhotoSaving(false)
      if (fileInput.current) fileInput.current.value = ''
    }
  }

  const savePassword = async (event: FormEvent) => {
    event.preventDefault()
    setPasswordFeedback(null)
    setPasswordSaving(true)
    try {
      await api.patch('/profile/password', { currentPassword, newPassword })
      setPasswordFeedback({ tone: 'success', message: 'Password berhasil diperbarui' })
      setCurrentPassword('')
      setNewPassword('')
    } catch (err) {
      setPasswordFeedback({ tone: 'error', message: errorMessage(err) })
    } finally {
      setPasswordSaving(false)
    }
  }

  if (loading) {
    return <p className="py-10 text-center text-sm text-ink-500">Memuat profil...</p>
  }

  if (!profile) {
    return <Alert tone="error" message="Profil tidak dapat dimuat" />
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-extrabold text-ink-900">Profil Karyawan</h1>
        <p className="text-sm text-ink-500">
          Kelola foto, nomor handphone, dan password akun Anda
        </p>
      </div>

      <Card className="p-5 sm:p-6">
        <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start">
          <div className="flex flex-col items-center gap-2.5">
            <Avatar name={profile.name} src={photoSrc(profile.photoUrl)} size="xl" />
            <input
              ref={fileInput}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={uploadPhoto}
            />
            <Button
              type="button"
              variant="secondary"
              loading={photoSaving}
              onClick={() => fileInput.current?.click()}
            >
              {!photoSaving && <CameraIcon className="h-4 w-4" />}
              Ubah Foto
            </Button>
          </div>

          <dl className="grid w-full flex-1 gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-semibold tracking-wide text-ink-500 uppercase">
                Nama
              </dt>
              <dd className="mt-0.5 font-bold text-ink-900">{profile.name}</dd>
            </div>
            <div className="min-w-0">
              <dt className="text-xs font-semibold tracking-wide text-ink-500 uppercase">
                Email Perusahaan
              </dt>
              <dd className="mt-0.5 truncate font-semibold text-ink-700">
                {profile.email}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold tracking-wide text-ink-500 uppercase">
                Posisi
              </dt>
              <dd className="mt-0.5 font-semibold text-ink-700">
                {profile.position}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold tracking-wide text-ink-500 uppercase">
                Nomor Handphone
              </dt>
              <dd className="mt-0.5 font-semibold text-ink-700 tabular-nums">
                {profile.phone ?? '-'}
              </dd>
            </div>
          </dl>
        </div>

        {photoFeedback && (
          <div className="mt-4">
            <Alert tone={photoFeedback.tone} message={photoFeedback.message} />
          </div>
        )}
      </Card>

      <Card>
        <CardHeader
          title="Nomor Handphone"
          description="Nomor aktif untuk dihubungi HRD"
          icon={<UserIcon />}
        />
        <form onSubmit={savePhone} className="space-y-4 p-5" noValidate>
          {phoneFeedback && (
            <Alert tone={phoneFeedback.tone} message={phoneFeedback.message} />
          )}
          <Field
            label="Nomor Handphone"
            type="tel"
            inputMode="numeric"
            placeholder="081234567890"
            hint="Format Indonesia, contoh 081234567890"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <Button type="submit" loading={phoneSaving}>
            Simpan Perubahan
          </Button>
        </form>
      </Card>

      <Card>
        <CardHeader
          title="Ubah Password"
          description="Gunakan kombinasi huruf besar, huruf kecil, dan angka"
          icon={<LockIcon />}
        />
        <form onSubmit={savePassword} className="space-y-4 p-5" noValidate>
          {passwordFeedback && (
            <Alert tone={passwordFeedback.tone} message={passwordFeedback.message} />
          )}
          <Field
            label="Password Saat Ini"
            type="password"
            autoComplete="current-password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
          <Field
            label="Password Baru"
            type="password"
            autoComplete="new-password"
            hint="Minimal 8 karakter, memuat huruf besar, huruf kecil, dan angka"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <Button type="submit" loading={passwordSaving}>
            Perbarui Password
          </Button>
        </form>
      </Card>
    </div>
  )
}
