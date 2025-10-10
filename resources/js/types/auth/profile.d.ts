import type { Timestamps } from '@/types/core'
import type { User } from '../user/user'

/**
 * Representa la información extendida del perfil de un usuario
 * @see database/migrations/2025_06_22_100020_create_profiles_table.php
 * @see app/Models/Profile.php
 */
export type Profile = Timestamps & {
  user_id: number
  first_name: string
  last_name: string
  second_last_name: string | null
  birth_date: string | null
  phone: string | null

  // Relaciones
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
