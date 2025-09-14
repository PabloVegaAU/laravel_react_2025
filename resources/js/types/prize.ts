export interface Prize {
  id: number
  name: string
  description: string
  image: string | null
  stock: number
  points_cost: number
  is_active: boolean
  available_until: string | null
  level_required: number
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface PrizeFormData {
  name: string
  description: string
  stock: string | number
  points_cost: string | number
  is_active: boolean
  available_until: string | null
  image: File | null
}

export interface PrizeFilters {
  search?: string
  is_active?: boolean | string
  min_points?: number | string
  max_points?: number | string
  in_stock?: boolean | string
}
