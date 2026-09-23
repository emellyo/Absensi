import { Employee } from '../database/entities/employee.entity.js';

export interface EmployeeResponse {
  id: number;
  name: string;
  email: string;
  position: string;
  phone: string | null;
  photoUrl: string | null;
  role: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export function toEmployeeResponse(employee: Employee): EmployeeResponse {
  return {
    id: employee.id,
    name: employee.name,
    email: employee.email,
    position: employee.position,
    phone: employee.phone,
    photoUrl: employee.photoPath ? `/uploads/${employee.photoPath}` : null,
    role: employee.role,
    isActive: employee.isActive,
    createdAt: employee.createdAt,
    updatedAt: employee.updatedAt,
  };
}
