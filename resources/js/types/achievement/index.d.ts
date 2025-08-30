import type { Student } from '../user/student'

/**
 * Representa un logro que los estudiantes pueden obtener
 * @see database/migrations/2025_06_22_100260_create_achievements_table.php
 * @see app/Models/Achievement.php
 */
export interface Achievement {
  // Campos principales
  id: number
  name: string
  description: string
  image: string
  activo: boolean
  created_at: string
  updated_at: string
  deleted_at: string | null

  // Relaciones
  studentAchievements?: StudentAchievement[]
  students?: Array<Student & { pivot: { achieved_at: string } }>

  // Métodos de ámbito
  scopeWithName(query: any, name: string): any
  scopeSearch(query: any, search: string): any
}

/**
 * Relación entre estudiante y logro
 * @see database/migrations/2025_06_22_100261_create_student_achievements_table.php
 * @see app/Models/StudentAchievement.php
 */
export interface StudentAchievement {
  // Campos principales
  id: number
  achieved_at: string
  student_id: number
  achievement_id: number

  // Relaciones
  student?: Student
  achievement?: Achievement

  // Métodos de ámbito
  scopeAchievedBetween(query: any, from: string, to: string): any
  scopeByStudent(query: any, studentId: number): any
}

/**
 * Tipo para crear un nuevo logro
 * @see database/migrations/2025_06_22_100260_create_achievements_table.php
 */
export interface CreateAchievementData {
  name: string
  description: string
  image: File | null | string
  activo: boolean
  [key: string]: string | boolean | File | null | undefined
}

/**
 * Tipo para actualizar un logro existente
 * @see database/migrations/2025_06_22_100260_create_achievements_table.php
 */
export type UpdateAchievementData = Partial<CreateAchievementData> & {
  _method?: string
}

/**
 * Filtros para búsqueda de logros
 * @see app/Models/Achievement.php
 */
export interface AchievementFilters {
  search?: string
  student_id?: number
  date_from?: string
  date_to?: string
  page?: number
  per_page?: number
  trashed?: 'with' | 'only'
}

/**
 * Datos para otorgar un logro a un estudiante
 * @see app/Models/StudentAchievement.php
 */
export interface AwardAchievementData {
  achievement_id: number
  achieved_at?: string
}

/**
 * Respuesta al otorgar un logro
 */
export interface AchievementAwardedResponse {
  success: boolean
  message: string
  achievement?: Achievement
  student_achievement?: StudentAchievement
}
