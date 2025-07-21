import type { CurricularArea } from './curricular-area'
import type { CurricularAreaCycle } from './curricular-area-cycle'
import type { TeacherClassroomCurricularAreaCycle } from './teacher-classroom-curricular-area-cycle'

/**
 * Representa un ciclo educativo en el sistema
 * @see database/migrations/2025_06_22_100050_create_cycles_table.php
 * @see app/Models/Cycle.php
 */
export interface Cycle {
  /** ID único */
  id: number

  /** Nombre del ciclo (ej: 'I', 'II', 'III') */
  name: string

  /** Orden de visualización */
  order: number

  /** Fecha de creación */
  created_at: string

  /** Fecha de actualización */
  updated_at: string

  /** Fecha de eliminación (si aplica) */
  deleted_at: string | null

  // Relaciones

  /** Áreas curriculares en este ciclo */
  curricular_areas?: CurricularArea[]

  /** Ciclos de áreas curriculares asociados */
  curricular_area_cycles?: CurricularAreaCycle[]

  /** Docentes en este ciclo */
  teacher_classroom_curricular_area_cycles?: TeacherClassroomCurricularAreaCycle[]
}

/**
 * Tipo para crear un nuevo ciclo
 * Basado en el modelo Cycle
 */
export type CreateCycle = Omit<
  Cycle,
  'id' | 'created_at' | 'updated_at' | 'deleted_at' | 'curricular_areas' | 'curricular_area_cycles' | 'teacher_classroom_curricular_area_cycles'
>

/**
 * Tipo para actualizar un ciclo existente
 * Basado en el modelo Cycle
 */
export type UpdateCycle = Partial<CreateCycle>
