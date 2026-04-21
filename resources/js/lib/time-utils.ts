import { format, isAfter, isBefore, parse } from 'date-fns'

/**
 * Genera opciones de tiempo en intervalos de 30 minutos
 * Si la fecha es hoy, filtra para mostrar solo horas futuras
 * Si la fecha es futura, muestra todas las horas
 * Si minTime es proporcionado, filtra para mostrar solo horas > minTime (cuando la fecha es hoy)
 */
export function generateTimeOptions(selectedDate: string | null, currentTimezone: string = 'America/Lima', minTime?: string): string[] {
  const now = new Date()
  const selectedDateObj = selectedDate ? new Date(selectedDate + 'T00:00:00') : null

  // Generar todas las opciones de tiempo (00:00 a 23:30 en intervalos de 30 min)
  const allTimes: string[] = []
  for (let hour = 0; hour < 24; hour++) {
    allTimes.push(`${hour.toString().padStart(2, '0')}:00`)
    allTimes.push(`${hour.toString().padStart(2, '0')}:30`)
  }

  // Si no hay fecha seleccionada, mostrar todas las opciones
  if (!selectedDateObj) {
    return allTimes
  }

  // Comparar solo las fechas (año, mes, día) sin considerar la hora
  const isToday =
    selectedDateObj.getFullYear() === now.getFullYear() &&
    selectedDateObj.getMonth() === now.getMonth() &&
    selectedDateObj.getDate() === now.getDate()

  // Si es una fecha futura (no hoy), mostrar todas las opciones
  if (!isToday) {
    return allTimes
  }

  // Si es hoy, determinar la hora mínima para filtrar
  const minTimeToUse = minTime || format(now, 'HH:mm')

  return allTimes.filter((time) => {
    // Comparar strings directamente para asegurar filtrado estricto
    return time > minTimeToUse
  })
}

/**
 * Valida si una hora es válida para una fecha seleccionada
 * Si la fecha es hoy, la hora debe ser futura
 */
export function isValidTimeForDate(time: string, selectedDate: string | null, currentTimezone: string = 'America/Lima'): boolean {
  const now = new Date()
  const selectedDateObj = selectedDate ? new Date(selectedDate + 'T00:00:00') : null

  // Si no hay fecha seleccionada, cualquier hora es válida
  if (!selectedDateObj) {
    return true
  }

  // Comparar solo las fechas (año, mes, día) sin considerar la hora
  const isToday =
    selectedDateObj.getFullYear() === now.getFullYear() &&
    selectedDateObj.getMonth() === now.getMonth() &&
    selectedDateObj.getDate() === now.getDate()

  // Si es una fecha futura (no hoy), cualquier hora es válida
  if (!isToday) {
    return true
  }

  // Si es hoy, la hora debe ser futura
  const currentTime = format(now, 'HH:mm')
  const currentTimeDate = parse(currentTime, 'HH:mm', now)
  const timeDate = parse(time, 'HH:mm', now)

  return isAfter(timeDate, currentTimeDate)
}

/**
 * Obtiene la próxima hora válida (redondeada al próximo intervalo de 30 minutos)
 */
export function getNextValidTime(currentTimezone: string = 'America/Lima'): string {
  const now = new Date()
  const currentTime = format(now, 'HH:mm')
  const currentTimeDate = parse(currentTime, 'HH:mm', now)

  // Redondear al próximo intervalo de 30 minutos
  const minutes = parseInt(currentTime.split(':')[1])
  const hours = parseInt(currentTime.split(':')[0])

  const nextMinutes = minutes >= 30 ? 0 : 30
  let nextHours = minutes >= 30 ? hours + 1 : hours

  if (nextHours >= 24) {
    nextHours = 0
  }

  return `${nextHours.toString().padStart(2, '0')}:${nextMinutes.toString().padStart(2, '0')}`
}

/**
 * Valida si la fecha y hora de fin son posteriores a la fecha y hora de inicio
 */
export function isEndAfterStart(startDate: string, startTime: string, endDate: string, endTime: string): boolean {
  const startDateTime = parse(`${startDate} ${startTime}`, 'yyyy-MM-dd HH:mm', new Date())
  const endDateTime = parse(`${endDate} ${endTime}`, 'yyyy-MM-dd HH:mm', new Date())

  return isAfter(endDateTime, startDateTime)
}

/**
 * Valida si la fecha de fin es igual o posterior a la fecha de inicio
 */
export function isEndDateValid(startDate: string, endDate: string): boolean {
  const start = new Date(startDate)
  const end = new Date(endDate)
  return !isBefore(end, start)
}

/**
 * Obtiene la próxima hora válida para el fin basada en la hora de inicio
 */
export function getValidEndTime(startTime: string): string {
  const [hours, minutes] = startTime.split(':').map(Number)

  const nextMinutes = minutes >= 30 ? 0 : 30
  let nextHours = minutes >= 30 ? hours + 1 : hours

  if (nextHours >= 24) {
    nextHours = 0
  }

  return `${nextHours.toString().padStart(2, '0')}:${nextMinutes.toString().padStart(2, '0')}`
}
