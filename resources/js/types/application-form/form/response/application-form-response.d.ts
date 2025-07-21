import type { Student } from '../../../user/student'
import type { ApplicationForm } from '../../application-form'
import type { ApplicationFormResponseQuestion } from './application-form-response-question'

/**
 * Estado de una respuesta de formulario
 * @see database/migrations/2025_06_22_100340_create_application_form_responses_table.php
 * @see app/Models/ApplicationFormResponse.php
 */
export type ApplicationFormResponseStatus =
  | 'pending' // Por comenzar
  | 'in progress' // En progreso
  | 'submitted' // Enviado para revisión
  | 'in review' // En revisión por el profesor
  | 'graded' // Calificado
  | 'returned' // Devuelto con comentarios
  | 'late' // Entregado tarde

/**
 * Respuesta de un estudiante a un formulario de aplicación
 * @see database/migrations/2025_06_22_100340_create_application_form_responses_table.php
 * @see app/Models/ApplicationFormResponse.php
 */
export interface ApplicationFormResponse {
  id: number
  application_form_id: number
  student_id: number
  status: ApplicationFormResponseStatus
  score: number
  started_at: string | null
  submitted_at: string | null
  graded_at: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null

  // Relaciones
  student: Student
  application_form: ApplicationForm
  response_questions: ApplicationFormResponseQuestion[]
}

/**
 * Datos para crear una respuesta de formulario
 * @see database/migrations/2025_06_22_100340_create_application_form_responses_table.php
 * @see app/Http/Controllers/ApplicationFormResponseController.php
 */
export interface CreateApplicationFormResponseData {
  application_form_id: number
  student_id: number
  status?: ApplicationFormResponseStatus
  score?: number
  started_at?: string | null
  submitted_at?: string | null
  graded_at?: string | null
}

/**
 * Datos para actualizar una respuesta de formulario
 * @see database/migrations/2025_06_22_100340_create_application_form_responses_table.php
 * @see app/Http/Controllers/ApplicationFormResponseController.php
 */
export interface UpdateApplicationFormResponseData {
  id: number
  status?: ApplicationFormResponseStatus
  score?: number
  started_at?: string | null
  submitted_at?: string | null
  graded_at?: string | null
}

/**
 * Datos para calificar una respuesta de formulario
 * @see app/Http/Controllers/ApplicationFormResponseController.php
 */
export interface GradeApplicationFormResponseData {
  score: number
}

/**
 * Filtros para buscar respuestas de formulario
 * @see app/Models/ApplicationFormResponse.php
 */
export interface ApplicationFormResponseFilters {
  student_id?: number
  application_form_id?: number
  status?: ApplicationFormResponseStatus | ApplicationFormResponseStatus[]
  min_score?: number
  max_score?: number
  submitted_after?: string
  submitted_before?: string
  graded_after?: string
  graded_before?: string
  with_trashed?: boolean
  only_trashed?: boolean
  sort_by?: 'score' | 'started_at' | 'submitted_at' | 'graded_at' | 'created_at' | 'updated_at'
  sort_order?: 'asc' | 'desc'
  include?: Array<'student' | 'application_form' | 'response_questions'>
}
