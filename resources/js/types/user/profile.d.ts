import { User } from './user'

/**
 * Representa la información extendida del perfil de un usuario
 * Basado en:
 * - Migración: database/migrations/2025_06_22_100020_create_profiles_table.php
 * - Modelo: app/Models/Profile.php
 */
export interface Profile {
  /** Referencia al usuario al que pertenece este perfil (clave primaria) */
  user_id: number

  /** Nombre de pila del usuario */
  first_name: string

  /** Apellido paterno del usuario */
  last_name: string

  /** Segundo apellido del usuario (opcional) */
  second_last_name: string | null

  /** Fecha de nacimiento del usuario */
  birth_date: string | null

  /** Número de teléfono del usuario */
  phone: string | null

  /** Marca de tiempo de creación del registro */
  created_at: string

  /** Marca de tiempo de la última actualización */
  updated_at: string

  /** Marca de tiempo de eliminación lógica (si aplica) */
  deleted_at: string | null

  // Relaciones

  /** Usuario al que pertenece este perfil */
  user?: User
}

/**
 * Tipo para crear un nuevo perfil
 */
export type CreateProfile = Omit<Profile, 'user_id' | 'created_at' | 'updated_at' | 'deleted_at' | 'user'>

/**
 * Tipo para actualizar un perfil existente
 */
export type UpdateProfile = Partial<CreateProfile>

/**
 * Tipo para el nombre completo del usuario
 */
export interface FullName {
  first_name: string
  last_name: string
  second_last_name?: string | null
}

/**
 * Tipo para la información de contacto del usuario
 */
export interface ContactInfo {
  email: string | null
  phone: string | null
}
