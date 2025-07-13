import type { Timestamps } from '../core/base'

/**
 * User permission
 */
export interface Permission extends Timestamps {
  /**
   * Unique identifier
   */
  id: number

  /**
   * Permission name (e.g., 'users.create', 'posts.delete')
   */
  name: string

  /**
   * Human-readable display name
   */
  display_name?: string

  /**
   * Permission description
   */
  description?: string

  /**
   * Whether the permission is protected (cannot be deleted/modified)
   */
  protected?: boolean

  /**
   * Associated roles
   */
  roles?: Role[]

  /**
   * Number of roles with this permission
   */
  roles_count?: number

  /**
   * Number of users with this permission
   */
  users_count?: number
}

/**
 * Permission creation data
 */
export interface CreatePermissionData {
  /**
   * Permission name (must be unique)
   */
  name: string

  /**
   * Human-readable display name
   */
  display_name?: string

  /**
   * Permission description
   */
  description?: string
}

/**
 * Permission update data
 */
export type UpdatePermissionData = Partial<Omit<CreatePermissionData, 'name'>> & {
  name?: string
}

/**
 * Role reference for permission relationships
 */
interface Role {
  id: number
  name: string
  display_name?: string
}
