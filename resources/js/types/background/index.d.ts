import { Level } from '../academic/level'
import { Student } from '../user/student'

/**
 * Representa un fondo que los estudiantes pueden desbloquear y usar
 * Basado en:
 * - Migración: database/migrations/2025_06_22_100440_create_backgrounds_table.php
 * - Modelo: app/Models/Background.php
 */
export interface Background {
  /** Identificador único */
  id: number

  /** Nombre del fondo */
  name: string

  /** URL o ruta a la imagen del fondo */
  image: string

  /** Nivel requerido para desbloquear este fondo */
  level_required: number

  /** Puntos necesarios para desbloquear este fondo en la tienda */
  points_store: number

  /** Fechas de creación y actualización */
  created_at: string
  updated_at: string

  // Relaciones
  /** Nivel requerido para desbloquear este fondo */
  required_level?: Level

  /** Fondos de los estudiantes */
  student_backgrounds?: StudentBackground[]

  /** Estudiantes que han desbloqueado este fondo */
  students?: Student[]
}

/**
 * Representa la relación entre un fondo y un estudiante
 */
export interface StudentBackground {
  /** Identificador único */
  id: number

  /** Pantalla donde se utiliza este fondo */
  screen: string

  /** Indica si este fondo está activo para el estudiante */
  active: boolean

  /** Puntos pagados por el estudiante por este fondo */
  points_store: number

  /** Fecha en que el estudiante adquirió este fondo */
  exchange_date: string | null

  /** Identificador del estudiante */
  student_id: number

  /** Identificador del fondo */
  background_id: number

  /** Fechas de creación y actualización */
  created_at: string
  updated_at: string

  // Relaciones
  /** Estudiante que ha desbloqueado este fondo */
  student?: Student

  /** Fondo desbloqueado por el estudiante */
  background?: Background
}

/**
 * Tipo de datos para crear un nuevo fondo (solo administradores)
 */
export interface CreateBackgroundData {
  /** Nombre del fondo */
  name: string

  /** Archivo de imagen del fondo */
  image: File

  /** Nivel requerido para desbloquear este fondo */
  level_required: number

  /** Puntos necesarios para desbloquear este fondo en la tienda */
  points_store: number
}

/**
 * Tipo de datos para actualizar un fondo existente (solo administradores)
 */
export interface UpdateBackgroundData {
  /** Nombre del fondo */
  name?: string

  /** Archivo de imagen del fondo */
  image?: File | null

  /** Nivel requerido para desbloquear este fondo */
  level_required?: number

  /** Puntos necesarios para desbloquear este fondo en la tienda */
  points_store?: number
}

/**
 * Tipo de datos para asignar un fondo a un estudiante
 */
export interface AssignBackgroundData {
  /** Identificador del fondo a asignar */
  background_id: number

  /** Pantalla donde se utilizará este fondo */
  screen: string

  /** Indica si este fondo debe ser el activo */
  make_active?: boolean
}

/**
 * Tipo de datos para filtrar fondos
 */
export interface BackgroundFilters {
  /** Filtro por nivel mínimo requerido */
  min_level?: number

  /** Filtro por puntos máximo */
  max_points?: number

  /** Búsqueda por nombre */
  search?: string

  /** Solo mostrar fondos desbloqueados para un estudiante específico */
  student_id?: number

  /** Solo mostrar fondos que el estudiante no tiene aún */
  not_owned_by_student?: number

  /** Filtro por tipo de pantalla */
  screen?: string

  /** Paginación */
  page?: number
  per_page?: number
}

/**
 * Tipo de datos para seleccionar un fondo para un estudiante
 */
export interface BackgroundSelectionData {
  /** Identificador del fondo del estudiante a activar */
  student_background_id: number

  /** Pantalla donde se utilizará este fondo */
  screen: string
}

/**
 * Tipo de datos para comprar un fondo
 */
export interface BackgroundPurchaseData {
  /** Identificador del fondo a comprar */
  background_id: number

  /** Pantalla donde se utilizará este fondo */
  screen: string

  /** Indica si este fondo debe ser el activo después de la compra */
  make_active: boolean
}
