import { PageProps as InertiaPageProps } from '@inertiajs/react'
import { AxiosInstance } from 'axios'
import ziggyRoute, { Config as ZiggyConfig } from 'ziggy-js'

// Global TypeScript declarations
declare global {
  // Make Ziggy available globally
  interface Window {
    axios: AxiosInstance
  }

  // Global route helper
  const route: typeof ziggyRoute
  const Ziggy: ZiggyConfig
}

// Base page props that includes auth and other shared props
export interface PageProps extends InertiaPageProps {
  auth: {
    user: {
      id: number
      name: string
      email: string
      email_verified_at: string | null
      created_at: string
      updated_at: string
    }
  }
}

// Avatar types
export interface Avatar {
  id: number
  name: string
  image_url: string
  price: string | number
  is_active: boolean
  required_level?: {
    id: number
    level: number
    name: string
  }
  created_at: string
  updated_at: string
  deleted_at: string | null
}

// Level type
export interface Level {
  id: number
  level: number
  name: string
  created_at: string
  updated_at: string
}

// Form data types
export interface AvatarFormData extends Record<string, any> {
  name: string
  price: number | string
  is_active: boolean
  image_url?: File | string | null
  required_level_id?: number | null
  [key: string]: any // Index signature to satisfy Inertia's useForm
}

// API response types
export interface ApiResponse<T = any> {
  data?: T
  message?: string
  success: boolean
}

declare module 'ziggy-js' {
  interface RouteParam {
    [key: string]: string | number | boolean | null | undefined
  }

  interface RouteParamsWithQueryOverload {
    params?: RouteParam | undefined | null
    query?: Record<string, any>
  }

  export default function route(
    name?: string,
    params?: RouteParam | RouteParamsWithQueryOverload | null,
    absolute?: boolean,
    customZiggy?: ZiggyConfig
  ): string
}
