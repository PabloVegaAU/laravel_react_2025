import type { LearningSession } from '../learning-session'
import type { Teacher } from '../user'
import type { Classroom } from './classroom'
import type { CurricularAreaCycle } from './curricular-area-cycle'

/**
 * Representa la asignación de un profesor a un aula para un área curricular y ciclo específicos.
 * @see database/migrations/2025_06_22_100150_create_teacher_classroom_curricular_area_cycles_table.php
 * @see app/Models/TeacherClassroomCurricularAreaCycle.php
 */
export interface TeacherClassroomCurricularAreaCycle {
  id: number
  teacher_id: number
  classroom_id: number
  curricular_area_cycle_id: number
  academic_year: number
  created_at: string
  updated_at: string

  // Relaciones (cargadas dinámicamente)
  teacher?: Teacher
  classroom?: Classroom
  curricular_area_cycle?: CurricularAreaCycle
  learningSessions?: LearningSession[]

  // Acceso directo a través de relaciones anidadas (si se carga)
  curricular_area?: CurricularAreaCycle['curricular_area']
}

/**
 * Tipo para crear una nueva asignación.
 */
export type CreateTeacherClassroomCurricularAreaCycle = Omit<
  TeacherClassroomCurricularAreaCycle,
  'id' | 'created_at' | 'updated_at' | 'teacher' | 'classroom' | 'curricular_area_cycle' | 'learningSessions' | 'curricular_area'
>

/**
 * Tipo para actualizar una asignación existente.
 */
export type UpdateTeacherClassroomCurricularAreaCycle = Partial<CreateTeacherClassroomCurricularAreaCycle>
