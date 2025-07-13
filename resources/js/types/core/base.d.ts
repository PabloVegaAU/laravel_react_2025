import type { AxiosRequestConfig, AxiosResponse } from 'axios'

/**
 * Standard timestamp fields for database models
 */
export interface Timestamps {
  created_at: string
  updated_at: string
  deleted_at?: string | null
}

/**
 * Standard pagination response from Laravel
 */
export interface PaginatedResponse<T> {
  data: T[]
  links: {
    first: string | null
    last: string | null
    prev: string | null
    next: string | null
  }
  meta: {
    current_page: number
    from: number
    last_page: number
    path: string
    per_page: number
    to: number
    total: number
  }
}

/**
 * Standard API response wrapper
 */
export interface ApiResponse<T = any> {
  data: T
  message?: string
  status: number
}

/**
 * Type for API error responses
 */
export interface ApiError {
  message: string
  errors?: Record<string, string[]>
  status: number
}

/**
 * Type for pagination parameters
 */
export interface PaginationParams {
  page?: number
  per_page?: number
  sort_by?: string
  sort_order?: 'asc' | 'desc'
}

/**
 * Type for filter parameters
 */
export interface FilterParams {
  [key: string]: string | number | boolean | null | undefined
}

/**
 * Combined type for query parameters
 */
export type QueryParams = PaginationParams & FilterParams

/**
 * Type for API request configuration
 */
export interface ApiRequestConfig extends AxiosRequestConfig {
  // Add any custom request config here
}

/**
 * Type for API response
 */
export type ApiResponseWrapper<T> = AxiosResponse<ApiResponse<T>>

/**
 * Type for paginated API response
 */
export type PaginatedApiResponse<T> = ApiResponse<PaginatedResponse<T>>
