import { Classroom } from '../../academic/classroom'
import { CurricularArea } from '../../academic/curricular-area'
import { CurricularAreaCycle } from '../../academic/curricular-area-cycle'
import { TeacherClassroomCurricularAreaCycle } from '../../academic/teacher-classroom-area-cycle'
import { ApplicationForm } from '../../application-form/application-form'
import { LearningSession } from '../../learning-session/learning-session'
import { User } from '../user'

type TeacherStatus = 'active' | 'inactive' | 'on leave' | 'retired'

/**
 * Representa un profesor en el sistema
 * @see database/migrations/2025_06_22_100040_create_teachers_table.php
 * @see app/Models/Teacher.php
 */
export interface Teacher {
  // Clave primaria (user_id)
  user_id: number

  // Atributos
  status: TeacherStatus
  created_at: string
  updated_at: string
  deleted_at: string | null

  // Relaciones
  user?: User
  classrooms?: Classroom[]
  curricularAreas?: CurricularArea[]
  curricularAreaCycles?: CurricularAreaCycle[]
  teacherClassroomCurricularAreaCycles?: TeacherClassroomCurricularAreaCycle[]
  applicationForms?: ApplicationForm[]
  learningSessions?: LearningSession[]

  // Métodos de utilidad
  isActive(): boolean

  /** Formularios de solicitud creados por este profesor */
  application_forms?: ApplicationForm[]

  /** Sesiones de aprendizaje creadas por este profesor */
  learning_sessions?: LearningSession[]

  // Métodos
  /** Verifica si el profesor está activo */
  isActive?: () => boolean

  // Scopes (tipos para consultas)
  active?: boolean
  inactive?: boolean
  onLeave?: boolean
  retired?: boolean
}

/**
 * Tipo para crear un nuevo profesor
 * @see database/migrations/2025_06_22_100040_create_teachers_table.php
 */
export interface CreateTeacher {
  user_id: number
  status?: TeacherStatus
}

/**
 * Tipo para actualizar un profesor existente
 * @see database/migrations/2025_06_22_100040_create_teachers_table.php
 */
export type UpdateTeacher = Partial<Omit<CreateTeacher, 'user_id'>>
