import { Level } from '../academic/level'
import { Range } from '../academic/range'
import { Student } from './student'

/**
 * Represents a student's level achievement history
 * Based on:
 * - Migration: database/migrations/2025_06_22_100140_create_student_level_histories_table.php
 * - Model: app/Models/StudentLevelHistory.php
 */
export interface StudentLevelHistory {
  /** Unique identifier */
  id: number

  /** Reference to the student */
  student_id: number

  /** Reference to the achieved level */
  level_id: number

  /** Reference to the achieved range */
  range_id: number

  /** Accumulated experience points */
  experience: number

  /** Date and time when the level/range was achieved */
  achieved_at: string

  /** Timestamp when the record was created */
  created_at: string

  /** Timestamp when the record was last updated */
  updated_at: string

  // Relations

  /** The student who achieved this level */
  student?: Student

  /** The level that was achieved */
  level?: Level

  /** The range that was achieved */
  range?: Range
}

/**
 * Type for creating a new student level history record
 */
export type CreateStudentLevelHistory = Omit<StudentLevelHistory, 'id' | 'created_at' | 'updated_at' | 'student' | 'level' | 'range'>

/**
 * Type for updating an existing student level history record
 */
export type UpdateStudentLevelHistory = Partial<CreateStudentLevelHistory>
