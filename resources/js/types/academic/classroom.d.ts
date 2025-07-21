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
export interface Classroom {
  // Fields
  id: number
  grade: string
  section: string
  level: 'primary' | 'secondary'
  academic_year: number
  created_at: string
  updated_at: string
  deleted_at: string | null

  // Relationships
  teachers?: Array<Teacher & { pivot: { curricular_area_cycle_id: number; academic_year: number } }>
  enrollments?: Enrollment[]
  students?: Student[]
  teacherClassroomCurricularAreaCycles?: TeacherClassroomCurricularAreaCycle[]
  curricularAreaCycles?: Array<CurricularAreaCycle & { pivot: { teacher_id: number; academic_year: number } }>
  learningSessions?: LearningSession[]
  applicationForms?: ApplicationForm[]
}

/**
 * Datos para crear un aula
 * @see database/migrations/2025_06_22_100120_create_classrooms_table.php
 */
export interface CreateClassroomData {
  grade: string
  section: string
  level: 'primary' | 'secondary'
  academic_year: number
}

/**
 * Datos para actualizar un aula
 * @see database/migrations/2025_06_22_100120_create_classrooms_table.php
 */
export type UpdateClassroomData = Partial<CreateClassroomData>

/**
 * Filtros para buscar aulas
 * @see app/Models/Classroom.php
 */
export interface ClassroomFilters {
  level?: 'primary' | 'secondary'
  academic_year?: number
  teacher_id?: number
  student_id?: number
  curricular_area_id?: number
  cycle_id?: number
  search?: string
  with_trashed?: boolean
  only_trashed?: boolean
  per_page?: number
  page?: number
}

/**
 * Datos para asignar un profesor a un aula
 * @see app/Models/TeacherClassroomCurricularAreaCycle.php
 */
export interface AssignTeacherToClassroomData {
  teacher_id: number
  classroom_id: number
  curricular_area_cycle_id: number
  academic_year: number
}

/**
 * Datos para matricular un estudiante en un aula
 * @see app/Models/Enrollment.php
 */
export interface EnrollStudentData {
  student_id: number
  classroom_id: number
  enrollment_date: string
  status?: 'active' | 'inactive' | 'graduated' | 'transferred'
  notes?: string
}
