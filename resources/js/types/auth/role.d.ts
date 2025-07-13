import type { Timestamps } from '../core/base'

/**
 * User role
 */
export interface Role extends Timestamps {
  /**
   * Unique identifier
   */
  id: number

  /**
   * Role name (e.g., 'admin', 'teacher', 'student')
   */
  name: string

  /**
   * Human-readable display name
   */
  display_name?: string

  /**
   * Role description
   */
  description?: string

  /**
   * Whether the role is protected (cannot be deleted/modified)
   */
  protected?: boolean

  /**
   * Associated permissions
   */
  permissions?: Permission[]

  /**
   * Number of users with this role
   */
  users_count?: number
}

/**
 * Role creation data
 */
export interface CreateRoleData {
  /**
   * Role name (must be unique)
   */
  name: string

  /**
   * Human-readable display name
   */
  display_name?: string

  /**
   * Role description
   */
  description?: string

  /**
   * Array of permission IDs
   */
  permissions?: number[]
}

/**
 * Role update data
 */
export type UpdateRoleData = Partial<Omit<CreateRoleData, 'name'>> & {
  name?: string
}
