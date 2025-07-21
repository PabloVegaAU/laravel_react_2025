import { Prize } from '@/types/prize'

/**
 * Formats the prize price with the correct currency symbol and decimal places
 */
export const formatPrizePrice = (points: number): string => {
  return new Intl.NumberFormat('es-ES', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(points)
}

/**
 * Formats the available until date in a user-friendly way
 */
export const formatAvailableUntil = (dateString: string | null): string => {
  if (!dateString) return 'Sin fecha límite'

  const date = new Date(dateString)
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date)
}

/**
 * Gets the status badge properties for a prize
 */
export const getPrizeStatus = (prize: Prize) => {
  const now = new Date()
  const availableUntil = prize.available_until ? new Date(prize.available_until) : null

  // Check if prize is expired
  if (availableUntil && availableUntil < now) {
    return {
      text: 'Expirado',
      variant: 'destructive' as const
    }
  }

  // Check if prize is out of stock
  if (prize.stock <= 0) {
    return {
      text: 'Agotado',
      variant: 'outline' as const
    }
  }

  // Check if prize is active
  if (prize.is_active) {
    return {
      text: 'Disponible',
      variant: 'success' as const
    }
  }

  // Default to inactive
  return {
    text: 'Inactivo',
    variant: 'secondary' as const
  }
}

/**
 * Validates a prize image file
 */
export const validatePrizeImage = (file: File): { valid: boolean; message?: string } => {
  // Check file type
  if (!file.type.startsWith('image/')) {
    return {
      valid: false,
      message: 'El archivo debe ser una imagen (JPEG, PNG, GIF, etc.)'
    }
  }

  // Check file size (max 2MB)
  if (file.size > 2 * 1024 * 1024) {
    return {
      valid: false,
      message: 'La imagen no puede pesar más de 2MB'
    }
  }

  return { valid: true }
}

/**
 * Gets the URL for a prize image
 */
export const getPrizeImageUrl = (imagePath: string | null): string => {
  if (!imagePath) return '/images/placeholder-prize.png'
  return imagePath.startsWith('http') ? imagePath : `/storage/${imagePath}`
}

/**
 * Formats the stock information
 */
export const formatStockInfo = (stock: number): string => {
  if (stock <= 0) return 'Agotado'
  if (stock < 5) return `Últimas ${stock} unidades`
  return `${stock} disponibles`
}

/**
 * Checks if a prize is available for redemption
 */
export const isPrizeAvailable = (prize: Prize): boolean => {
  const now = new Date()
  const availableUntil = prize.available_until ? new Date(prize.available_until) : null

  return prize.is_active && prize.stock > 0 && (!availableUntil || availableUntil >= now)
}

/**
 * Sorts prizes by availability and points cost
 */
export const sortPrizes = (prizes: Prize[], sortBy: 'points_asc' | 'points_desc' | 'name_asc' | 'name_desc' = 'points_asc'): Prize[] => {
  const sorted = [...prizes]

  switch (sortBy) {
    case 'points_asc':
      return sorted.sort((a, b) => a.points_cost - b.points_cost)
    case 'points_desc':
      return sorted.sort((a, b) => b.points_cost - a.points_cost)
    case 'name_asc':
      return sorted.sort((a, b) => a.name.localeCompare(b.name))
    case 'name_desc':
      return sorted.sort((a, b) => b.name.localeCompare(a.name))
    default:
      return sorted
  }
}
