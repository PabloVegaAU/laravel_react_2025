import { ApplicationForm } from '../application-form'
import { LearningSession } from '../learning-session'
import { Teacher } from '../user'
import { Classroom } from './classroom'
import { CurricularAreaCycle } from './curricular-area-cycle'

/**
 * Relación entre profesor, aula y área curricular
 * @see database/migrations/2025_06_22_100150_create_teacher_classroom_curricular_area_cycles_table.php
 * @see app/Models/TeacherClassroomCurricularAreaCycle.php
 */
export interface TeacherClassroomCurricularAreaCycle {
  /** ID único */
  id: number

  /** ID del profesor */
  teacher_id: number

  /** ID del aula */
  classroom_id: number

  /** ID del área curricular ciclo */
  curricular_area_cycle_id: number

  /** Año académico */
  academic_year: number

  /** Fecha de creación */
  created_at: string

  /** Fecha de actualización */
  updated_at: string

  // Relaciones

  /** Profesor asignado */
  teacher?: Teacher

  /** Aula asignada */
  classroom?: Classroom

  /** Área curricular del ciclo */
  curricular_area_cycle?: CurricularAreaCycle

  /** Área curricular (acceso directo) */
  curricular_area?: CurricularAreaCycle['curricular_area']

  /** Formularios de aplicación asociados */
  application_forms?: ApplicationForm[]

  /** Sesiones de aprendizaje asociadas */
  learning_sessions?: LearningSession[]
}

/**
 * Tipo para crear una asignación profesor-aula-área
 * Basado en el modelo TeacherClassroomCurricularAreaCycle
 */
export type CreateTeacherClassroomCurricularAreaCycle = Omit<
  TeacherClassroomCurricularAreaCycle,
  | 'id'
  | 'created_at'
  | 'updated_at'
  | 'teacher'
  | 'classroom'
  | 'curricular_area_cycle'
  | 'curricular_area'
  | 'application_forms'
  | 'learning_sessions'
>

/**
 * Tipo para actualizar una asignación profesor-aula-área
 * Basado en el modelo TeacherClassroomCurricularAreaCycle
 */
export type UpdateTeacherClassroomCurricularAreaCycle = Partial<CreateTeacherClassroomCurricularAreaCycle>
