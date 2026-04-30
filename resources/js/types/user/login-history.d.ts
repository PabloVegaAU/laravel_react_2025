import type { BaseEntity, Timestamps } from '@/types/core'
import type { User } from './user'

/**
 * Representa un registro de historial de login
 * @see app/Models/UserLoginHistory.php
 * @see database/migrations/2026_04_28_224320_create_user_login_histories_table.php
 */
export type UserLoginHistory = Timestamps & {
  id: number
  user_id: number
  session_id: string | null
  ip_address: string
  user_agent: string
  browser: string | null
  operating_system: string | null
  device_type: string | null
  country: string | null
  city: string | null
  latitude: number | null
  longitude: number | null
  status: 'success' | 'failed'
  login_at: string
  logged_out_at: string | null
  duration_minutes: number | null
  is_suspicious: boolean
  risk_level: 'normal' | 'sospechoso' | 'critico' | null
  risk_score: number | null
  risk_factors: Record<string, any> | null
  comparison_login_id: number | null
  failure_reason: string | null

  // Relaciones
  user?: User
  comparison_login?: UserLoginHistory
}

/**
 * Opciones de filtro para el nivel de riesgo
 */
export type RiskLevelOption = {
  value: string
  label: string
}

/**
 * Opciones de filtro para el estado
 */
export type StatusOption = {
  value: string
  label: string
}

/**
 * Estadísticas de login
 */
export type LoginHistoryStatistics = {
  total_today: number
  suspicious_today: number
  critical_risk_today: number
  total_week: number
  total_month: number
  risk_distribution: {
    normal: number
    sospechoso: number
    critico: number
  }
}

/**
 * Filtros disponibles para login histories
 */
export type LoginHistoryFilters = {
  user_id?: string
  risk_level?: string
  status?: string
  ip_address?: string
  is_suspicious?: boolean
  date_from?: string
  date_to?: string
  country?: string
}
