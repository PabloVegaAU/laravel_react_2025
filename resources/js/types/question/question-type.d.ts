/**
 * Representa un tipo de pregunta en el sistema
 * Basado en:
 * - Migración: database/migrations/2025_06_22_100090_create_question_types_table.php
 * - Modelo: app/Models/QuestionType.php
 */
export interface QuestionType {
  /** Identificador único */
  id: number

  /** Nombre del tipo de pregunta (ej. 'Opción Múltiple', 'Verdadero/Falso') */
  name: string

  /** Código de color para la representación en la interfaz de usuario */
  color: string

  /** Marcas de tiempo */
  created_at: string
  updated_at: string

  // Relaciones
  /** Preguntas que usan este tipo */
  questions?: Question[]

  /** Preguntas de formulario que usan este tipo */
  applicationFormQuestions?: ApplicationFormQuestion[]
}

/**
 * Tipo para crear un nuevo tipo de pregunta
 */
export type CreateQuestionType = Omit<QuestionType, 'id' | 'created_at' | 'updated_at' | 'questions' | 'applicationFormQuestions'>

/**
 * Tipo para actualizar un tipo de pregunta existente
 */
export type UpdateQuestionType = Partial<Omit<CreateQuestionType, 'name'>>
