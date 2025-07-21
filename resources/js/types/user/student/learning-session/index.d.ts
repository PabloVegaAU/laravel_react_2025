import { TeacherClassroomCurricularAreaCycle } from '@/types/academic'
import { ApplicationForm } from '@/types/application-form'

export interface StudentLearningSession {
  id: number
  name: string
  purpose_learning: string
  application_date: string
  status: string
  created_at: string
  updated_at: string
  teacher_classroom_curricular_area_cycle: TeacherClassroomCurricularAreaCycle
  application_form: ApplicationForm | null
}

export interface StudentLearningSessionFilters {
  curricular_area_id?: number
}

export interface CurricularAreaOption {
  id: number
  name: string
}
