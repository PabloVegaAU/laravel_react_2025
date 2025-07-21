import type { Capability } from '../../academic/capability'
import type { Teacher } from '../../user/teacher'
import type { ApplicationFormQuestion } from '../form/application-form-question'
import type { QuestionOption } from './question-option'
import type { QuestionType } from './question-type'

/**
 * Niveles de dificultad de las preguntas
 * @see database/migrations/2025_06_22_100100_create_questions_table.php
 * @see app/Models/Question.php
 */
export type QuestionDifficulty = 'easy' | 'medium' | 'hard'

/**
 * Niveles educativos para las preguntas
 * @see database/migrations/2025_06_22_100100_create_questions_table.php
 * @see app/Models/Question.php
 */
export type QuestionLevel = 'primary' | 'secondary'

/**
 * Representa una pregunta en el sistema
 * @see database/migrations/2025_06_22_100100_create_questions_table.php
 * @see app/Models/Question.php
 */
export interface Question {
  id: number
  name: string
  description: string
  image: string | null
  help_message: string | null
  difficulty: QuestionDifficulty
  explanation_required: boolean
  level: QuestionLevel
  grades: string[]
  created_at: string
  updated_at: string
  deleted_at: string | null
  teacher_id: number
  question_type_id: number
  capability_id: number
  question_type: QuestionType
  capability: Capability
  teacher: Teacher
  options: QuestionOption[]
  applicationFormQuestions: ApplicationFormQuestion[]
}

/**
 * Datos para crear una nueva pregunta
 * @see database/migrations/2025_06_22_100100_create_questions_table.php
 * @see app/Models/Question.php
 */
export interface CreateQuestionData {
  name: string
  description: string
  image?: string | null
  help_message?: string | null
  difficulty: QuestionDifficulty
  explanation_required?: boolean
  level?: QuestionLevel
  grades?: string[]
  teacher_id: number
  question_type_id: number
  capability_id: number
  options?: Array<{
    value: string
    is_correct: boolean
    order?: number
  }>
}

/**
 * Datos para actualizar una pregunta existente
 * @see database/migrations/2025_06_22_100100_create_questions_table.php
 * @see app/Models/Question.php
 */
export interface UpdateQuestionData {
  id: number
  name?: string
  description?: string
  image?: string | null
  help_message?: string | null
  difficulty?: QuestionDifficulty
  explanation_required?: boolean
  level?: QuestionLevel
  grades?: string[]
  question_type_id?: number
  capability_id?: number
  options?: {
    create?: Array<{
      value: string
      is_correct: boolean
      order?: number
      correct_order?: number
      pair_key?: string | null
      pair_side?: 'left' | 'right' | null
      score?: number
    }>
    update?: Array<{
      id: number
      value?: string
      is_correct?: boolean
      order?: number
      correct_order?: number
      pair_key?: string | null
      pair_side?: 'left' | 'right' | null
      score?: number
    }>
    delete?: number[]
  }
}

/**
 * Filtros para búsqueda de preguntas
 * @see database/migrations/2025_06_22_100100_create_questions_table.php
 * @see app/Models/Question.php
 */
export interface QuestionFilters {
  search?: string
  difficulty?: QuestionDifficulty | QuestionDifficulty[]
  question_type_id?: number | number[]
  capability_id?: number | number[]
  teacher_id?: number | number[]
  level?: QuestionLevel
  grade?: string
  has_correct_options?: boolean
  with_trashed?: boolean
  only_trashed?: boolean
  page?: number
  per_page?: number
  sort_by?: 'created_at' | 'updated_at' | 'name' | 'difficulty' | 'level'
  sort_order?: 'asc' | 'desc'
}

/**
 * Pregunta con puntuación para formularios de aplicación
 * @see database/migrations/2025_06_22_100100_create_questions_table.php
 * @see database/migrations/2025_06_22_100200_create_application_form_questions_table.php
 * @see app/Models/Question.php
 * @see app/Models/ApplicationFormQuestion.php
 * @see app/Http/Controllers/ApplicationFormController.php
 */
export interface QuestionWithScore {
  id: number
  name: string
  description: string
  question_type_id: number
  capability_id: number
  difficulty: QuestionDifficulty
  level: QuestionLevel
  score: number
  points_store: number
  order: number
  options: Array<{
    id: number
    value: string
    is_correct: boolean
  }>
  [key: string]: any // Para compatibilidad con FormDataConvertible
}

/**
 * Datos para importar preguntas desde un archivo
 * @see database/migrations/2025_06_22_100100_create_questions_table.php
 * @see app/Models/Question.php
 */
export interface ImportQuestionsData {
  questions: Array<{
    name: string
    description: string
    difficulty: QuestionDifficulty
    level: QuestionLevel
    grades: string[]
    question_type_name: string
    capability_name: string
    options: Array<{
      value: string
      is_correct: boolean
      order?: number
    }>
  }>
  teacher_id: number
}
