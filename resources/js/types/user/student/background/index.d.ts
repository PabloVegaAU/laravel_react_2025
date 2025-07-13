import { Background } from '../background'
import { Student } from '../user/student'

/**
 * Represents the relationship between a student and a background they have acquired
 * Based on:
 * - Migration: database/migrations/2025_06_22_100450_create_student_backgrounds_table.php
 * - Model: app/Models/StudentBackground.php
 */
export interface StudentBackground {
  /** Unique identifier */
  id: number

  /** Foreign keys */
  student_id: number
  background_id: number

  /** Screen where this background is used (e.g., 'profile', 'dashboard') */
  screen: string

  /** Whether this background is currently active for the student on this screen */
  active: boolean

  /** Points used to acquire this background */
  points_store: number

  /** Date when the background was acquired */
  exchange_date: string | null

  /** Timestamps */
  created_at: string
  updated_at: string

  // Relations
  /** The student who owns this background */
  student?: Student

  /** The background details */
  background?: Background
}

/**
 * Type for creating a new student-background relationship
 */
export type CreateStudentBackground = Omit<StudentBackground, 'id' | 'created_at' | 'updated_at' | 'student' | 'background'> & {
  /** The student ID */
  student_id: number

  /** The background ID */
  background_id: number

  /** Screen where this background will be used */
  screen: string

  /** Whether to make this the active background for this screen */
  active?: boolean

  /** Points used to acquire the background */
  points_store: number

  /** Optional exchange date (defaults to now) */
  exchange_date?: string | null
}

/**
 * Type for updating a student's background
 */
export type UpdateStudentBackground = Partial<Omit<CreateStudentBackground, 'student_id' | 'background_id' | 'screen'>> & {
  id: number

  /** Whether to make this the active background for its screen */
  active?: boolean

  /** Points used to acquire the background */
  points_store?: number

  /** Exchange date */
  exchange_date?: string | null
}

/**
 * Type for setting a student's active background for a specific screen
 */
export interface SetActiveStudentBackground {
  /** The student background ID to activate */
  student_background_id: number

  /** The screen where this background will be active */
  screen: string
}

/**
 * Type for filtering student backgrounds
 */
export interface StudentBackgroundFilters {
  /** Filter by student ID */
  student_id?: number

  /** Filter by background ID */
  background_id?: number

  /** Filter by screen */
  screen?: string

  /** Filter by active status */
  active?: boolean

  /** Include background details */
  with_background?: boolean

  /** Include student details */
  with_student?: boolean

  /** Pagination */
  page?: number
  per_page?: number
}

/**
 * Type for the student background purchase response
 */
export interface StudentBackgroundPurchaseResponse {
  /** The created student background record */
  student_background: StudentBackground

  /** The updated student record (with updated points) */
  student: Student

  /** Whether this is the student's active background for its screen */
  is_active: boolean

  /** Message about the purchase */
  message: string
}

/**
 * Type for the student's background activation response
 */
export interface StudentBackgroundActivationResponse {
  /** The updated student background record */
  student_background: StudentBackground

  /** Any previously active background that was deactivated */
  previous_active_background: StudentBackground | null

  /** Message about the activation */
  message: string
}
