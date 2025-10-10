// Utilidades para conversión y mapeo de tipos
import { DateString } from './base'

/**
 * Convierte string | number a number
 * Útil para campos de formularios que pueden venir como string
 */
export const parseNumber = (value: string | number): number => {
  if (typeof value === 'number') return value
  return parseInt(value, 10) || 0
}

/**
 * Convierte string | number a decimal
 */
export const parseDecimal = (value: string | number): number => {
  if (typeof value === 'number') return value
  return parseFloat(value) || 0
}

/**
 * Formatea fecha para enviar a la API (YYYY-MM-DD)
 */
export const formatDateForAPI = (date: string | Date): DateString => {
  if (date instanceof Date) {
    return date.toISOString().split('T')[0] as DateString
  }
  return date as DateString
}

/**
 * Formatea fecha para mostrar en UI (DD/MM/YYYY)
 */
export const formatDateForDisplay = (date: string | Date): string => {
  if (date instanceof Date) {
    return date.toLocaleDateString('es-ES')
  }
  if (typeof date === 'string') {
    return new Date(date).toLocaleDateString('es-ES')
  }
  return ''
}

/**
 * Valida si un valor es un ID válido
 */
export const isValidId = (value: any): value is number => {
  return typeof value === 'number' && value > 0
}

/**
 * Valida si una cadena es una fecha válida
 */
export const isValidDateString = (value: string): boolean => {
  return !isNaN(Date.parse(value))
}

/**
 * Convierte parámetros booleanos de string a boolean
 * Útil para query params que vienen como string
 */
export const parseBoolean = (value: string | boolean): boolean => {
  if (typeof value === 'boolean') return value
  return value === 'true' || value === '1'
}
