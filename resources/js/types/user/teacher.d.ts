import { Classroom } from '../academic/classroom'
import { CurricularArea } from '../academic/curricular-area'
import { TeacherClassroomCurricularArea } from '../academic/teacher-classroom-area'
import { ApplicationForm } from '../application-form/application-form'
import { User } from './user'

/** Estado del profesor en el sistema */
type TeacherStatus = 'active' | 'inactive' | 'on leave' | 'retired'

/**
 * Representa un profesor en el sistema
 * Basado en:
 * - Migración: database/migrations/2025_06_22_100040_create_teachers_table.php
 * - Modelo: app/Models/Teacher.php
 */
export interface Teacher {
  /** Referencia al usuario (clave primaria) */
  user_id: number

  /** Estado del profesor */
  status: TeacherStatus

  /** Marca de tiempo de creación del registro */
  created_at: string

  /** Marca de tiempo de la última actualización */
  updated_at: string

  /** Marca de tiempo de eliminación lógica (si aplica) */
  deleted_at: string | null

  // Relaciones

  /** Usuario al que pertenece este profesor */
  user?: User

  /** Aulas asignadas a este profesor */
  classrooms?: Classroom[]

  /** Áreas curriculares que puede enseñar este profesor */
  curricularAreas?: CurricularArea[]

  /** Asignaciones de aula-área curricular del profesor */
  teacherClassroomCurricularAreas?: TeacherClassroomCurricularArea[]

  /** Formularios de solicitud creados por este profesor */
  applicationForms?: ApplicationForm[]
}

/**
 * Tipo para crear un nuevo profesor
 */
export type CreateTeacher = Omit<
  Teacher,
  'created_at' | 'updated_at' | 'deleted_at' | 'user' | 'classrooms' | 'curricularAreas' | 'teacherClassroomCurricularAreas' | 'applicationForms'
> & {
  user_id: number // Required when creating a teacher for an existing user
}

/**
 * Tipo para actualizar un profesor existente
 */
export type UpdateTeacher = Partial<Omit<CreateTeacher, 'user_id'>>
