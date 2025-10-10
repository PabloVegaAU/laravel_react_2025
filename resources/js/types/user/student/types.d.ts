import { Profile } from '@/types/auth'
import { Timestamps } from '@/types/core'
import { Classroom } from '../../academic/classroom'
import { Enrollment } from '../../academic/enrollment'
import { Level } from '../../academic/level'
import { Range } from '../../academic/range'
import { StudentLevelHistory } from '../../academic/student-level-history'
import { StudentAchievement } from '../../achievement/student-achievement'
import { ApplicationFormResponse } from '../../application-form/form/response/application-form-response'
import { User } from '../user'
import { StudentAvatar } from './avatar/student-avatar'
import { StudentBackground } from './background/student-background'
import { StudentPrize } from './prize/student-prize'

type StudentStatus = 'active' | 'inactive' | 'suspended' | 'graduated' | 'withdrawn'

/**
 * Representa un estudiante en el sistema
 * @see database/migrations/2025_06_22_100030_create_students_table.php
 * @see app/Models/Student.php
 */
export type Student = Timestamps & {
  user_id: number
  level_id: number
  range_id: number
  entry_date: string
  status: StudentStatus
  experience_achieved: number
  points_store: number
  graduation_date: string | null

  // Relaciones
  user?: User
  level?: Level | null
  range?: Range | null
  enrollments?: Enrollment[]
  classrooms?: Classroom[]
  achievements?: StudentAchievement[]
  avatars?: StudentAvatar[]
  backgrounds?: StudentBackground[]
  levelHistory?: StudentLevelHistory[]
  prizes?: StudentPrize[]
  applicationFormResponses?: ApplicationFormResponse[]
  profile?: Profile
}

/**
 * Tipo para crear un nuevo estudiante
 * @see database/migrations/2025_06_22_100030_create_students_table.php
 */
export type CreateStudent = {
  /* USER */
  name: string
  password: string
  /* PROFILE */
  email: string
  firstName: string
  lastName: string
  secondLastName: string
  birthDate: string
  phone: string
  /* STUDENT */
  entryDate: string
}

/**
 * Tipo para actualizar un estudiante existente
 * @see database/migrations/2025_06_22_100030_create_students_table.php
 */
type UpdateStudent = Partial<CreateStudent>
