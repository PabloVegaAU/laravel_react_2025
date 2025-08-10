/** Función para convertir a fecha UTC */
export const toUTCDateString = (date: Date): string => {
  return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())).toISOString().split('T')[0]
}

// Función para formatear fechas de string a Date
export const parseDateString = (date: Date | string | undefined): Date => {
  if (!date) return new Date()
  if (date instanceof Date) return date
  if (typeof date === 'string') {
    try {
      // Handle ISO date strings
      if (date.includes('T')) {
        return new Date(date)
      }
      // Handle YYYY-MM-DD format
      const [year, month, day] = date.split('-').map(Number)
      return new Date(year, month - 1, day)
    } catch (error) {
      console.error('Error parsing date:', error)
    }
  }
  return new Date()
}
