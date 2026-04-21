export function formatDateForInput(date: string | Date | null) {
  if (!date) return ''
  const d = date instanceof Date ? date : new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function formatDate(date: string | Date | null) {
  if (!date) return ''
  const dateObj = date instanceof Date ? date : new Date(date)
  const day = dateObj.getDate()
  const month = dateObj.getMonth() + 1
  const year = dateObj.getFullYear()
  return `${day}/${month}/${year}`
}

export function formatDateTime(date: string | Date | null) {
  if (!date) return ''
  const dateObj = date instanceof Date ? date : new Date(date)
  const day = dateObj.getDate()
  const month = dateObj.getMonth() + 1
  const year = dateObj.getFullYear()
  const hours = dateObj.getHours()
  const minutes = dateObj.getMinutes()
  const seconds = dateObj.getSeconds()
  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`
}

export function formatTimeDifference(start: string | Date | null, end: string | Date | null): string {
  if (!start || !end) return '00h 00m 00s'

  const startDate = start instanceof Date ? start : new Date(start)
  const endDate = end instanceof Date ? end : new Date(end)

  // Esto sí da la diferencia en milisegundos reales
  const diffMs = endDate.getTime() - startDate.getTime()

  const totalSeconds = Math.floor(diffMs / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  return `${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`
}
