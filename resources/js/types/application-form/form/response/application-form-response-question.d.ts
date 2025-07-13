import type { QuestionOption } from '../../question/question-option'
import type { ApplicationFormQuestion } from '../application-form-question'
import type { ApplicationFormResponse } from './application-form-response'
import type { ApplicationFormResponseQuestionOption } from './application-form-response-question-option'

/**
 * Representa la respuesta de un estudiante a una pregunta específica en un formulario
 * @see database/migrations/2025_06_22_100360_create_application_form_response_question_table.php
 * @see app/Models/ApplicationFormResponseQuestion.php
 */
export interface ApplicationFormResponseQuestion {
  // Campos principales
  id: number
  application_form_response_id: number
  application_form_question_id: number
  question_option_id: number | null
  explanation: string | null
  score: number
  points_store: number
  created_at: string
  updated_at: string
  deleted_at: string | null

  // Atributos computados
  is_correct: boolean

  // Relaciones
  applicationFormResponse: ApplicationFormResponse
  applicationFormQuestion: ApplicationFormQuestion
  questionOption: QuestionOption | null
  selectedOptions: ApplicationFormResponseQuestionOption[]

  // Métodos de instancia
  updateScore(): Promise<void>
  getIsCorrectAttribute(): boolean
}

/**
 * Datos para crear una nueva respuesta a una pregunta
 * @see app/Models/ApplicationFormResponseQuestion.php
 */
export interface CreateApplicationFormResponseQuestionData {
  application_form_response_id: number
  application_form_question_id: number
  question_option_id?: number | null
  explanation?: string | null
  score?: number
  points_store?: number
  selected_option_ids?: number[]
}

/**
 * Datos para actualizar una respuesta a una pregunta
 * @see app/Models/ApplicationFormResponseQuestion.php
 */
export interface UpdateApplicationFormResponseQuestionData {
  id: number
  question_option_id?: number | null
  explanation?: string | null
  score?: number
  points_store?: number
  selected_option_ids?: number[]
}

/**
 * Datos para enviar la respuesta a una pregunta
 * @see app/Models/ApplicationFormResponseQuestion.php
 */
export interface SubmitApplicationFormResponseQuestionData {
  question_id: number
  option_id?: number | null
  option_ids?: number[]
  explanation?: string | null
}

/**
 * Filtros para buscar respuestas a preguntas
 * @see app/Models/ApplicationFormResponseQuestion.php
 */
export interface ApplicationFormResponseQuestionFilters {
  application_form_response_id?: number
  application_form_question_id?: number
  question_option_id?: number
  min_score?: number
  max_score?: number
  with_trashed?: boolean
  only_trashed?: boolean
  sort_by?: 'score' | 'created_at' | 'updated_at'
  sort_order?: 'asc' | 'desc'
}
