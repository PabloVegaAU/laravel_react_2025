import type { ApplicationForm } from '../application-form'
import type { Question } from '../question/question'
import type { ApplicationFormResponseQuestion } from './response/application-form-response-question'

/**
 * Representa la relación entre un formulario de aplicación y sus preguntas
 * @see database/migrations/2025_06_22_100350_create_application_form_questions_table.php
 * @see app/Models/ApplicationFormQuestion.php
 */
export interface ApplicationFormQuestion {
  // Campos principales
  id: number
  application_form_id: number
  question_id: number
  order: number
  score: number
  points_store: number
  created_at: string
  updated_at: string

  // Relaciones
  applicationForm?: ApplicationForm
  question?: Question
  responseQuestions?: ApplicationFormResponseQuestion[]

  // Métodos de instancia
  isCorrectAnswer(selectedOptions: number[]): boolean
}

/**
 * Datos para crear una relación entre formulario y pregunta
 * @see database/migrations/2025_06_22_100350_create_application_form_questions_table.php
 */
export interface CreateApplicationFormQuestionData {
  application_form_id: number
  question_id: number
  order?: number
  score?: number
  points_store?: number
}

/**
 * Datos para actualizar una relación entre formulario y pregunta
 * @see database/migrations/2025_06_22_100350_create_application_form_questions_table.php
 */
export type UpdateApplicationFormQuestionData = Partial<Omit<CreateApplicationFormQuestionData, 'application_form_id' | 'question_id'>>

/**
 * Datos para reordenar preguntas en un formulario
 * @see app/Models/ApplicationFormQuestion.php
 */
export interface ReorderApplicationFormQuestionsData {
  question_ids: number[]
  scores?: Record<number, number>
  points_store?: Record<number, number>
}

/**
 * Datos para actualización masiva de preguntas de un formulario
 * @see app/Models/ApplicationFormQuestion.php
 */
export interface BulkUpdateApplicationFormQuestionsData {
  updates: Array<{
    id: number
    order?: number
    score?: number
    points_store?: number
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
}
