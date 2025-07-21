import type { QuestionOption } from '../../question/question-option'

/**
 * Opción seleccionada en una respuesta de formulario
 * @see database/migrations/2025_06_22_100370_create_application_form_response_question_options_table.php
 * @see app/Models/ApplicationFormResponseQuestionOption.php
 */
export interface ApplicationFormResponseQuestionOption {
  id: number
  application_form_response_question_id: number
  question_option_id: number
  question_option: QuestionOption
  paired_with_option_id: number | null
  selected_order: number | null
  score: number
  is_correct: boolean
  created_at: string
  updated_at: string
  deleted_at?: string | null
}

/**
 * Datos para crear una opción de respuesta de formulario
 * @see database/migrations/2025_06_22_100370_create_application_form_response_question_options_table.php
 * @see app/Http/Controllers/ApplicationFormResponseController.php
 */
export interface CreateApplicationFormResponseQuestionOptionData {
  question_option_id: number
  is_correct?: boolean
  score?: number
  selected_order?: number | null
  paired_with_option_id?: number | null
}

/**
 * Datos para actualizar una opción de respuesta de formulario
 * @see database/migrations/2025_06_22_100370_create_application_form_response_question_options_table.php
 * @see app/Http/Controllers/ApplicationFormResponseController.php
 */
export interface UpdateApplicationFormResponseQuestionOptionData {
  id: number
  is_correct?: boolean
  score?: number
  selected_order?: number | null
  paired_with_option_id?: number | null
}
