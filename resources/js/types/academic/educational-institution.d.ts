/**
 * Representa una institución educativa en el sistema
 * @see database/migrations/2025_06_22_100040_create_educational_institutions_table.php
 * @see app/Models/EducationalInstitution.php
 */
export type EducationalInstitution = {
  id: number
  name: string
  ugel: string
  created_at: string
  updated_at: string
  deleted_at: string | null
}
