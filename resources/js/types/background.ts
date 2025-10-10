import { Level } from './academic'
import { BaseEntity } from './core'

/**
 * Representa un fondo en el sistema educativo
 * @see database/migrations/2025_06_22_100440_create_backgrounds_table.php
 * @see app/Models/Background.php
 */
export type Background = BaseEntity & {
  name: string
  image: string
  level_required: number
  points_store: number
  activo: boolean

  // Relaciones opcionales cargadas desde el controlador
  requiredLevel?: Level
}

/**
 * Tipo para crear un nuevo fondo
 * @see database/migrations/2025_06_22_100440_create_backgrounds_table.php
 */
export interface CreateBackgroundData {
  name: string
  level_required: number
  points_store: number
  image: File
  activo: boolean
}

/**
 * Tipo para actualizar un fondo existente
 * @see database/migrations/2025_06_22_100440_create_backgrounds_table.php
 */
export type UpdateBackgroundData = Partial<CreateBackgroundData>

/**
 * Datos para el formulario de edición de fondo
 * Incluye el nivel como objeto completo para facilitar la selección en el UI
 */
export type EditModalBackground = Background & {
  // El nivel ya viene cargado desde el controlador como objeto completo
  requiredLevel: Level
}

/**
 * Respuesta de la API al crear/actualizar un fondo
 */
export interface BackgroundResponse {
  success: boolean
  message: string
  background?: Background
}

/**
 * Filtros para búsqueda de fondos
 */
export interface BackgroundFilters {
  search?: string
  level_required?: number
  activo?: boolean
  page?: number
  per_page?: number
  sort_by?: 'name' | 'created_at' | 'updated_at'
  sort_order?: 'asc' | 'desc'
}
