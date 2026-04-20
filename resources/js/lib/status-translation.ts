/**
 * Helper function to translate status values for Learning Session and Application Form
 * This provides Spanish translations with "Vigente" instead of "Activo" for the active status
 */
export function tStatus(status: string): string {
  const statusTranslations: Record<string, string> = {
    scheduled: 'Programada',
    active: 'Vigente',
    finished: 'Finalizada',
    canceled: 'Cancelada'
  }

  return statusTranslations[status] || status
}
