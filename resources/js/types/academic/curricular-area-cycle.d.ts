import { CurricularArea } from './curricular-area'

/**
 * Representa un ciclo al que pertenece una área curricular
 * Basado en:
 * - Migración: database/migrations/2025_06_22_100065_create_curricular_area_cycles_table.php
 * - Modelo: app/Models/CurricularAreaCycle.php
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
}
