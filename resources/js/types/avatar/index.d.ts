import { Level } from '../academic/level'
import { Student } from '../user/student'

/**
 * Representa un avatar que los estudiantes pueden desbloquear y usar
 * Basado en:
 * - Migración: database/migrations/2025_06_22_100420_create_avatars_table.php
 * - Modelo: app/Models/Avatar.php
 */
export interface Avatar {
  /** Identificador único */
  id: number

  /** Nombre del avatar */
  name: string

  /** URL o ruta a la imagen del avatar */
  image_url: string

  /** Precio en puntos del avatar */
  price: number

  /** Indica si el avatar está activo */
  is_active: boolean

  /** Nivel requerido para desbloquear este avatar */
  level_required: number

  /** Puntos necesarios para desbloquear este avatar en la tienda */
  points_store: number

  /** Fechas de creación y actualización */
  created_at: string
  updated_at: string
  deleted_at: string | null

  // Relaciones
  /** Nivel requerido para desbloquear este avatar */
  requiredLevel?: Level

  /** Avatares de los estudiantes */
  studentAvatars?: StudentAvatar[]

  /** Estudiantes que han desbloqueado este avatar */
  students?: Student[]
}

/**
 * Representa la relación entre un avatar y un estudiante
 */
export interface StudentAvatar {
  /** Identificador único */
  id: number

  /** Indica si este avatar está activo para el estudiante */
  active: boolean

  /** Puntos pagados por el estudiante por este avatar */
  points_store: number

  /** Fecha en que el estudiante adquirió este avatar */
  exchange_date: string | null

  /** Identificador del estudiante */
  student_id: number

  /** Identificador del avatar */
  avatar_id: number

  /** Fechas de creación y actualización */
  created_at: string
  updated_at: string

  // Relaciones
  /** Estudiante que ha desbloqueado este avatar */
  student?: Student

  /** Avatar desbloqueado por el estudiante */
  avatar?: Avatar
}

/**
 * Tipo de datos para crear un nuevo avatar (solo administradores)
 */
export interface CreateAvatarData {
  /** Nombre del avatar */
  name: string

  /** Archivo de imagen del avatar */
  image: File

  /** Nivel requerido para desbloquear este avatar */
  level_required: number

  /** Puntos necesarios para desbloquear este avatar en la tienda */
  points_store: number
}

/**
 * Tipo de datos para actualizar un avatar existente (solo administradores)
 */
export interface UpdateAvatarData {
  /** Nombre del avatar */
  name?: string

  /** Archivo de imagen del avatar */
  image?: File | null

  /** Nivel requerido para desbloquear este avatar */
  level_required?: number

  /** Puntos necesarios para desbloquear este avatar en la tienda */
  points_store?: number
}

/**
 * Tipo de datos para asignar un avatar a un estudiante
 */
export interface AssignAvatarData {
  /** Identificador del avatar a asignar */
  avatar_id: number

  /** Indica si este avatar debe ser el activo */
  make_active?: boolean
}

/**
 * Tipo de datos para filtrar avatares
 */
export interface AvatarFilters {
  /** Filtro por nivel mínimo requerido */
  min_level?: number

  /** Filtro por puntos máximo */
  max_points?: number

  /** Búsqueda por nombre */
  search?: string

  /** Solo mostrar avatares desbloqueados para un estudiante específico */
  student_id?: number

  /** Solo mostrar avatares que el estudiante no tiene aún */
  not_owned_by_student?: number

  /** Paginación */
  page?: number
  per_page?: number
}

/**
 * Tipo de datos para seleccionar un avatar para un estudiante
 */
export interface AvatarSelectionData {
  /** Identificador del avatar del estudiante a activar */
  student_avatar_id: number
}

/**
 * Tipo de datos para comprar un avatar
 */
export interface AvatarPurchaseData {
  /** Identificador del avatar a comprar */
  avatar_id: number

  /** Indica si este avatar debe ser el activo después de la compra */
  make_active: boolean
}
