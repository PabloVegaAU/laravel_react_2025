import type { Teacher } from '../user/teacher'
import type { Classroom } from './classroom'
import type { Competency } from './competency'
import type { CurricularArea } from './curricular-area'
import type { Cycle } from './cycle'

/**
 * Representa un ciclo al que pertenece una área curricular
 * @see database/migrations/2025_06_22_100065_create_curricular_area_cycles.php
 * @see app/Models/CurricularAreaCycle.php
 */
export type CurricularAreaCycle = {
  id: number
  cycle_id: number
  curricular_area_id: number
  created_at: string
  updated_at: string
  // Relaciones
  cycle?: Cycle
  curricular_area?: CurricularArea
  competencies?: Competency[]
  classrooms?: Classroom[]
  teachers?: Teacher[]
}
