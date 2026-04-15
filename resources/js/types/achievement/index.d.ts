import type { BaseEntity } from '@/types/core'
import type { Student } from '../user/student'

/**
 * Representa un logro que los estudiantes pueden obtener
 * @see database/migrations/2025_06_22_100260_create_achievements_table.php
 * @see app/Models/Achievement.php
 */
export type Achievement = BaseEntity & {
  // Campos principales
  name: string
  description: string
  image: string
  activo: boolean

  // Relaciones
  studentAchievements?: StudentAchievement[]
  students?: Array<Student & { pivot: { achieved_at: string } }>
}

export type CreateAchievementData = {
  name: string
  description: string
  image: string | File
  activo: boolean
}

export type UpdateAchievementData = {
  name: string
  description: string
  image: string | File
  activo: boolean
  _method: 'PUT'
}
