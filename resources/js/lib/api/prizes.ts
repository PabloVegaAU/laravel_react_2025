import { Prize, PrizeFilters, PrizeFormData } from '@/types/prize'

const API_BASE_URL = '/api/prizes'

/**
 * Fetch all prizes with optional filters
 */
export const fetchPrizes = async (filters: PrizeFilters = {}): Promise<{ data: Prize[] }> => {
  const params = new URLSearchParams()

  // Add filters to query params if they exist
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== '' && value !== null) {
      params.append(key, String(value))
    }
  })

  const response = await fetch(`${API_BASE_URL}?${params.toString()}`, {
    headers: {
      Accept: 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    },
    credentials: 'include'
  })

  if (!response.ok) {
    throw new Error('Error al cargar los premios')
  }

  return response.json()
}

/**
 * Fetch a single prize by ID
 */
export const fetchPrize = async (id: number | string): Promise<{ data: Prize }> => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    headers: {
      Accept: 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    },
    credentials: 'include'
  })

  if (!response.ok) {
    throw new Error('Error al cargar el premio')
  }

  return response.json()
}

/**
 * Create a new prize
 */
export const createPrize = async (formData: PrizeFormData): Promise<{ data: Prize }> => {
  const formDataToSend = new FormData()

  // Append all form data to FormData
  Object.entries(formData).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      if (key === 'image' && value instanceof File) {
        formDataToSend.append(key, value)
      } else if (key === 'is_active') {
        formDataToSend.append(key, value ? '1' : '0')
      } else {
        formDataToSend.append(key, String(value))
      }
    }
  })

  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: {
      'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
      Accept: 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    },
    body: formDataToSend,
    credentials: 'include'
  })

  const data = await response.json()

  if (!response.ok) {
    const errorMessage = data.message || 'Error al crear el premio'
    const errors = data.errors ? Object.values(data.errors).flat().join('\n') : ''
    throw new Error(`${errorMessage}${errors ? '\n' + errors : ''}`)
  }

  return data
}

/**
 * Update an existing prize
 */
export const updatePrize = async (id: number | string, formData: PrizeFormData): Promise<{ data: Prize }> => {
  const formDataToSend = new FormData()

  // Append all form data to FormData
  Object.entries(formData).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      if (key === 'image' && value instanceof File) {
        formDataToSend.append(key, value)
      } else if (key === 'is_active') {
        formDataToSend.append(key, value ? '1' : '0')
      } else {
        formDataToSend.append(key, String(value))
      }
    }
  })

  // For file uploads with Laravel, we need to use POST with _method=PUT
  formDataToSend.append('_method', 'PUT')

  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'POST',
    headers: {
      'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
      Accept: 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    },
    body: formDataToSend,
    credentials: 'include'
  })

  const data = await response.json()

  if (!response.ok) {
    const errorMessage = data.message || 'Error al actualizar el premio'
    const errors = data.errors ? Object.values(data.errors).flat().join('\n') : ''
    throw new Error(`${errorMessage}${errors ? '\n' + errors : ''}`)
  }

  return data
}

/**
 * Delete a prize
 */
export const deletePrize = async (id: number | string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
      Accept: 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  })

  if (!response.ok) {
    const data = await response.json()
    const errorMessage = data.message || 'Error al eliminar el premio'
    throw new Error(errorMessage)
  }
}

/**
 * Toggle prize active status
 */
export const togglePrizeStatus = async (id: number | string, isActive: boolean): Promise<{ data: Prize }> => {
  const response = await fetch(`${API_BASE_URL}/${id}/status`, {
    method: 'PUT',
    headers: {
      'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
      Accept: 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ is_active: isActive }),
    credentials: 'include'
  })

  const data = await response.json()

  if (!response.ok) {
    const errorMessage = data.message || 'Error al actualizar el estado del premio'
    throw new Error(errorMessage)
  }

  return data
}
