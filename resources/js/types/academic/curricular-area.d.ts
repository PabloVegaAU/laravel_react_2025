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
export interface CurricularArea {
  id: number
  name: string
  description: string
  color: string
  created_at: string
  updated_at: string

  // Relationships
  competencies?: Competency[]
  application_forms?: ApplicationForm[]
  cycles?: Cycle[]
  classrooms?: Classroom[]
  teachers?: Teacher[]
  curricular_area_cycles?: CurricularAreaCycle[]
  teacher_classroom_curricular_area_cycles?: TeacherClassroomCurricularAreaCycle[]
}

/**
 * Tipo para crear un área curricular
 * Basado en el modelo CurricularArea
 */
export type CreateCurricularArea = Omit<
  CurricularArea,
  | 'id'
  | 'created_at'
  | 'updated_at'
  | 'competencies'
  | 'application_forms'
  | 'cycles'
  | 'classrooms'
  | 'teachers'
  | 'curricular_area_cycles'
  | 'teacher_classroom_curricular_area_cycles'
>

/**
 * Tipo para actualizar un área curricular
 * Basado en el modelo CurricularArea
 */
export type UpdateCurricularArea = Partial<CreateCurricularArea>
