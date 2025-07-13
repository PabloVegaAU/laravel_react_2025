import type { ApplicationFormResponseQuestionOption } from '../form/response/application-form-response-question-option'
import type { Question } from './question'

/**
 * Lados posibles para opciones de emparejamiento
 * @see database/migrations/2025_06_22_100110_create_question_options_table.php
 */
type PairSide = 'left' | 'right'

/**
 * Representa una opción para una pregunta en el sistema
 * @see database/migrations/2025_06_22_100110_create_question_options_table.php
 * @see app/Models/QuestionOption.php
 */
export interface QuestionOption {
  // Campos principales
  id: number
  question_id: number
  value: string
  is_correct: boolean
  order: number
  correct_order: number
  pair_key: string | null
  pair_side: PairSide | null
  score: number
  feedback: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null

  // Relaciones
  question: Question
  responseQuestionOptions: ApplicationFormResponseQuestionOption[]

  // Métodos de instancia
  isLeftSide(): boolean
  isRightSide(): boolean
}

/**
 * Datos para crear una nueva opción de pregunta
 * @see app/Models/QuestionOption.php
 */
export interface CreateQuestionOptionData {
  question_id: number
  value: string
  is_correct?: boolean
  order?: number
  correct_order?: number
  pair_key?: string | null
  pair_side?: PairSide | null
  score?: number
  feedback?: string | null
}

/**
 * Datos para actualizar una opción de pregunta existente
 * @see app/Models/QuestionOption.php
 */
export interface UpdateQuestionOptionData {
  id: number
  value?: string
  is_correct?: boolean
  order?: number
  correct_order?: number
  pair_key?: string | null
  pair_side?: PairSide | null
  score?: number
  feedback?: string | null
}

/**
 * Datos para operaciones masivas en opciones de pregunta
 * @see app/Models/QuestionOption.php
 */
export interface BulkQuestionOptionOperationData {
  create?: CreateQuestionOptionData[]
  update?: UpdateQuestionOptionData[]
  delete?: number[]
}

/**
 * Datos para reordenar opciones de pregunta
 * @see app/Models/QuestionOption.php
 */
export interface ReorderQuestionOptionsData {
  question_id: number
  option_ids: number[]
  correct_orders?: Record<number, number>
  pair_keys?: Record<number, string>
}

/**
 * Filtros para buscar opciones de pregunta
 * @see app/Models/QuestionOption.php
 */
export interface QuestionOptionFilters {
  question_id?: number
  is_correct?: boolean
  pair_side?: PairSide
  pair_key?: string
  with_trashed?: boolean
  only_trashed?: boolean
  sort_by?: 'order' | 'correct_order' | 'created_at' | 'updated_at'
  sort_order?: 'asc' | 'desc'
}

/**
 * Datos para importar opciones de pregunta desde CSV
 * @see app/Models/QuestionOption.php
 */
export interface ImportQuestionOptionsData {
  question_id: number
  options: Array<{
    value: string
    is_correct?: boolean
    order?: number
    correct_order?: number
    pair_key?: string
    pair_side?: PairSide
    score?: number
    feedback?: string
  }>
}

export type CreateQuestion = {
  name: string
  description: string
  difficulty: QuestionDifficulty
  question_type_id: string
  capability_id: string
  curricular_area_cycle_id: string
  competency_id: string
  options: CreateQuestionOption[]
  help_message: string
  explanation_required: boolean
  correct_feedback: string
  incorrect_feedback: string
  image: File | null
}

export type CreateQuestionOption = {
  value: string
  is_correct: boolean
  order: number
  correct_order: number
  pair_key: string | null
  pair_side: PairSide | null
  score: number
  feedback: string | null
}
