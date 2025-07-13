import type { LearningSession } from '../learning-session/learning-session'
import type { Teacher } from '../user/teacher'
import type { ApplicationFormQuestion } from './form/application-form-question'
import type { ApplicationFormResponse } from './form/response/application-form-response'

/**
 * Estado posible de un formulario de aplicación
 * @see database/migrations/2025_06_22_100330_create_application_forms_table.php
 * @see app/Models/ApplicationForm.php
 */
export type ApplicationFormStatus = 'draft' | 'scheduled' | 'active' | 'inactive' | 'archived'

/**
 * Representa un formulario de aplicación en el sistema
 * @see database/migrations/2025_06_22_100330_create_application_forms_table.php
 * @see app/Models/ApplicationForm.php
 */
export interface ApplicationForm {
  // Campos principales
  id: number
  name: string
  description: string
  status: ApplicationFormStatus
  score_max: number
  start_date: string // ISO date string
  end_date: string // ISO date string
  teacher_id: number
  learning_session_id: number
  created_at: string
  updated_at: string
  deleted_at: string | null

  // Relaciones
  teacher: Teacher
  learningSession: LearningSession
  questions: ApplicationFormQuestion[]
  responses: ApplicationFormResponse[]

  // Métodos de instancia
  isActive(): boolean
  isUpcoming(): boolean
  isExpired(): boolean
}

/**
 * Datos para crear un nuevo formulario de aplicación
 * @see database/migrations/2025_06_22_100330_create_application_forms_table.php
 * @see app/Models/ApplicationForm.php
 */
export interface CreateApplicationFormData {
  name: string
  description: string
  status?: ApplicationFormStatus
  score_max?: number
  start_date: string
  end_date: string
  teacher_id: number
  learning_session_id: number
  question_ids?: number[]
}

/**
 * Datos para actualizar un formulario de aplicación
 * @see database/migrations/2025_06_22_100330_create_application_forms_table.php
 * @see app/Models/ApplicationForm.php
 */
export interface UpdateApplicationFormData {
  id: number
  name?: string
  description?: string
  status?: ApplicationFormStatus
  score_max?: number
  start_date?: string
  end_date?: string
  question_ids?: number[]
}

/**
 * Datos para actualizar el estado de un formulario
 * @see app/Models/ApplicationForm.php
 */
export interface UpdateApplicationFormStatusData {
  id: number
  status: ApplicationFormStatus
  start_date?: string
  end_date?: string
}

/**
 * Datos para duplicar un formulario existente
 * @see app/Models/ApplicationForm.php
 */
export interface DuplicateApplicationFormData {
  id: number
  name: string
  status?: ApplicationFormStatus
  start_date: string
  end_date: string
  include_responses?: boolean
}

/**
 * Datos para enviar un formulario de aplicación
 * @see database/migrations/2025_06_22_100340_create_application_form_responses_table.php
 */
export interface SubmitApplicationFormData {
  form_id: number
  student_id: number
  responses: Array<{
    question_id: number
    answer: string | number | boolean | string[] | number[]
  }>
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
  responses_by_question: Array<{
    question_id: number
    question_text: string
    response_count: number
    average_score: number
  }>
  responses_by_date: Array<{
    date: string
    count: number
  }>
}

/**
 * Filtros para buscar formularios de aplicación
 * @see app/Models/ApplicationForm.php
 */
export interface ApplicationFormFilters {
  search?: string
  status?: ApplicationFormStatus | ''
  teacher_id?: number | ''
  learning_session_id?: number | ''
  date_from?: string
  date_to?: string
  with_trashed?: boolean
  only_trashed?: boolean
  sort_by?: 'name' | 'start_date' | 'end_date' | 'created_at' | 'updated_at'
  sort_order?: 'asc' | 'desc'
}
