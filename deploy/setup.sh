#!/usr/bin/env sh
# Membuat deploy/.env dengan password & secret acak. Aman dijalankan ulang:
# file yang sudah ada tidak ditimpa (mengganti password MySQL setelah volume
# terbentuk tidak akan berpengaruh dan justru membuat api gagal login).
set -eu

cd "$(dirname "$0")"

if [ -f .env ]; then
  echo "deploy/.env sudah ada, tidak diubah."
  exit 0
fi

random() {
  openssl rand -base64 64 | tr -dc 'A-Za-z0-9' | cut -c1-"$1"
}

ip=$(curl -fsS --max-time 5 https://api.ipify.org 2>/dev/null || hostname -I | awk '{print $1}')

cat > .env <<EOF
MYSQL_ROOT_PASSWORD=$(random 32)
DB_PASSWORD=$(random 32)
JWT_SECRET=$(random 64)

EMPLOYEE_PORT=80
ADMIN_PORT=8080

CORS_ORIGINS=http://$ip,http://$ip:8080
EOF

chmod 600 .env
echo "deploy/.env dibuat (IP terdeteksi: $ip)."
