import { BaseEntity } from '../core'
import type { StudentLevelHistory } from '../student/student-level-history'
import type { Student } from '../user/student'
import type { Classroom } from './classroom'
import type { Enrollment } from './enrollment'

/**
 * Representa un nivel en el sistema educativo
 * @see database/migrations/2025_06_22_100000_create_levels_table.php
 * @see app/Models/Level.php
 */
export type Level = BaseEntity & {
  name: string
  level: number
  experience_max: number
  experience_required: number

  // Relaciones
  studentLevelHistories?: StudentLevelHistory[]
  students?: Student[]
  classrooms?: Classroom[]
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
