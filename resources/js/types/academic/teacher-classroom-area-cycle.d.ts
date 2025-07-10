import { ApplicationForm } from '../../application-form/form'
import { Teacher } from '../user/teacher'
import { Classroom } from './classroom'
import { CurricularArea } from './curricular-area'
import { CurricularAreaCycle } from './curricular_area_cycle'

/**
 * Relación entre profesor, aula y área curricular
 * Basado en:
 * - Migración: database/migrations/2025_06_22_100150_create_teacher_classroom_curricular_area_cycles_table.php
 * - Modelo: app/Models/TeacherClassroomCurricularAreaCycle.php
 */
export interface TeacherClassroomCurricularAreaCycle {
  /** ID único */
  id: number

  /** ID del profesor */
  teacher_id: number

  /** ID del aula */
  classroom_id: number

  /** ID del área curricular */
  curricular_area_id: number

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

  /** Área curricular */
  curricular_area_cycle?: CurricularAreaCycle

  /** Formularios de aplicación asociados */
  application_forms?: ApplicationForm[]
}

/**
 * Tipo para crear una asignación profesor-aula-área
 * Basado en el modelo TeacherClassroomCurricularArea
 */
export interface CreateTeacherClassroomCurricularArea extends Omit<TeacherClassroomCurricularArea, 'id' | 'created_at' | 'updated_at'> {}

/**
 * Tipo para actualizar una asignación profesor-aula-área
 * Basado en el modelo TeacherClassroomCurricularArea
 */
export type UpdateTeacherClassroomCurricularArea = Partial<CreateTeacherClassroomCurricularArea>
