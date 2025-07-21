import { LearningSession } from '../learning-session'
import { Teacher } from '../user/teacher'
import { ApplicationFormQuestion } from './form/application-form-question'
import { ApplicationFormResponse } from './form/response/application-form-response'

/**
 * Estado de un formulario de aplicación
 * @see database/migrations/2025_06_22_100330_create_application_forms_table.php
 * @see app/Models/ApplicationForm.php
 */
export type ApplicationFormStatus = 'draft' | 'scheduled' | 'active' | 'inactive' | 'archived'

/**
 * Formulario de aplicación
 * @see database/migrations/2025_06_22_100330_create_application_forms_table.php
 * @see app/Models/ApplicationForm.php
 */
export interface ApplicationForm {
  id: number
  name: string
  description: string
  start_date: string
  end_date: string
  score_max: number
  status: ApplicationFormStatus
  teacher_id: number
  learning_session_id: number | null
  created_at: string
  updated_at: string
  deleted_at: string | null

  // Relaciones
  teacher: Teacher
  learning_session: LearningSession | null
  questions: ApplicationFormQuestion[]
  responses: ApplicationFormResponse[]
}

/**
 * Datos para crear un formulario de aplicación
 * @see database/migrations/2025_06_22_100330_create_application_forms_table.php
 * @see app/Http/Controllers/ApplicationFormController.php
 */
export interface CreateApplicationFormData {
  name: string
  description?: string
  start_date: string
  end_date: string
  score_max?: number
  status?: ApplicationFormStatus
  teacher_id: number
  learning_session_id?: number | null
  question_ids?: number[]
}

/**
 * Datos para actualizar un formulario de aplicación
 * @see database/migrations/2025_06_22_100330_create_application_forms_table.php
 * @see app/Http/Controllers/ApplicationFormController.php
 */
export interface UpdateApplicationFormData {
  id: number
  name?: string
  description?: string
  start_date?: string
  end_date?: string
  score_max?: number
  status?: ApplicationFormStatus
  learning_session_id?: number | null
}

/**
 * Filtros para buscar formularios de aplicación
 * @see app/Models/ApplicationForm.php
 */
export interface ApplicationFormFilters {
  search?: string
  status?: ApplicationFormStatus | ApplicationFormStatus[]
  teacher_id?: number
  learning_session_id?: number | null
  starts_before?: string
  starts_after?: string
  ends_before?: string
  ends_after?: string
  with_trashed?: boolean
  only_trashed?: boolean
  include?: Array<'teacher' | 'learning_session' | 'questions' | 'responses'>
  sort_by?: 'name' | 'start_date' | 'end_date' | 'created_at' | 'updated_at'
  sort_order?: 'asc' | 'desc'
}

/**
 * Estadísticas de un formulario de aplicación
 * @see app/Models/ApplicationForm.php
 */
export interface ApplicationFormStats {
  total_questions: number
  total_responses: number
  average_score: number
  completion_rate: number
  question_stats: Array<{
    question_id: number
    question_text: string
    average_score: number
    correct_count: number
    incorrect_count: number
  }>
  response_stats: {
    by_day: Record<string, number>
    by_status: Record<string, number>
  }
}

/**
 * Datos para duplicar un formulario
 * @see app/Http/Controllers/ApplicationFormController.php
 */
export interface DuplicateApplicationFormData {
  name: string
  description?: string
  copy_questions?: boolean
  new_dates?: {
    start_date: string
    end_date: string
  }
}
