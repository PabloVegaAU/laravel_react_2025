import type { BaseEntity } from '@/types/core'
import type { Profile } from '../auth/profile'
import type { Student } from './student'
import type { Teacher } from './teacher'

/**
 * Define los roles posibles que puede tener un usuario en el sistema
 */
export type UserRole = 'admin' | 'teacher' | 'student' | 'guest'

/**
 * Representa un usuario en el sistema
 * @see app/Models/User.php
 * @see database/migrations/0001_01_01_000000_create_users_table.php
 */
export type User = BaseEntity & {
  name: string
  email: string | null
  email_verified_at: string | null

  // Relaciones
  profile?: Profile
  student?: Student
  teacher?: Teacher
  roles?: UserRole[]
}
