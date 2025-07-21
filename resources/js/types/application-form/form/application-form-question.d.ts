import type { ApplicationForm } from '../application-form'
import { Question } from '../question'
import type { ApplicationFormResponseQuestion } from './response/application-form-response-question'

/**
 * Pregunta en un formulario de aplicación
 * @see database/migrations/2025_06_22_100350_create_application_form_questions_table.php
 * @see app/Models/ApplicationFormQuestion.php
 */
export interface ApplicationFormQuestion {
  id: number
  application_form_id: number
  question_id: number
  order: number
  score: number
  points_store: number
  created_at: string
  updated_at: string
  // Relaciones
  application_form: ApplicationForm
  question: Question
  response_questions: ApplicationFormResponseQuestion[]
}

/**
 * Datos para crear una pregunta de formulario
 * @see database/migrations/2025_06_22_100350_create_application_form_questions_table.php
 * @see app/Http/Controllers/ApplicationFormController.php
 */
export interface CreateApplicationFormQuestionData {
  application_form_id: number
  question_id: number
  order?: number
  score?: number
  points_store?: number
}

/**
 * Datos para actualizar una pregunta de formulario
 * @see database/migrations/2025_06_22_100350_create_application_form_questions_table.php
 * @see app/Http/Controllers/ApplicationFormController.php
 */
export interface UpdateApplicationFormQuestionData {
  id: number
  order?: number
  score?: number
  points_store?: number
}

/**
 * Datos para actualizar el orden de las preguntas
 * @see app/Http/Controllers/ApplicationFormController.php
 */
export interface ReorderApplicationFormQuestionsData {
  order: Array<{
    id: number
    order: number
  }>
}

/**
 * Filtros para buscar preguntas de formulario
 * @see app/Models/ApplicationFormQuestion.php
 */
export interface ApplicationFormQuestionFilters {
  application_form_id?: number
  question_id?: number
  min_score?: number
  max_score?: number
  with_trashed?: boolean
  only_trashed?: boolean
  include?: Array<'question' | 'application_form' | 'response_questions'>
  sort_by?: 'order' | 'score' | 'created_at' | 'updated_at'
  sort_order?: 'asc' | 'desc'
}

/**
 * Datos para agregar preguntas a un formulario
 * @see app/Http/Controllers/ApplicationFormController.php
 */
export interface AddQuestionsToFormData {
  question_ids: number[]
  scores?: Record<number, number>
  points_store?: Record<number, number>
}
