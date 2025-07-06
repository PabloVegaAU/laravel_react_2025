import { Profile, User } from './user'

/**
 * Representa un estudiante en el sistema
 * Extiende los tipos User y Profile con información específica de estudiante
 */
export type Student = User &
  Profile & {
    // Relaciones con Level y Range
    level?: Level
    range?: Range
    experience_points?: number
  }

/**
 * Representa un nivel de estudiante en el sistema
 */
export type Level = {
  /** Identificador único del nivel */
  id: number

  /** Número del nivel */
  level: number

  /** Experiencia requerida para alcanzar este nivel */
  experience_required: number

  /** Descripción opcional del nivel */
  description?: string | null

  // Marcas de tiempo
  created_at: string
  updated_at: string
  deleted_at?: string | null
}

/**
 * Representa un rango de estudiante en el sistema
 */
export type Range = {
  /** Identificador único del rango */
  id: number

  /** Nombre del rango */
  name: string

  /** Nivel requerido para alcanzar este rango */
  level_required: number

  /** Código de color del rango */
  color: string

  /** Imagen opcional del rango */
  image?: string | null

  /** Descripción opcional del rango */
  description?: string | null

  /** Orden de visualización del rango */
  order: number

  // Marcas de tiempo
  created_at: string
  updated_at: string
  deleted_at?: string | null

  // Relaciones
  /** Nivel asociado a este rango */
  level?: Level
}
