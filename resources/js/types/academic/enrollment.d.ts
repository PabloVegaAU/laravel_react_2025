import type { Student } from '../user'
import type { Classroom } from './classroom'

/**
 * Estado de la matrícula del estudiante.
 * - `active`: Activo (estudiante actualmente matriculado)
 * - `completed`: Completado (graduado o finalizado exitosamente)
 * - `transferred`: Transferido a otra institución
 * - `inactive`: Inactivo (puede regresar)
 * - `withdrawn`: Retirado voluntariamente
 * - `dismissed`: Expulsado/separado de la institución
 */
export type EnrollmentStatus = 'active' | 'completed' | 'transferred' | 'inactive' | 'withdrawn' | 'dismissed'

/**
 * Representa la matrícula de un estudiante en un aula para un año académico.
 * @see database/migrations/2025_06_22_100130_create_enrollments_table.php
 * @see app/Models/Enrollment.php
 */
export type Enrollment = BaseEntity & {
  academic_year: number
  status: EnrollmentStatus
  enrollment_date: string
  start_date: string | null
  end_date: string | null
  notes: string | null
  student_id: number
  classroom_id: number

  // Relaciones
  student?: Student
  classroom?: Classroom
}
