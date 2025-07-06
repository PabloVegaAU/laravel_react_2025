import { Question } from './question'

type PairSide = 'left' | 'right'

/**
 * Representa una opción para una pregunta
 * Basado en:
 * - Migración: database/migrations/2025_06_22_100110_create_question_options_table.php
 * - Modelo: app/Models/QuestionOption.php
 */
export interface QuestionOption {
  /** Identificador único */
  id: number

  /** ID de la pregunta a la que pertenece esta opción */
  question_id: number

  /** El texto/valor de la opción */
  value: string

  /** Si esta opción es la respuesta correcta */
  is_correct: boolean

  /** Orden de visualización de la opción */
  order: number

  /** Para preguntas de ordenamiento, la posición correcta de esta opción */
  correct_order: number

  /** Para preguntas de emparejamiento, la clave para relacionar opciones */
  pair_key: string | null

  /** Para preguntas de emparejamiento, en qué lado está esta opción */
  pair_side: PairSide | null

  /** Puntos otorgados por seleccionar esta opción */
  score: number

  /** Retroalimentación específica para esta opción */
  feedback: string | null

  /** Marcas de tiempo */
  created_at: string
  updated_at: string
  deleted_at: string | null

  // Relaciones
  /** La pregunta a la que pertenece esta opción */
  question?: Question
}

/**
 * Tipo para crear una nueva opción de pregunta
 */
export type CreateQuestionOption = Omit<QuestionOption, 'id' | 'created_at' | 'updated_at' | 'deleted_at' | 'question'>

/**
 * Tipo para actualizar una opción de pregunta existente
 */
export type UpdateQuestionOption = Partial<Omit<CreateQuestionOption, 'question_id'>>

/**
 * Tipo para operaciones masivas en opciones de pregunta
 */
export interface BulkQuestionOptionOperation {
  /** Options to create */
  create?: CreateQuestionOption[]

  /** Options to update */
  update?: Array<{ id: number } & UpdateQuestionOption>

  /** Option IDs to delete */
  delete?: number[]
}

/**
 * Tipo para reordenar opciones de pregunta
 */
export interface ReorderQuestionOptions {
  /** Array of option IDs in their new order */
  option_ids: number[]

  /** Optional: new correct orders for options */
  correct_orders?: Record<number, number>

  /** Optional: new pair keys for matching questions */
  pair_keys?: Record<number, string>
}
