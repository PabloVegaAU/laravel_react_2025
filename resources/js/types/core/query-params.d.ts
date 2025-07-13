import type { FilterParams, QueryParams } from './base'

/**
 * Type for including relationships in API requests
 */
export interface IncludeParams {
  /**
   * Comma-separated list of relationships to include
   * Example: 'user,profile,roles'
   */
  include?: string
}

/**
 * Type for field selection in API requests
 */
export interface FieldParams {
  /**
   * Fields to include in the response
   * Example: 'id,name,email'
   */
  fields?: string

  /**
   * Fields to append to the response
   * Example: 'full_name,avatar_url'
   */
  append?: string
}

/**
 * Type for filtering records in API requests
 */
export interface FilteringParams extends FilterParams {
  /**
   * Filter records where the specified field matches the given value
   * Example: { 'name': 'John' }
   */
  filter?: Record<string, string | number | boolean | null | undefined>

  /**
   * Search term for full-text search
   */
  search?: string

  /**
   * Search in specific columns
   * Example: 'name,email,phone'
   */
  search_columns?: string
}

/**
 * Type for sorting records in API requests
 */
export interface SortingParams {
  /**
   * Field to sort by
   */
  sort_by?: string

  /**
   * Sort direction
   * @default 'asc'
   */
  sort_order?: 'asc' | 'desc'

  /**
   * Sort by multiple fields
   * Example: 'name:asc,created_at:desc'
   */
  sort?: string
}

/**
 * Extended query parameters for API requests
 */
export interface ExtendedQueryParams extends QueryParams, IncludeParams, FieldParams, FilteringParams, SortingParams {}

/**
 * Type for API request options with query parameters
 */
export interface RequestOptions<T = any> {
  /**
   * Query parameters for the request
   */
  params?: T & ExtendedQueryParams

  /**
   * Whether to include related resources
   */
  withRelations?: boolean | string[]

  /**
   * Whether to paginate the results
   * @default true
   */
  paginate?: boolean
}

/**
 * Type for pagination configuration
 */
export interface PaginationConfig {
  /**
   * Current page number
   * @default 1
   */
  page?: number

  /**
   * Number of items per page
   * @default 15
   */
  perPage?: number

  /**
   * Available page sizes
   */
  pageSizes?: number[]

  /**
   * Total number of items
   */
  total?: number
}

/**
 * Type for sort configuration
 */
export interface SortConfig {
  /**
   * Field to sort by
   */
  field: string

  /**
   * Sort direction
   */
  order: 'asc' | 'desc'
}

/**
 * Type for filter configuration
 */
export interface FilterConfig {
  /**
   * Field to filter by
   */
  field: string

  /**
   * Filter operator
   */
  operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'like' | 'in' | 'not_in' | 'is_null' | 'is_not_null'

  /**
   * Filter value
   */
  value: any
}
