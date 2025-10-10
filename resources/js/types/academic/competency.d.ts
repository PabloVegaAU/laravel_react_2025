import { BaseEntity } from '../core'
import type { LearningSession } from '../learning-session'
import type { Capability } from './capability'
import type { CurricularAreaCycle } from './curricular-area-cycle'
import type { Question } from './question'

/**
 * Representa una competencia en el sistema educativo
 * @see database/migrations/2025_06_22_100070_create_competencies_table.php
 * @see app/Models/Competency.php
 */
export type Competency = BaseEntity & {
  name: string
  curricular_area_cycle_id: number
  color: string

  // Relaciones
  curricular_area_cycle?: CurricularAreaCycle
  capabilities?: Capability[]
  questions?: Question[]
  learningSessions?: LearningSession[]
}

/**
 * Tipo para crear una nueva competencia
 */
export type CreateCompetency = Omit<
  Competency,
  'id' | 'created_at' | 'updated_at' | 'curricular_area_cycle' | 'capabilities' | 'questions' | 'learningSessions'
>

/**
 * Tipo para actualizar una competencia existente
 */
export type UpdateCompetency = Partial<Omit<CreateCompetency, 'curricular_area_cycle_id'>>

/**
 * Tipo para filtros de búsqueda de competencias
 */
export interface CompetencyFilters {
  search?: string
  curricular_area_cycle_id?: number | number[]
  with_trashed?: boolean
  page?: number
  per_page?: number
  sort_by?: 'name' | 'created_at' | 'updated_at'
  sort_order?: 'asc' | 'desc'
}
