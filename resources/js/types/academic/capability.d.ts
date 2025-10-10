import type { BaseEntity } from '@/types/core'
import type { LearningSession } from '../learning-session/learning-session'
import type { Competency } from './competency'
import type { Question } from './question'

/**
 * Representa una capacidad en el sistema educativo
 * @see database/migrations/2025_06_22_100080_create_capabilities_table.php
 * @see app/Models/Capability.php
 */
export type Capability = BaseEntity & {
  // Campos principales
  competency_id: number
  name: string
  color: string

  // Relaciones
  competency?: Competency
  questions?: Question[]
  learningSessions?: LearningSession[]
}
