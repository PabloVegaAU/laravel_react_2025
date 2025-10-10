import type { BaseEntity } from '@/types/core'
import type { ApplicationForm } from '../application-form'
import type { Teacher } from '../user'
import type { Classroom } from './classroom'
import type { Competency } from './competency'
import type { CurricularAreaCycle } from './curricular-area-cycle'
import type { Cycle } from './cycle'
import type { TeacherClassroomCurricularAreaCycle } from './teacher-classroom-curricular-area-cycle'

/**
 * Representa un área curricular en el sistema educativo
 * @see database/migrations/2025_06_22_100060_create_curricular_areas_table.php
 * @see app/Models/CurricularArea.php
 */
export type CurricularArea = BaseEntity & {
  name: string
  description: string
  color: string

  // Relaciones
  competencies?: Competency[]
  application_forms?: ApplicationForm[]
  cycles?: Cycle[]
  classrooms?: Classroom[]
  teachers?: Teacher[]
  curricular_area_cycles?: CurricularAreaCycle[]
  teacher_classroom_curricular_area_cycles?: TeacherClassroomCurricularAreaCycle[]
}
