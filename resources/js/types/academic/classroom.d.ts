import { Enrollment } from '../enrollment'
import { Student } from '../user/student'
import { Teacher } from '../user/teacher'
import { Cycle } from './cycle'
import { TeacherClassroomCurricularArea } from './teacher-classroom-area-cycle'

/**
 * Representa un aula en la institución educativa
 * Basado en:
 * - Migración: database/migrations/2025_06_22_100120_create_classrooms_table.php
 * - Modelo: app/Models/Classroom.php
 */
export interface Classroom {
  /** ID único */
  id: number

  /** Nivel de grado (ej: '1ro', '2do') */
  grade: string

  /** Sección (ej: 'A', 'B', 'C') */
  section: string

  /** Nivel educativo (primaria/secundaria) */
  level: 'primary' | 'secondary'

  /** Año académico (ej: 2025) */
  academic_year: number

  /** Fecha de creación */
  created_at: string

  /** Fecha de actualización */
  updated_at: string

  /** Fecha de eliminación (si aplica) */
  deleted_at: string | null

  // Relaciones

  /** Ciclo al que pertenece el aula */
  cycle?: Cycle

  /** Matrículas en este aula */
  enrollments?: Enrollment[]

  /** Estudiantes matriculados */
  students?: Student[]

  /** Profesores asignados */
  teachers?: Teacher[]

  /** Asignaciones de profesor-aula-área */
  teacherClassroomCurricularAreas?: TeacherClassroomCurricularArea[]
}

/**
 * Tipo para crear un nuevo aula
 */
export type CreateClassroom = Omit<
  Classroom,
  'id' | 'created_at' | 'updated_at' | 'deleted_at' | 'cycle' | 'enrollments' | 'students' | 'teachers' | 'teacherClassroomCurricularAreas'
>

/**
 * Tipo para actualizar un aula existente
 */
export type UpdateClassroom = Partial<CreateClassroom>
