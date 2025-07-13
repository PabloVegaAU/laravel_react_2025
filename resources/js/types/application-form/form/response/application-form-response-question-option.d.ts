import type { QuestionOption } from '../../question/question-option'
import type { ApplicationFormResponseQuestion } from './application-form-response-question'

/**
 * Representa una opción seleccionada en la respuesta de un estudiante a una pregunta
 * @see database/migrations/2025_06_22_100370_create_application_form_response_question_options_table.php
 * @see app/Models/ApplicationFormResponseQuestionOption.php
 */
export interface ApplicationFormResponseQuestionOption {
  // Campos principales
  id: number
  application_form_response_question_id: number
  question_option_id: number
  score: number
  is_correct: boolean
  created_at: string
  updated_at: string
  deleted_at: string | null

  // Relaciones
  applicationFormResponseQuestion: ApplicationFormResponseQuestion
  questionOption: QuestionOption

  // Métodos de instancia
  syncWithQuestionOption(): Promise<void>
}

/**
 * Datos para crear una nueva opción de respuesta a una pregunta
 * @see app/Models/ApplicationFormResponseQuestionOption.php
 */
export interface CreateApplicationFormResponseQuestionOptionData {
  application_form_response_question_id: number
  question_option_id: number
  score?: number
  is_correct?: boolean
}

/**
 * Datos para actualizar una opción de respuesta a una pregunta
 * @see app/Models/ApplicationFormResponseQuestionOption.php
 */
export interface UpdateApplicationFormResponseQuestionOptionData {
  id: number
  score?: number
  is_correct?: boolean
}

/**
 * Datos para actualización masiva de opciones de respuesta
 * @see app/Models/ApplicationFormResponseQuestionOption.php
 */
export interface BulkUpdateApplicationFormResponseQuestionOptionData {
  id: number
  question_option_id: number
  score?: number
  is_correct?: boolean
}

/**
 * Filtros para buscar opciones de respuesta
 * @see app/Models/ApplicationFormResponseQuestionOption.php
 */
export interface ApplicationFormResponseQuestionOptionFilters {
  application_form_response_question_id?: number
  question_option_id?: number
  is_correct?: boolean
  with_trashed?: boolean
  only_trashed?: boolean
  sort_by?: 'score' | 'created_at' | 'updated_at'
  sort_order?: 'asc' | 'desc'
}
