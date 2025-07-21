import type { StudentLevelHistory } from '../student/student-level-history'
import type { Student } from '../user/student'
import type { Classroom } from './classroom'
import type { Enrollment } from './enrollment'

/**
 * Represents a level in the educational system
 * @see database/migrations/2025_06_22_100000_create_levels_table.php
 * @see app/Models/Level.php
 */
export interface Level {
  /** Unique identifier */
  id: number

  /** Level number (1, 2, 3, ...) */
  level: number

  /** Maximum experience points for this level */
  experience_max: number

  /** Experience points required to reach this level */
  experience_required: number

  /** Timestamp when the record was created */
  created_at: string

  /** Timestamp when the record was last updated */
  updated_at: string

  /** Timestamp when the record was soft deleted (if applicable) */
  deleted_at: string | null

  // Relaciones

  /** Historial de estudiantes que alcanzaron este nivel */
  studentLevelHistories?: StudentLevelHistory[]

  /** Estudiantes que han alcanzado este nivel */
  students?: Student[]

  /** Aulas asociadas a este nivel */
  classrooms?: Classroom[]

  /** Matrículas asociadas a través de las aulas */
  enrollments?: Enrollment[]
}

/**
 * Type for creating a new level
 */
export type CreateLevel = Omit<
  Level,
  'id' | 'created_at' | 'updated_at' | 'deleted_at' | 'studentLevelHistories' | 'students' | 'classrooms' | 'enrollments'
>

/**
 * Type for updating an existing level
 */
export type UpdateLevel = Partial<CreateLevel>
