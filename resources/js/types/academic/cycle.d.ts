import { Classroom } from './classroom'
import { CurricularArea } from './curricular-area'

/**
 * Representa un ciclo educativo en el sistema
 * Basado en:
 * - Migración: database/migrations/2025_06_22_100050_create_cycles_table.php
 * - Modelo: app/Models/Cycle.php
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

  /** Aulas en este ciclo */
  classrooms?: Classroom[]

  /** Áreas curriculares en este ciclo */
  curricular_areas?: CurricularArea[]
}

/**
 * Tipo para crear un nuevo ciclo
 * Basado en el modelo Cycle
 */
export interface CreateCycle extends Omit<Cycle, 'id' | 'created_at' | 'updated_at' | 'deleted_at' | 'classrooms' | 'curricular_areas'> {}

/**
 * Tipo para actualizar un ciclo existente
 * Basado en el modelo Cycle
 */
export type UpdateCycle = Partial<CreateCycle>
