import { Profile } from './profile'
import { Student } from './student'
import { Teacher } from './teacher'

type UserRole = 'admin' | 'teacher' | 'student' | 'guest'

/**
 * Representa un usuario en el sistema
 * Basado en:
 * - Migración: database/migrations/0001_01_01_000000_create_users_table.php
 * - Modelo: app/Models/User.php
 */
export interface User {
  /** Identificador único */
  id: number

  /** Nombre completo del usuario */
  name: string

  /** Dirección de correo electrónico del usuario (única, opcional) */
  email: string | null

  /** Marca de tiempo cuando se verificó el correo electrónico */
  email_verified_at: string | null

  /** Contraseña encriptada (oculta en respuestas de la API) */
  password?: string

  /** Token de recordatorio para inicio de sesión persistente */
  remember_token?: string | null

  /** Marca de tiempo cuando se creó el registro */
  created_at: string

  /** Marca de tiempo de la última actualización del registro */
  updated_at: string

  /** Marca de tiempo de eliminación lógica (si aplica) */
  deleted_at: string | null

  // Relaciones
  /** Información del perfil del usuario */
  profile?: Profile

  /** Si el usuario es estudiante, su registro de estudiante */
  student?: Student

  /** Si el usuario es profesor, su registro de profesor */
  teacher?: Teacher

  /** Roles del usuario (del paquete Spatie Permission) */
  roles?: UserRole[]
}

/**
 * Tipo para crear un nuevo usuario
 */
export type CreateUser = Omit<
  User,
  'id' | 'email_verified_at' | 'remember_token' | 'created_at' | 'updated_at' | 'deleted_at' | 'profile' | 'student' | 'teacher' | 'roles'
> & {
  password: string // Password is required when creating a user
  password_confirmation?: string // For confirmation validation
}

/**
 * Tipo para actualizar un usuario existente
 */
export type UpdateUser = Partial<Omit<CreateUser, 'password'>> & {
  current_password?: string // For password updates
  password?: string
  password_confirmation?: string
}

/**
 * Tipo para inicio de sesión de usuario
 */
export interface LoginCredentials {
  username: string // Using name as username
  password: string
  remember?: boolean
}

/**
 * Tipo para registro de usuario
 */
export interface RegisterData extends Omit<CreateUser, 'password_confirmation'> {
  password_confirmation: string
}

export type Profile = {
  user_id: number
  first_name: string
  last_name: string
  second_last_name?: string | null
  birth_date?: string | null
  phone?: string | null

  created_at: string
  updated_at: string
  deleted_at?: string | null
}
