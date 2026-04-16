import type { Capability, Competency, EducationalInstitution, TeacherClassroomCurricularAreaCycle } from '../academic'
import type { ApplicationForm } from '../application-form'

/**
 * Estado de registro de una sesión de aprendizaje
 * @see database/migrations/2025_06_22_100300_create_learning_sessions_table.php
 * @see app/Models/LearningSession.php
 */
export type LearningSessionStatus = 'scheduled' | 'active' | 'finished' | 'canceled'

/**
 * Estado de registro de una sesión de aprendizaje
 * @see database/migrations/2025_06_22_100300_create_learning_sessions_table.php
 * @see app/Models/LearningSession.php
 */
export type LearningSessionRegistrationStatus = 'active' | 'inactive'

/**
 * @see database/migrations/2025_06_22_100300_create_learning_sessions_table.php
 * @see app/Models/LearningSession.php
 */
export interface LearningSession {
  id: number
  name: string
  purpose_learning: string
  start_date: string
  end_date: string
  status: LearningSessionStatus
  registration_status: LearningSessionRegistrationStatus
  performances: string
  start_sequence: string | null
  end_sequence: string | null
  educational_institution_id: number
  teacher_classroom_curricular_area_cycle_id: number
  competency_id: number
  created_at: string
  updated_at: string
  deleted_at: string | null
  deactivated_at: string | null

  // Relaciones
  educational_institution?: EducationalInstitution
  competency?: Competency
  capabilities?: Capability[]
  teacher_classroom_curricular_area_cycle?: TeacherClassroomCurricularAreaCycle
  application_form?: ApplicationForm
}
