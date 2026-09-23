import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from '@app/contracts';

@Entity('employees')
export class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 120 })
  name: string;

  @Index('uq_employees_email', { unique: true })
  @Column({ length: 160 })
  email: string;

  @Column({ name: 'password_hash', length: 120 })
  passwordHash: string;

  @Column({ length: 120 })
  position: string;

  @Column({ type: 'varchar', length: 30, nullable: true })
  phone: string | null;

  @Column({
    name: 'photo_path',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  photoPath: string | null;

  @Column({ type: 'enum', enum: Role, default: Role.EMPLOYEE })
  role: Role;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt: Date;
}
