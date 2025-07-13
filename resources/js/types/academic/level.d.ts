import { StudentLevelHistory } from '../student/student-level-history'
import { Student } from '../user/student'
import { Classroom } from './classroom'

/**
 * Represents a level in the educational system
 * Based on:
 * - Migration: database/migrations/2025_06_22_100000_create_levels_table.php
 * - Model: app/Models/Level.php
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

  /** Relationships */
  student_level_histories?: StudentLevelHistory[]
  students?: Student[]
  classrooms?: Classroom[]

  // Relations

  /** History of students reaching this level */
  studentLevelHistories?: StudentLevelHistory[]

  /** Students who have reached this level */
  students?: Student[]
}

/**
 * Type for creating a new level
 */
export type CreateLevel = Omit<Level, 'id' | 'created_at' | 'updated_at' | 'deleted_at' | 'studentLevelHistories' | 'students'>

/**
 * Type for updating an existing level
 */
export type UpdateLevel = Partial<CreateLevel>
