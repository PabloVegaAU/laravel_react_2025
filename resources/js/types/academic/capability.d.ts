import type { LearningSession } from '../learning-session/learning-session'
import type { Competency } from './competency'
import type { Question } from './question'

/**
 * Representa una capacidad en el sistema educativo
 * @see database/migrations/2025_06_22_100080_create_capabilities_table.php
 * @see app/Models/Capability.php
 */
export type Capability = {
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
