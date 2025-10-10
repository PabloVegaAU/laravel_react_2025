import type { BaseEntity, Timestamps } from '@/types/core'
import type { ApplicationForm } from '../application-form/application-form'
import type { LearningSession } from '../learning-session'
import type { Student } from '../user/student'
import type { Teacher } from '../user/teacher'
import type { CurricularAreaCycle } from './curricular-area-cycle'
import type { Enrollment } from './enrollment'
import type { TeacherClassroomCurricularAreaCycle } from './teacher-classroom-curricular-area-cycle'

/**
 * Representa un aula en la institución educativa
 * @see database/migrations/2025_06_22_100120_create_classrooms_table.php
 * @see app/Models/Classroom.php
 */
export type Classroom = BaseEntity & {
  // Fields
  grade: string
  section: string
  level: 'primary' | 'secondary'
  academic_year: number

  // Relaciones
  teachers?: Array<Teacher & { pivot: { curricular_area_cycle_id: number; academic_year: number } }>
  enrollments?: Enrollment[]
  students?: Student[]
  teacherClassroomCurricularAreaCycles?: TeacherClassroomCurricularAreaCycle[]
  curricularAreaCycles?: Array<CurricularAreaCycle & { pivot: { teacher_id: number; academic_year: number } }>
  learningSessions?: LearningSession[]
  applicationForms?: ApplicationForm[]
}
