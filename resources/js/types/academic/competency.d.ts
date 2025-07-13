import { Capability } from './capability'
import { CurricularAreaCycle } from './curricular-area-cycle'
import { Question } from './question'

/**
 * Representa una competencia en el sistema educativo
 * Basado en:
 * - Migración: database/migrations/2025_06_22_100070_create_competencies_table.php
 * - Modelo: app/Models/Competency.php
 */
export interface Competency {
  /** Identificador único */
  id: number

  /** Nombre de la competencia */
  name: string

  /** Descripción detallada de la competencia */
  description: string

  /** ID del área curricular a la que pertenece esta competencia */
  curricular_area_cycle_id: number

  /** Orden de visualización */
  order: number

  /** Nivel de la competencia */
  level: number

  /** Color para representación en la interfaz de usuario */
  color: string

  /** Marcas de tiempo */
  created_at: string
  updated_at: string
  deleted_at: string | null

  // Relaciones
  /** Área curricular a la que pertenece esta competencia */
  curricular_area_cycle?: CurricularAreaCycle

  /** Capacidades asociadas a esta competencia */
  capabilities?: Capability[]

  /** Preguntas asociadas a esta competencia (a través de capacidades) */
  questions?: Question[]
}

/**
 * Tipo para crear una nueva competencia
 */
export type CreateCompetency = Omit<
  Competency,
  'id' | 'created_at' | 'updated_at' | 'deleted_at' | 'curricular_area_cycle' | 'capabilities' | 'questions'
>

/**
 * Tipo para actualizar una competencia existente
 */
export type UpdateCompetency = Partial<Omit<CreateCompetency, 'curricular_area_cycle_id'>>

/**
 * Tipo para filtros de búsqueda de competencias
 */
export interface CompetencyFilters {
  /** Término de búsqueda */
  search?: string

  /** Filtrar por ID de ciclo de área curricular */
  curricular_area_cycle_id?: number | number[]

  /** Incluir registros eliminados */
  with_trashed?: boolean

  /** Número de página para paginación */
  page?: number

  /** Cantidad de registros por página */
  per_page?: number

  /** Campo para ordenar */
  sort_by?: 'name' | 'order' | 'level' | 'created_at' | 'updated_at'

  /** Dirección del orden */
  sort_order?: 'asc' | 'desc'
}
