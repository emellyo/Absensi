import { Role } from '@app/contracts';

export interface JwtPayload {
  sub: number;
  email: string;
  name: string;
  role: Role;
}

/**
 * Class, bukan interface: dipakai sebagai tipe parameter yang didekorasi,
 * sehingga emitDecoratorMetadata membutuhkan nilainya tersedia saat runtime.
 */
export class AuthenticatedUser {
  id: number;
  email: string;
  name: string;
  role: Role;
}
