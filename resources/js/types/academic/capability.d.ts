import { LearningSession } from '../learning/learning-session'
import { Performance } from '../performance/performance'
import { Competency } from './competency'
import { Question } from './question'

/**
 * Representa una capacidad o habilidad específica en el sistema educativo
 * Basado en:
 * - Migración: database/migrations/2025_06_22_100080_create_capabilities_table.php
 * - Modelo: app/Models/Capability.php
 */
export interface Capability {
  /** Identificador único */
  id: number

  /** Nombre de la capacidad */
  name: string

  /** Descripción detallada de la capacidad */
  description: string

  /** ID de la competencia a la que pertenece esta capacidad */
  competency_id: number

  /** Orden de visualización */
  order: number

  /** Nivel de la capacidad */
  level: number

  /** Código de color para la interfaz de usuario */
  color: string

  /** Nivel de dominio esperado (0-100) */
  mastery_level: number

  /** Marcas de tiempo */
  created_at: string
  updated_at: string
  deleted_at: string | null

  // Relaciones
  /** Competencia a la que pertenece esta capacidad */
  competency?: Competency

  /** Preguntas asociadas a esta capacidad */
  questions?: Question[]

  /** Sesiones de aprendizaje que incluyen esta capacidad */
  learningSessions?: LearningSession[]

  /** Desempeños asociados a esta capacidad */
  performances?: Performance[]
}

/**
 * Tipo para crear una nueva capacidad
 */
export type CreateCapability = Omit<
  Capability,
  'id' | 'created_at' | 'updated_at' | 'deleted_at' | 'competency' | 'questions' | 'learningSessions' | 'performances'
>

/**
 * Tipo para actualizar una capacidad existente
 */
export type UpdateCapability = Partial<Omit<CreateCapability, 'competency_id'>>

/**
 * Tipo para filtros de búsqueda de capacidades
 */
export interface CapabilityFilters {
  /** Término de búsqueda */
  search?: string

  /** Filtrar por ID de competencia */
  competency_id?: number | number[]

  /** Incluir registros eliminados */
  with_trashed?: boolean

  /** Número de página para paginación */
  page?: number

  /** Cantidad de registros por página */
  per_page?: number

  /** Campo para ordenar */
  sort_by?: 'name' | 'order' | 'level' | 'mastery_level' | 'created_at' | 'updated_at'

  /** Dirección del orden */
  sort_order?: 'asc' | 'desc'
}
