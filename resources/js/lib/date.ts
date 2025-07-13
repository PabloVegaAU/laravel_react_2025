/** Función para convertir a fecha UTC */
export const toUTCDateString = (date: Date): string => {
  return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())).toISOString().split('T')[0]
}
