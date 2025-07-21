import type { LearningSession } from '../learning-session/learning-session'
import type { Competency } from './competency'
import type { Question } from './question'

/**
 * Representa una capacidad en el sistema educativo
 * @see database/migrations/2025_06_22_100080_create_capabilities_table.php
 * @see app/Models/Capability.php
 */
export interface Capability {
  // Campos principales
  id: number
  competency_id: number
  name: string
  color: string
  created_at: string
  updated_at: string

  // Relaciones
  competency?: Competency
  questions?: Question[]
  learningSessions?: LearningSession[]
}

/**
 * Datos para crear una capacidad
 * @see database/migrations/2025_06_22_100080_create_capabilities_table.php
 */
export interface CreateCapabilityData {
  competency_id: number
  name: string
  color: string
}

/**
 * Datos para actualizar una capacidad
 * @see database/migrations/2025_06_22_100080_create_capabilities_table.php
 */
export type UpdateCapabilityData = Partial<CreateCapabilityData>

/**
 * Filtros para buscar capacidades
 * @see app/Models/Capability.php
 */
export interface CapabilityFilters {
  search?: string
  competency_id?: number | number[]
  with_trashed?: boolean
  only_trashed?: boolean
  page?: number
  per_page?: number
  sort_by?: 'name' | 'created_at' | 'updated_at'
  sort_order?: 'asc' | 'desc'
}

/**
 * Datos para asignar una capacidad a una sesión de aprendizaje
 * @see database/migrations/2025_06_22_100080_create_learning_session_capabilities_table.php
 */
export interface AssignCapabilityToSessionData {
  capability_id: number
  learning_session_id: number
  status?: 'pending' | 'in_progress' | 'completed'
  score?: number
}
