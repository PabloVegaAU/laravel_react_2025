import type { Competency } from '../academic/competency'
import type { EducationalInstitution } from '../academic/educational-institution'
import type { TeacherClassroomCurricularAreaCycle } from '../academic/teacher-classroom-curricular-area-cycle'
import type { ApplicationForm } from '../application-form/application-form'

export interface LearningSession {
  id: number
  name: string
  purpose_learning: string
  application_date: string | Date
  status: string
  performances: string
  start_sequence: string | null
  end_sequence: string | null
  educational_institution_id: number
  teacher_classroom_curricular_area_cycle_id: number
  competency_id: number
  created_at: string
  updated_at: string
  deleted_at: string | null

  // Relationships
  educational_institution?: EducationalInstitution
  competency?: Competency
  capabilities?: Capability[]
  teacher_classroom_curricular_area_cycle?: TeacherClassroomCurricularAreaCycle
  application_forms?: ApplicationForm[]
}
