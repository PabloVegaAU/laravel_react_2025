export type PaginatedResponse<T> = {
  current_page: number
  data: T[]
  first_page_url: string
  from: number | null
  last_page: number
  last_page_url: string
  links: {
    url: string | null
    label: string
    active: boolean
  }[]
  next_page_url: string | null
  path: string
  per_page: number
  prev_page_url: string | null
  to: number | null
  total: number
}

export type ResourcePageProps<T> = {
  data: PaginatedResponse<T>
  filters: {
    search?: string
    sort?: string
    direction?: 'asc' | 'desc'
  }
  flash?: FlashMessage
}

export type FlashMessage = {
  success?: string
  error?: string
}
