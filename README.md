# Aplikasi Absensi WFH Karyawan — Dexa Group Technical Test

Sistem absensi Work From Home yang terdiri dari **dua aplikasi web** dan **dua service backend**, dengan satu REST API yang dikonsumsi kedua frontend.

| Komponen | Teknologi | Port |
|---|---|---|
| `backend/apps/api` | NestJS 12 (REST API + WebSocket) | 3000 |
| `backend/apps/logging-service` | NestJS 12 (consumer message queue) | 3001 |
| `frontend-employee` | React 19 + Vite + Tailwind CSS 4 | 5173 |
| `frontend-admin` | React 19 + Vite + Tailwind CSS 4 | 5174 |
| MySQL | `dexa_absensi` (aplikasi) + `dexa_logs` (log) | 3306 |
| Redis | message queue (BullMQ) | 6379 |

---

## Arsitektur

```
                    ┌──────────────────────┐
                    │  frontend-employee   │  Profil · Absen · Summary
                    │     (port 5173)      │
                    └──────────┬───────────┘
                               │  REST (JWT)
                               ▼
┌──────────────────┐   ┌───────────────────┐   ┌──────────────────┐
│  frontend-admin  │──▶│   api (port 3000) │──▶│  MySQL           │
│   (port 5174)    │   │   NestJS REST     │   │  dexa_absensi    │
└──────────────────┘   └─────────┬─────────┘   └──────────────────┘
        ▲  WebSocket             │
        │  notifikasi            │  publish job
        └────────────────────────┤
                                 ▼
                       ┌──────────────────┐
                       │  Redis / BullMQ  │  queue "activity-log"
                       └────────┬─────────┘
                                │  consume
                                ▼
                    ┌───────────────────────┐   ┌──────────────────┐
                    │  logging-service      │──▶│  MySQL           │
                    │  (port 3001)          │   │  dexa_logs       │
                    └───────────────────────┘   └──────────────────┘
```

Setiap perubahan data karyawan memicu dua jalur paralel:

1. **Notifikasi realtime** — API mengirim event lewat WebSocket ke room `admins`, muncul sebagai popup di portal HRD.
2. **Message queue** — API menerbitkan job ke Redis (BullMQ). `logging-service` mengonsumsinya dan menulis audit trail ke **database terpisah** `dexa_logs`. Job memakai `eventId` unik sehingga retry tidak menghasilkan log ganda.

Kedua jalur sengaja tidak menggagalkan request utama kalau bermasalah — absen dan update profil tetap berhasil meski Redis sedang mati.

---

## Menjalankan

### Prasyarat

- **Node.js ≥ 20.19** (dikembangkan dengan Node 24.21). Toolchain NestJS 12 & Vite 8 tidak jalan di Node 20.15 ke bawah.
- MySQL 8+ dan Redis 6.2+

### 1. Siapkan MySQL & Redis

**Opsi A — Docker (paling mudah):**

```bash
docker compose -f infra/docker-compose.yml up -d
```

**Opsi B — MySQL & Redis portable di Windows (tanpa instalasi/admin):**

```powershell
powershell -ExecutionPolicy Bypass -File scripts/start-infra.ps1
```

**Opsi C — instalasi sendiri:** buat dua database dan satu user.

```sql
CREATE DATABASE dexa_absensi CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE dexa_logs    CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'dexa_app'@'%' IDENTIFIED BY 'dexa_password';
GRANT ALL PRIVILEGES ON dexa_absensi.* TO 'dexa_app'@'%';
GRANT ALL PRIVILEGES ON dexa_logs.*    TO 'dexa_app'@'%';
```

Redis harus memakai `maxmemory-policy noeviction` (syarat BullMQ).

### 2. Backend

```bash
cd backend
cp .env.example .env      # sesuaikan bila kredensial berbeda
npm install
npm run seed              # membuat skema + data contoh
```

Jalankan kedua service di dua terminal:

```bash
npm run start:api         # http://localhost:3000
npm run start:logging     # http://localhost:3001
```

Dokumentasi API (Swagger): <http://localhost:3000/api/docs>

### 3. Frontend

```bash
cd frontend-employee && npm install && npm run dev   # http://localhost:5173
cd frontend-admin    && npm install && npm run dev   # http://localhost:5174
```

### Akun Demo

| Peran | Email | Password |
|---|---|---|
| Admin HRD | `hrd@dexagroup.com` | `Admin123!` |
| Karyawan | `bayu@dexagroup.com` | `Password123!` |
| Karyawan | `siti.rahmawati@dexagroup.com` | `Password123!` |
| Karyawan | `andi.wijaya@dexagroup.com` | `Password123!` |
| Karyawan | `dewi.lestari@dexagroup.com` | `Password123!` |

---

## Struktur Database

**`dexa_absensi`** — database aplikasi

`employees`

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | INT PK AI | |
| `name` | VARCHAR(120) | |
| `email` | VARCHAR(160) | unique, email perusahaan untuk login |
| `password_hash` | VARCHAR(120) | bcrypt |
| `position` | VARCHAR(120) | |
| `phone` | VARCHAR(30) NULL | |
| `photo_path` | VARCHAR(255) NULL | nama file di `backend/uploads` |
| `role` | ENUM(EMPLOYEE, ADMIN) | |
| `is_active` | BOOLEAN | nonaktifkan tanpa menghapus riwayat absensi |
| `created_at` / `updated_at` | DATETIME | |

`attendances`

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | INT PK AI | |
| `employee_id` | INT FK → employees | ON DELETE CASCADE |
| `attendance_date` | DATE | tanggal absen |
| `attendance_time` | TIME | waktu absen |
| `status` | ENUM(MASUK, PULANG) | |
| `recorded_at` | DATETIME(3) | timestamp presisi |
| `created_at` | DATETIME | |

Unique index `(employee_id, attendance_date, status)` mencegah absen masuk/pulang ganda dalam satu hari di level database.

**`dexa_logs`** — database log terpisah

`activity_logs` menyimpan `event_id` (unique, untuk idempotency), `action`, data karyawan yang diubah, siapa yang mengubah, `changes` (JSON berisi nilai sebelum/sesudah), dan `occurred_at`.

> Skema dibuat otomatis lewat `synchronize` TypeORM agar reviewer cukup menjalankan `npm run seed`. Untuk produksi ini diganti migration.

---

## Endpoint API

Semua endpoint berprefiks `/api`. Selain `login`, semuanya butuh header `Authorization: Bearer <token>`.

| Method | Endpoint | Akses | Keterangan |
|---|---|---|---|
| POST | `/auth/login` | publik | Login dengan email perusahaan + password |
| GET | `/auth/me` | login | Identitas dari token aktif |
| GET | `/profile` | karyawan | Nama, email, foto, posisi, no. HP |
| PATCH | `/profile` | karyawan | Ubah nomor handphone |
| POST | `/profile/photo` | karyawan | Ubah foto (multipart, maks 2 MB, JPG/PNG/WEBP) |
| PATCH | `/profile/password` | karyawan | Ubah password |
| POST | `/attendance/check-in` | karyawan | Absen masuk |
| POST | `/attendance/check-out` | karyawan | Absen pulang |
| GET | `/attendance/today` | karyawan | Status absen hari ini |
| GET | `/attendance/summary` | karyawan | Summary absen, default awal bulan s/d hari ini, filter `?from=&to=` |
| GET | `/admin/employees` | admin | Daftar karyawan, filter `?search=&page=&limit=` |
| GET | `/admin/employees/:id` | admin | Detail karyawan |
| POST | `/admin/employees` | admin | Tambah karyawan |
| PATCH | `/admin/employees/:id` | admin | Update karyawan |
| GET | `/admin/attendance` | admin | Absensi semua karyawan (read only), filter `?from=&to=&employeeId=` |

Endpoint `/admin/*` dijaga `RolesGuard`; akun karyawan menerima `403`.

---

## Catatan Teknis

**Zona waktu.** Tanggal dan jam absen dihitung pada zona `Asia/Jakarta` lalu disimpan sebagai kolom `DATE`/`TIME` terpisah, sehingga summary tidak bergeser akibat konversi UTC.

**Keamanan.** Password di-hash bcrypt (10 rounds); JWT berumur 1 hari; setiap request memverifikasi ulang bahwa akun masih aktif; validasi input memakai `class-validator` dengan `whitelist` + `forbidNonWhitelisted`; upload dibatasi tipe MIME dan ukuran.

**WebSocket.** Koneksi ke namespace `/notifications` memverifikasi JWT saat handshake dan menolak selain role `ADMIN`.

**Pilihan ORM.** Memakai TypeORM, bukan Prisma, karena rilis stabil Prisma saat pengerjaan adalah major baru yang belum stabil di kombinasi MySQL 9 + ESM, sementara TypeORM menangani dua datasource terpisah (aplikasi & log) dengan lebih ringkas lewat `@nestjs/typeorm`.

---

## Pemetaan ke Requirement

| Requirement | Implementasi |
|---|---|
| Login email perusahaan + password | `POST /auth/login`, JWT + bcrypt |
| Menu Profil (nama, email, foto, posisi, no. HP) | `frontend-employee` → halaman Profil |
| Ubah foto, no. HP, password | `POST /profile/photo`, `PATCH /profile`, `PATCH /profile/password` |
| Popup notifikasi di halaman admin | WebSocket (Socket.IO) → toast + lonceng notifikasi di `frontend-admin` |
| Message queue → database terpisah | BullMQ/Redis → `logging-service` → database `dexa_logs` |
| Absen masuk & pulang (tanggal, waktu, status) | Tabel `attendances`, halaman Absen |
| Summary absen + filter date range | `GET /attendance/summary`, default awal bulan s/d hari ini |
| Web admin HRD: tambah/update karyawan | `frontend-admin` → Data Karyawan |
| Web admin HRD: lihat absensi semua karyawan (read only) | `frontend-admin` → Monitoring Absensi |
| Konsep microservices (REST API) | Dua service NestJS terpisah, satu REST API dikonsumsi dua frontend |
| Responsive laptop & mobile | Tailwind, sidebar di desktop & bottom nav di mobile |
| CSS framework | Tailwind CSS 4 |
| Custom component | `Button`, `Field`, `Card`, `Modal`, `Badge`, `Avatar`, `Alert`, `Pagination`, `StatusBadge`, `ToastHost`, `NotificationBell` |
