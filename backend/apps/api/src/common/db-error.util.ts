import { QueryFailedError } from 'typeorm';

/** Pelanggaran unique index MySQL (ER_DUP_ENTRY) yang dibungkus TypeORM. */
export function isUniqueViolation(error: unknown): boolean {
  return (
    error instanceof QueryFailedError &&
    (error.driverError as { code?: string } | undefined)?.code ===
      'ER_DUP_ENTRY'
  );
}
