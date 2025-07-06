import { ApplicationForm } from '../../application-form/form'
import { Competency } from '../question/competency'
import { Teacher } from '../user/teacher'
import { Classroom } from './classroom'
import { Cycle } from './cycle'

/**
 * Representa un área curricular en el sistema educativo
 * Basado en:
 * - Migración: database/migrations/2025_06_22_100060_create_curricular_areas_table.php
 * - Modelo: app/Models/CurricularArea.php
 */
export interface CurricularArea {
  /** ID único */
  id: number

  /** ID del ciclo al que pertenece */
  cycle_id: number

  /** Nombre del área curricular */
  name: string

  /** Descripción del área */
  description: string

  /** Código de color para la UI */
  color: string

  /** Fecha de creación */
  created_at: string

  /** Fecha de actualización */
  updated_at: string

  // Relaciones

  /** Ciclo al que pertenece */
  cycle?: Cycle

  /** Competencias en esta área */
  competencies?: Competency[]

  /** Formularios de aplicación asociados */
  application_forms?: ApplicationForm[]

  /** Aulas donde se enseña esta área */
  classrooms?: Classroom[]

  /** Profesores que enseñan esta área */
  teachers?: Teacher[]
}

/**
 * Tipo para crear un área curricular
 * Basado en el modelo CurricularArea
 */
export interface CreateCurricularArea
  extends Omit<CurricularArea, 'id' | 'created_at' | 'updated_at' | 'cycle' | 'competencies' | 'application_forms' | 'classrooms' | 'teachers'> {
  cycle_id: number
}

/**
 * Tipo para actualizar un área curricular
 * Basado en el modelo CurricularArea
 */
export type UpdateCurricularArea = Partial<CreateCurricularArea>
