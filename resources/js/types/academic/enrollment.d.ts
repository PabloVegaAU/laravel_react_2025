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
export interface Enrollment {
  id: number
  academic_year: number
  status: EnrollmentStatus
  enrollment_date: string
  start_date: string | null
  end_date: string | null
  notes: string | null
  student_id: number
  classroom_id: number
  created_by: string | null
  updated_by: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null

  // Relaciones
  student?: Student
  classroom?: Classroom
}

/**
 * Tipo para crear una nueva matrícula.
 */
export type CreateEnrollment = Omit<Enrollment, 'id' | 'created_at' | 'updated_at' | 'deleted_at' | 'student' | 'classroom'>

/**
 * Tipo para actualizar una matrícula existente.
 */
export type UpdateEnrollment = Partial<CreateEnrollment>
