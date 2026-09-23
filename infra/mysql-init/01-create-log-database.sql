-- Database kedua khusus activity log, terpisah dari database aplikasi.
CREATE DATABASE IF NOT EXISTS dexa_logs
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

GRANT ALL PRIVILEGES ON dexa_logs.* TO 'dexa_app'@'%';
FLUSH PRIVILEGES;
