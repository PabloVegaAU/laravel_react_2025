import type { Question } from './question'
import { QUESTION_TYPES } from './question-type'

/**
 * Tipo que representa el ID de un tipo de pregunta.
 */
export type QuestionTypeId = (typeof QUESTION_TYPES)[keyof typeof QUESTION_TYPES]

/**
 * Representa un tipo de pregunta en el sistema.
 * Define la estructura y comportamiento de los diferentes tipos de preguntas disponibles.
 *
 * @see database/migrations/2025_06_22_100090_create_question_types_table.php
 * @see app/Models/QuestionType.php
 *
 * @property {QuestionTypeId} id - Identificador único del tipo de pregunta
 * @property {string} name - Nombre del tipo de pregunta (ej: 'Respuesta única', 'Verdadero o falso')
 * @property {string} created_at - Fecha de creación en formato ISO 8601
 * @property {string} updated_at - Fecha de última actualización en formato ISO 8601
 * @property {Question[]} questions - Relación con las preguntas de este tipo
 */
export interface QuestionType {
  // Campos principales
  id: QuestionTypeId
  name: string
  created_at: string
  updated_at: string

  // Relaciones
  questions?: Question[]
}

/**
 * Función auxiliar para verificar si un valor es un ID de tipo de pregunta válido.
 * @param value Valor a verificar
 * @returns `true` si el valor es un ID de tipo de pregunta válido, `false` en caso contrario
 */
export function isQuestionTypeId(value: unknown): value is QuestionTypeId {
  return typeof value === 'number' && Object.values(QUESTION_TYPES).includes(value as QuestionTypeId)
}

/**
 * Obtiene el nombre para mostrar de un tipo de pregunta.
 * @param typeId ID del tipo de pregunta
 * @returns Nombre para mostrar del tipo de pregunta
 */
export function getQuestionTypeName(typeId: QuestionTypeId): string {
  switch (typeId) {
    case QUESTION_TYPES.SINGLE_CHOICE:
      return 'Respuesta única'
    case QUESTION_TYPES.ORDERING:
      return 'Ordenar'
    case QUESTION_TYPES.MATCHING:
      return 'Emparejar'
    case QUESTION_TYPES.TRUE_FALSE:
      return 'Verdadero o falso'
    default:
      return 'Tipo de pregunta desconocido'
  }
}

/**
 * Datos necesarios para crear un nuevo tipo de pregunta en el sistema.
 *
 * @see app/Models/QuestionType.php
 * @see app/Http/Controllers/QuestionTypeController.php
 *
 * @property {string} name - Nombre del tipo de pregunta (debe ser único)
 */
export interface CreateQuestionTypeData {
  name: string
}

/**
 * Datos para actualizar un tipo de pregunta existente.
 * Todos los campos son opcionales ya que solo se actualizarán los campos proporcionados.
 *
 * @see app/Models/QuestionType.php
 * @see app/Http/Controllers/QuestionTypeController.php
 */
export type UpdateQuestionTypeData = Partial<CreateQuestionTypeData>

/**
 * Filtros para buscar y filtrar tipos de pregunta.
 * Se utiliza en los endpoints de búsqueda y listado de tipos de pregunta.
 *
 * @see app/Models/QuestionType.php
 * @see app/Http/Controllers/QuestionTypeController.php
 *
 * @property {string} [search] - Término de búsqueda para filtrar por nombre
 * @property {boolean} [with_trashed] - Incluir tipos de pregunta eliminados lógicamente
 * @property {boolean} [only_trashed] - Mostrar solo tipos de pregunta eliminados lógicamente
 * @property {'name'|'created_at'|'updated_at'} [sort_by] - Campo por el que ordenar los resultados
 * @property {'asc'|'desc'} [sort_order] - Orden de clasificación (ascendente o descendente)
 */
export interface QuestionTypeFilters {
  search?: string
  with_trashed?: boolean
  only_trashed?: boolean
  sort_by?: 'name' | 'created_at' | 'updated_at'
  sort_order?: 'asc' | 'desc'
}
