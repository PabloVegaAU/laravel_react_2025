import type { Question } from './question'

/**
 * Representa un tipo de pregunta en el sistema
 * @see database/migrations/2025_06_22_100090_create_question_types_table.php
 * @see app/Models/QuestionType.php
 */
export interface QuestionType {
  // Campos principales
  id: number
  name: string
  created_at: string
  updated_at: string

  // Relaciones
  questions: Question[]
}

/**
 * Datos para crear un nuevo tipo de pregunta
 * @see app/Models/QuestionType.php
 */
export interface CreateQuestionTypeData {
  name: string
}

/**
 * Datos para actualizar un tipo de pregunta existente
 * @see app/Models/QuestionType.php
 */
export type UpdateQuestionTypeData = Partial<CreateQuestionTypeData>

/**
 * Filtros para buscar tipos de pregunta
 * @see app/Models/QuestionType.php
 */
export interface QuestionTypeFilters {
  search?: string
  with_trashed?: boolean
  only_trashed?: boolean
  sort_by?: 'name' | 'created_at' | 'updated_at'
  sort_order?: 'asc' | 'desc'
}
