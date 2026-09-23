<#
.SYNOPSIS
  Menjalankan MySQL dan Redis versi portable (tanpa instalasi & tanpa hak admin).

.DESCRIPTION
  Dipakai di mesin yang tidak memasang MySQL/Redis sebagai Windows service.
  Kalau Anda memakai Docker, jalankan `docker compose -f infra/docker-compose.yml up -d`
  sebagai gantinya.

.EXAMPLE
  powershell -ExecutionPolicy Bypass -File scripts/start-infra.ps1
#>

param(
  [string]$MysqlHome = "$env:USERPROFILE\Applications\mysql-9.7.1\PFiles64\MySQL\MySQL Server 9.7",
  [string]$RedisHome = "$env:USERPROFILE\Applications\redis-8.10.2\Redis-8.10.2-Windows-x64-msys2"
)

$ErrorActionPreference = 'Stop'

function Test-Port($port) {
  $null -ne (Get-NetTCPConnection -State Listen -ErrorAction SilentlyContinue |
    Where-Object { $_.LocalPort -eq $port })
}

# --- MySQL ---
if (Test-Port 3306) {
  Write-Host "MySQL sudah berjalan di port 3306." -ForegroundColor Green
} else {
  if (-not (Test-Path "$MysqlHome\bin\mysqld.exe")) {
    throw "mysqld.exe tidak ditemukan di '$MysqlHome'. Sesuaikan parameter -MysqlHome."
  }

  # Inisialisasi data directory pada run pertama.
  if (-not (Test-Path "$MysqlHome\data")) {
    Write-Host "Inisialisasi data directory MySQL..." -ForegroundColor Cyan
    & "$MysqlHome\bin\mysqld.exe" --initialize-insecure --basedir="$MysqlHome" --datadir="$MysqlHome\data" --console
  }

  Write-Host "Menjalankan MySQL..." -ForegroundColor Cyan
  Start-Process -FilePath "$MysqlHome\bin\mysqld.exe" `
    -ArgumentList "--basedir=`"$MysqlHome`"", "--datadir=`"$MysqlHome\data`"", '--port=3306' `
    -WindowStyle Hidden

  Start-Sleep -Seconds 8

  $sql = @'
CREATE DATABASE IF NOT EXISTS dexa_absensi CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS dexa_logs CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'dexa_app'@'%' IDENTIFIED BY 'dexa_password';
GRANT ALL PRIVILEGES ON dexa_absensi.* TO 'dexa_app'@'%';
GRANT ALL PRIVILEGES ON dexa_logs.* TO 'dexa_app'@'%';
FLUSH PRIVILEGES;
'@
  $sql | & "$MysqlHome\bin\mysql.exe" -u root --protocol=TCP -h 127.0.0.1 -P 3306
  Write-Host "MySQL siap (database dexa_absensi & dexa_logs)." -ForegroundColor Green
}

# --- Redis ---
if (Test-Port 6379) {
  Write-Host "Redis sudah berjalan di port 6379." -ForegroundColor Green
} else {
  if (-not (Test-Path "$RedisHome\redis-server.exe")) {
    throw "redis-server.exe tidak ditemukan di '$RedisHome'. Sesuaikan parameter -RedisHome."
  }

  # Build msys2 memakai path gaya POSIX, jadi config disalin ke folder Redis
  # dan dipanggil dengan nama relatif.
  New-Item -ItemType Directory -Force -Path "$RedisHome\data" | Out-Null
  Copy-Item "$PSScriptRoot\..\infra\redis.conf" "$RedisHome\dexa-redis.conf" -Force

  Write-Host "Menjalankan Redis..." -ForegroundColor Cyan
  Start-Process -FilePath "$RedisHome\redis-server.exe" `
    -ArgumentList 'dexa-redis.conf' -WorkingDirectory $RedisHome -WindowStyle Hidden

  Start-Sleep -Seconds 4
  Write-Host "Redis siap: $(& "$RedisHome\redis-cli.exe" -p 6379 PING)" -ForegroundColor Green
}

Write-Host ''
Write-Host 'Infrastruktur siap. Langkah berikutnya:' -ForegroundColor Yellow
Write-Host '  cd backend; npm run seed; npm run start:api'
