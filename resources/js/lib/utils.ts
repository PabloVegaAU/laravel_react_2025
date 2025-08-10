import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount)
}

export function hasRole(roles: string[], role: string) {
  return roles.includes(role.toLowerCase())
}

export function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((o, key) => o?.[key], obj)
}

export type NestedErrors =
  | {
      [key: string]: string | NestedErrors | NestedErrors[]
    }
  | null
  | undefined

export const getNestedError = (errors: NestedErrors, path: string): string | undefined => {
  if (!errors) return undefined

  // 1. Primero intenta acceso directo para claves planas
  if (typeof errors === 'object' && errors[path] && typeof errors[path] === 'string') {
    return errors[path] as string
  }

  // 2. Si es un string, devuélvelo directamente
  if (typeof errors === 'string') {
    return errors
  }

  // 3. Intenta acceso anidado
  const parts = path.split('.')
  let current: any = errors

  for (const part of parts) {
    if (!current || current[part] === undefined) return undefined
    current = current[part]

    // Si encontramos un string en cualquier nivel, lo devolvemos
    if (typeof current === 'string') {
      return current
    }
  }

  // 4. Último intento de devolver el valor si es un string
  return typeof current === 'string' ? current : undefined
}

/**
 * Normaliza una cadena de texto, eliminando acentos y caracteres especiales
 * @param str Cadena de texto a normalizar
 * @returns Cadena de texto normalizada en minúsculas y sin acentos
 */
export const normalizeString = (str: string): string => {
  if (!str) return ''

  return str
    .toLowerCase()
    .normalize('NFD') // Descompone los caracteres acentuados en su forma base + marca diacrítica
    .replace(/[\u0300-\u036f]/g, '') // Elimina las marcas diacríticas
    .replace(/[^a-z0-9\s]/g, '') // Elimina caracteres especiales, manteniendo letras, números y espacios
    .trim()
}
