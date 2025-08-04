import { Profile } from '@/types/auth'
import { Classroom } from '../../academic/classroom'
import { Enrollment } from '../../academic/enrollment'
import { Level } from '../../academic/level'
import { Range } from '../../academic/range'
import { StudentLevelHistory } from '../../academic/student-level-history'
import { StudentAchievement } from '../../achievement/student-achievement'
import { ApplicationFormResponse } from '../../application-form/form/response/application-form-response'
import { StudentStoreReward } from '../../store/student-store-reward'
import { User } from '../user'
import { StudentAvatar } from './avatar/student-avatar'
import { StudentBackground } from './background/student-background'

type StudentStatus = 'active' | 'inactive' | 'suspended' | 'graduated' | 'withdrawn'

/**
 * Representa un estudiante en el sistema
 * @see database/migrations/2025_06_22_100030_create_students_table.php
 * @see app/Models/Student.php
 */
export interface Student {
  user_id: number
  level_id: number | null
  range_id: number | null
  entry_date: string
  status: StudentStatus
  experience_achieved: number
  points_store: number
  graduation_date: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null

  // Relationships
  user?: User
  level?: Level | null
  range?: Range | null
  enrollments?: Enrollment[]
  classrooms?: Classroom[]
  achievements?: StudentAchievement[]
  avatars?: StudentAvatar[]
  backgrounds?: StudentBackground[]
  levelHistory?: StudentLevelHistory[]
  storeRewards?: StudentStoreReward[]
  applicationFormResponses?: ApplicationFormResponse[]
  profile?: Profile
}

/**
 * Tipo para crear un nuevo estudiante
 * @see database/migrations/2025_06_22_100030_create_students_table.php
 */
export interface CreateStudent {
  user_id: number
  level_id: number
  range_id: number
  entry_date: string
  status?: StudentStatus
  experience_achieved?: number
  points_store?: number
  graduation_date?: string | null
}

/**
 * Tipo para actualizar un estudiante existente
 * @see database/migrations/2025_06_22_100030_create_students_table.php
 */
export type UpdateStudent = Partial<Omit<CreateStudent, 'user_id'>>
