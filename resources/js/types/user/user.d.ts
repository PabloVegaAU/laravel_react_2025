import type { Profile } from '../auth/profile'
import type { Student } from './student'
import type { Teacher } from './teacher'

/**
 * Defines the possible roles a user can have in the system.
 */
export type UserRole = 'admin' | 'teacher' | 'student' | 'guest'

/**
 * Represents a user in the system.
 * This interface should reflect the structure of the User model and the users table.
 * @see app/Models/User.php
 * @see database/migrations/0001_01_01_000000_create_users_table.php
 */
export interface User {
  id: number
  name: string
  email: string | null
  email_verified_at: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null

  // Relationships
  profile?: Profile
  student?: Student
  teacher?: Teacher
  roles?: UserRole[]
}
