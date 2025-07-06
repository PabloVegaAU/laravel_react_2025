import { Capability } from '../academic/capability'
import { Teacher } from '../user/teacher'
import { QuestionOption } from './question-option'
import { QuestionType } from './question-type'

/**
 * Niveles de dificultad para las preguntas
 */
export type QuestionDifficulty = 'easy' | 'medium' | 'hard'

/**
 * Representa una pregunta en el sistema
 * Basado en:
 * - Migración: database/migrations/2025_06_22_100100_create_questions_table.php
 * - Modelo: app/Models/Question.php
 */
export interface Question {
  /** Identificador único */
  id: number

  /** Nombre/identificador de la pregunta */
  name: string

  /** Texto/contenido de la pregunta */
  description: string

  /** URL de imagen opcional */
  image: string | null

  /** Texto de ayuda o pista */
  help_message: string | null

  /** Nivel de dificultad */
  difficulty: QuestionDifficulty

  /** Si se requiere explicación */
  explanation_required: boolean

  /** Retroalimentación para respuesta correcta */
  correct_feedback: string | null

  /** Retroalimentación para respuesta incorrecta */
  incorrect_feedback: string | null

  /** Claves foráneas */
  teacher_id: number
  question_type_id: number
  capability_id: number

  /** Relaciones */
  question_type: QuestionType
  capability?: Capability
  teacher?: Teacher
  options?: QuestionOption[]

  /** Timestamps */
  created_at: string
  updated_at: string
  deleted_at: string | null

  /** Application form questions that use this question */
  applicationFormQuestions?: Array<{
    id: number
    order: number
    points: number
    application_form_id: number
    question_id: number
    created_at: string
    updated_at: string
  }>
}

/**
 * Tipo para crear una nueva opción de pregunta
 */
export type CreateQuestionOption = Omit<QuestionOption, 'id' | 'question_id' | 'created_at' | 'updated_at' | 'deleted_at'>

/**
 * Tipo para crear una nueva pregunta
 * Incluye solo los campos necesarios para el formulario
 */
export interface CreateQuestion {
  [key: string]: any // Permite cualquier propiedad adicional
  // Campos básicos
  name: string
  description: string
  difficulty: QuestionDifficulty
  help_message: string
  explanation_required: boolean
  correct_feedback: string
  incorrect_feedback: string
  image: File | string | null

  // Relaciones (IDs como strings para formularios)
  question_type_id: string
  capability_id: string
  curricular_area_id: string
  competency_id: string

  // Opciones de la pregunta
  options: CreateQuestionOption[]
}

/**
 * Tipo para actualizar una pregunta existente
 */
export type UpdateQuestion = Partial<Omit<CreateQuestion, 'teacher_id' | 'question_type_id' | 'capability_id'>> & {
  /** Options to update/create/delete */
  options?: {
    create?: Array<Omit<QuestionOption, 'id' | 'question_id' | 'created_at' | 'updated_at' | 'deleted_at'>>
    update?: Array<{
      id: number
      value?: string
      is_correct?: boolean
      order?: number
      correct_order?: number
      pair_key?: string | null
      pair_side?: 'left' | 'right' | null
      score?: number
      feedback?: string | null
    }>
    delete?: number[]
  }
}

/**
 * Tipo para filtrar preguntas
 */
export interface QuestionFilters {
  /** Filter by search term (searches name and description) */
  search?: string

  /** Filter by difficulty */
  difficulty?: QuestionDifficulty | QuestionDifficulty[]

  /** Filter by question type */
  question_type_id?: number | number[]

  /** Filter by capability */
  capability_id?: number | number[]

  /** Filter by teacher */
  teacher_id?: number | number[]

  /** Filter by creation date */
  created_after?: string
  created_before?: string

  /** Whether to include soft-deleted questions */
  with_trashed?: boolean

  /** Pagination */
  page?: number
  per_page?: number

  /** Sorting */
  sort_by?: 'created_at' | 'updated_at' | 'difficulty' | 'name'
  sort_order?: 'asc' | 'desc'
}
