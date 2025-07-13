import { Avatar } from '../avatar'
import { Student } from '../user/student'

/**
 * Represents the relationship between a student and an avatar they have acquired
 * Based on:
 * - Migration: database/migrations/2025_06_22_100430_create_student_avatars_table.php
 * - Model: app/Models/StudentAvatar.php
 */
export interface StudentAvatar {
  /** Unique identifier */
  id: number

  /** Foreign keys */
  student_id: number
  avatar_id: number

  /** Whether this avatar is currently active for the student */
  active: boolean

  /** Points used to acquire this avatar */
  points_store: number

  /** Date when the avatar was acquired */
  exchange_date: string | null

  /** Timestamps */
  created_at: string
  updated_at: string

  // Relations
  /** The student who owns this avatar */
  student?: Student

  /** The avatar details */
  avatar?: Avatar
}

/**
 * Type for creating a new student-avatar relationship
 */
export type CreateStudentAvatar = Omit<StudentAvatar, 'id' | 'created_at' | 'updated_at' | 'student' | 'avatar'> & {
  /** The student ID */
  student_id: number

  /** The avatar ID */
  avatar_id: number

  /** Whether to make this the active avatar */
  active?: boolean

  /** Points used to acquire the avatar */
  points_store: number

  /** Optional exchange date (defaults to now) */
  exchange_date?: string | null
}

/**
 * Type for updating a student's avatar
 */
export type UpdateStudentAvatar = Partial<Omit<CreateStudentAvatar, 'student_id' | 'avatar_id'>> & {
  id: number

  /** Whether to make this the active avatar */
  active?: boolean

  /** Points used to acquire the avatar */
  points_store?: number

  /** Exchange date */
  exchange_date?: string | null
}

/**
 * Type for setting a student's active avatar
 */
export interface SetActiveStudentAvatar {
  /** The student avatar ID to activate */
  student_avatar_id: number
}

/**
 * Type for filtering student avatars
 */
export interface StudentAvatarFilters {
  /** Filter by student ID */
  student_id?: number

  /** Filter by avatar ID */
  avatar_id?: number

  /** Filter by active status */
  active?: boolean

  /** Include avatar details */
  with_avatar?: boolean

  /** Include student details */
  with_student?: boolean

  /** Pagination */
  page?: number
  per_page?: number
}

/**
 * Type for the student avatar purchase response
 */
export interface StudentAvatarPurchaseResponse {
  /** The created student avatar record */
  student_avatar: StudentAvatar

  /** The updated student record (with updated points) */
  student: Student

  /** Whether this is the student's active avatar */
  is_active: boolean

  /** Message about the purchase */
  message: string
}
