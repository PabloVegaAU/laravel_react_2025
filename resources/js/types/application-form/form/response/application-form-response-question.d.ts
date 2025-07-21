import type { Question } from '../../question/question'
import type { QuestionOption } from '../../question/question-option'
import type { ApplicationFormQuestion } from '../application-form-question'
import type { ApplicationFormResponseQuestionOption } from './application-form-response-question-option'

/**
 * Estado de una pregunta de respuesta de formulario
 * @see database/migrations/2025_06_22_100300_create_application_form_response_questions_table.php
 * @see app/Models/ApplicationFormResponseQuestion.php
 */
export type ApplicationFormResponseQuestionStatus = 'pending' | 'graded' | 'submitted'

/**
 * Pregunta de respuesta en un formulario de aplicación
 * @see database/migrations/2025_06_22_100300_create_application_form_response_questions_table.php
 * @see app/Models/ApplicationFormResponseQuestion.php
 */
export interface ApplicationFormResponseQuestion {
  id: number
  application_form_response_id: number
  application_form_question_id: number
  explanation: string | null
  score: number
  points_store: number
  status: ApplicationFormResponseQuestionStatus
  is_correct: boolean
  created_at: string
  updated_at: string
  deleted_at: string | null

  // Relaciones
  application_form_question: ApplicationFormQuestion
  selected_options: ApplicationFormResponseQuestionOption[]
  question?: Question // Added for direct question access from response
  question_option?: QuestionOption // For direct question option relationship
}

/**
 * Datos para crear una pregunta de respuesta de formulario
 * @see database/migrations/2025_06_22_100300_create_application_form_response_questions_table.php
 * @see app/Http/Controllers/ApplicationFormResponseController.php
 */
export interface CreateApplicationFormResponseQuestionData {
  application_form_question_id: number
  explanation?: string | null
  score?: number
  status?: ApplicationFormResponseQuestionStatus
  selected_options?: Array<{
    question_option_id: number
    is_correct: boolean
    score?: number
  }>
}

/**
 * Datos para actualizar una pregunta de respuesta de formulario
 * @see database/migrations/2025_06_22_100300_create_application_form_response_questions_table.php
 * @see app/Http/Controllers/ApplicationFormResponseController.php
 */
export interface UpdateApplicationFormResponseQuestionData {
  id: number
  explanation?: string | null
  score?: number
  status?: ApplicationFormResponseQuestionStatus
  selected_options?: {
    create?: Array<{
      question_option_id: number
      is_correct: boolean
      score?: number
    }>
    update?: Array<{
      id: number
      is_correct?: boolean
      score?: number
    }>
    delete?: number[]
  }
}

/**
 * Datos para calificar una pregunta de respuesta
 * @see app/Http/Controllers/ApplicationFormResponseController.php
 */
export interface GradeApplicationFormResponseQuestionData {
  score: number
}

/**
 * Datos para responder una pregunta de opción múltiple
 * @see app/Http/Controllers/ApplicationFormResponseController.php
 */
export interface AnswerMultipleChoiceQuestionData {
  question_option_id: number
  explanation?: string | null
}

/**
 * Datos para responder una pregunta de verdadero/falso
 * @see app/Http/Controllers/ApplicationFormResponseController.php
 */
export interface AnswerTrueFalseQuestionData {
  question_option_id: number
  explanation?: string | null
}

/**
 * Datos para responder una pregunta de emparejamiento
 * @see app/Http/Controllers/ApplicationFormResponseController.php
 */
export interface AnswerMatchingQuestionData {
  pairs: Array<{
    left_option_id: number
    right_option_id: number
  }>
  explanation?: string | null
}

/**
 * Datos para responder una pregunta de ordenamiento
 * @see app/Http/Controllers/ApplicationFormResponseController.php
 */
export interface AnswerOrderingQuestionData {
  ordered_option_ids: number[]
  explanation?: string | null
}
