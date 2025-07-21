import type { Classroom } from '../../academic/classroom'
import type { CurricularArea } from '../../academic/curricular-area'
import type { ApplicationForm } from '../../application-form'
import type { LearningSession } from '../../learning-session'
import type { User } from '../user'

/**
 * Defines the possible statuses for a teacher.
 */
export type TeacherStatus = 'active' | 'inactive' | 'on_leave' | 'retired'

/**
 * Represents a teacher in the system.
 * This interface should reflect the structure of the Teacher model and the teachers table.
 * @see app/Models/Teacher.php
 * @see database/migrations/2025_06_22_100040_create_teachers_table.php
 */
export interface Teacher {
  user_id: number
  status: TeacherStatus
  created_at: string
  updated_at: string
  deleted_at: string | null

  // Relationships
  user?: User
  classrooms?: Classroom[]
  curricular_areas?: CurricularArea[]
  application_forms?: ApplicationForm[]
  learning_sessions?: LearningSession[]
}

/**
 * Tipo para crear un nuevo profesor
 * @see database/migrations/2025_06_22_100040_create_teachers_table.php
 */
export interface CreateTeacher {
  user_id: number
  status?: TeacherStatus
}

/**
 * Tipo para actualizar un profesor existente
 * @see database/migrations/2025_06_22_100040_create_teachers_table.php
 */
export type UpdateTeacher = Partial<Omit<CreateTeacher, 'user_id'>>
