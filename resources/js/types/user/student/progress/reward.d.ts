import { Student } from '../types'

/**
 * Recompensa canjeada por el estudiante
 */
export interface StudentStoreReward {
  id: number
  student_id: number
  store_reward_id: number
  points_store: number
  exchange_date: string | null
  created_at: string
  updated_at: string
  store_reward: {
    id: number
    name: string
    type: string
    image: string
    points_store: number
    level_required: number
    created_at: string
    updated_at: string
    level: {
      id: number
      name: string
      description: string | null
      created_at: string
      updated_at: string
    }
  }
}

/**
 * Datos para canjear una recompensa
 */
export interface RedeemRewardData {
  store_reward_id: number
  points_used: number
}

/**
 * Respuesta al canjear una recompensa
 */
export interface RewardRedeemedResponse {
  message: string
  student_reward: StudentStoreReward
  updated_student: Student
}

/**
 * Filtros para buscar recompensas canjeadas
 */
export interface StudentRewardFilters {
  student_id?: number
  store_reward_id?: number
  type?: string
  date_from?: string
  date_to?: string
  min_points?: number
  max_points?: number
  sort_by?: 'exchange_date' | 'points_store' | 'created_at'
  sort_order?: 'asc' | 'desc'
  per_page?: number
  page?: number
}

/**
 * Resumen de puntos y recompensas del estudiante
 */
export interface StudentPointsSummary {
  total_points_earned: number
  total_points_spent: number
  available_points: number
  total_rewards_redeemed: number
  rewards_by_type: Array<{
    type: string
    count: number
    total_points: number
  }>
  recent_rewards: Array<{
    id: number
    name: string
    type: string
    points: number
    exchange_date: string
  }>
}
