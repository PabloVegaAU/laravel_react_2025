import { StudentLevelHistory } from '../student/student-level-history'
import { Level } from './level'

/**
 * Represents a rank/achievement level in the educational system
 * Based on:
 * - Migration: database/migrations/2025_06_22_100010_create_ranges_table.php
 * - Model: app/Models/Range.php
 */
export interface Range {
  /** Unique identifier */
  id: number

  /** Name of the range (e.g., 'Novato', 'Aprendiz', 'Experto') */
  name: string

  /** Color code for UI representation (hex code) */
  color: string

  /** URL of the range's representative image */
  image: string | null

  /** Description of the range and its benefits */
  description: string | null

  /** Display order for sorting */
  order: number

  /** Minimum level required to achieve this range */
  level_required: number

  /** Timestamp when the record was created */
  created_at: string

  /** Timestamp when the record was last updated */
  updated_at: string

  /** Timestamp when the record was soft deleted (if applicable) */
  deleted_at: string | null

  /** Relationships */

  /** The level required to achieve this range */
  level?: Level

  /** All levels that belong to this range */
  levels?: Level[]

  /** Student level history entries for this range */
  student_level_histories?: StudentLevelHistory[]
}

/**
 * Type for creating a new range
 */
export type CreateRange = Omit<Range, 'id' | 'created_at' | 'updated_at' | 'deleted_at' | 'level' | 'levels'>

/**
 * Type for updating an existing range
 */
export type UpdateRange = Partial<CreateRange>
