import { Student } from '../types'

/**
 * Historial de niveles del estudiante
 */
export interface StudentLevelHistory {
  id: number
  student_id: number
  level_id: number
  range_id: number
  experience: number
  reached_at: string
  created_at: string
  updated_at: string
  level: {
    id: number
    name: string
    description: string | null
    min_experience: number
    max_experience: number
    created_at: string
    updated_at: string
  }
  range: {
    id: number
    name: string
    description: string | null
    min_points: number
    max_points: number
    badge_image: string | null
    created_at: string
    updated_at: string
  }
}

/**
 * Datos de progreso de nivel del estudiante
 */
export interface StudentLevelProgress {
  current_level: {
    id: number
    name: string
    current_experience: number
    experience_to_next_level: number
    progress_percentage: number
  }
  current_range: {
    id: number
    name: string
    current_points: number
    points_to_next_range: number
    progress_percentage: number
  }
  total_experience: number
  total_points: number
  level_history: StudentLevelHistory[]
}

/**
 * Datos para actualizar la experiencia del estudiante
 */
export interface UpdateStudentExperienceData {
  experience_earned: number
  points_earned: number
  source_type: string
  source_id?: number
  description?: string
}

/**
 * Respuesta al actualizar la experiencia
 */
export interface ExperienceUpdatedResponse {
  message: string
  level_up: boolean
  range_up: boolean
  updated_student: Student
  previous_level?: {
    id: number
    name: string
  }
  new_level?: {
    id: number
    name: string
  }
  previous_range?: {
    id: number
    name: string
  }
  new_range?: {
    id: number
    name: string
  }
  experience_gained: number
  points_gained: number
}

/**
 * Filtros para el historial de niveles
 */
export interface LevelHistoryFilters {
  student_id?: number
  level_id?: number
  range_id?: number
  date_from?: string
  date_to?: string
  sort_by?: 'reached_at' | 'level_id' | 'range_id'
  sort_order?: 'asc' | 'desc'
  per_page?: number
  page?: number
}
