// Tipos base comunes para toda la aplicación
// Estos tipos aseguran consistencia entre entidades

export type ID = number

export type DateString = string

export interface Timestamps {
  created_at: DateString
  updated_at: DateString
  deleted_at: DateString | null
}

export interface BaseEntity extends Timestamps {
  id: ID
}

// Tipos auxiliares para operaciones comunes
export type Nullable<T> = T | null

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

// Estados comunes
export type Status = 'active' | 'inactive'

export type UserRole = 'admin' | 'teacher' | 'student'
