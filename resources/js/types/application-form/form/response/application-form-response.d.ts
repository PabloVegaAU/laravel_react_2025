import type { Student } from '../../../user/student'
import type { User } from '../../../user/user'
import type { ApplicationForm } from '../../application-form'
import type { ApplicationFormResponseQuestion } from './application-form-response-question'

export type ApplicationFormResponseStatus = 'pending' | 'in progress' | 'submitted' | 'in review' | 'graded' | 'returned' | 'late'

/**
 * Representa la respuesta de un estudiante a un formulario de aplicación
 * @see database/migrations/2025_06_22_100340_create_application_form_responses_table.php
 * @see app/Models/ApplicationFormResponse.php
 */
export interface ApplicationFormResponse {
  // Campos principales
  id: number
  application_form_id: number
  student_id: number
  score: number
  status: ApplicationFormResponseStatus
  started_at: string | null
  submitted_at: string | null
  graded_at: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null

  // Relaciones
  applicationForm: ApplicationForm
  student: Student & { user?: User }
  responseQuestions: ApplicationFormResponseQuestion[]

  // Métodos de instancia
  markAsStarted(): Promise<boolean>
  markAsSubmitted(): Promise<boolean>
  markAsGraded(score: number): Promise<boolean>
  isGraded(): boolean
  isSubmitted(): boolean
  isLate(): boolean
  timeSpent(): number | null
}

/**
 * Datos para crear una nueva respuesta a un formulario
 * @see app/Models/ApplicationFormResponse.php
 */
export interface CreateApplicationFormResponseData {
  application_form_id: number
  student_id: number
  started_at?: string
}

/**
 * Datos para enviar una respuesta a un formulario
 * @see app/Models/ApplicationFormResponse.php
 */
export interface SubmitApplicationFormResponseData {
  id: number
  answers: Array<{
    question_id: number
    answer: string | number | boolean | string[] | number[]
  }>
  note?: string
}

/**
 * Datos para calificar una respuesta
 * @see app/Models/ApplicationFormResponse.php
 */
export interface GradeApplicationFormResponseData {
  id: number
  scores: Array<{
    question_id: number
    score: number
    feedback?: string
  }>
  overall_feedback?: string
  notify_student?: boolean
}

/**
 * Filtros para buscar respuestas a formularios
 * @see app/Models/ApplicationFormResponse.php
 */
export interface ApplicationFormResponseFilters {
  application_form_id?: number
  student_id?: number
  status?: ApplicationFormResponseStatus
  min_score?: number
  max_score?: number
  submitted_after?: string
  submitted_before?: string
  graded_after?: string
  graded_before?: string
  with_trashed?: boolean
  only_trashed?: boolean
  search?: string
  sort_by?: 'score' | 'submitted_at' | 'graded_at' | 'created_at'
  sort_order?: 'asc' | 'desc'
}

/**
 * Estadísticas de respuestas a un formulario
 * @see app/Models/ApplicationFormResponse.php
 */
export interface ApplicationFormResponseStats {
  total: number
  pending: number
  in_progress: number
  submitted: number
  in_review: number
  graded: number
  returned: number
  late: number
  average_score: number
  highest_score: number
  lowest_score: number
  completion_rate: number
  average_time_spent: number | null
}
