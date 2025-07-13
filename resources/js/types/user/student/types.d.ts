import { Classroom } from '../../academic/classroom'
import { Enrollment } from '../../academic/enrollment'
import { Level } from '../../academic/level'
import { Range } from '../../academic/range'
import { StudentLevelHistory } from '../../academic/student-level-history'
import { Achievement } from '../../achievement/achievement'
import { StudentAchievement } from '../../achievement/student-achievement'
import { ApplicationForm } from '../../application-form/application-form'
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
export interface Student extends User {
  // Clave primaria (user_id)
  user_id: number

  // Claves foráneas
  level_id: number | null
  range_id: number | null

  // Atributos
  entry_date: string
  status: StudentStatus
  experience_achieved: number
  points_store_achieved: number
  points_store: number
  graduation_date: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null

  // Relaciones
  level?: Level | null
  range?: Range | null
  enrollments?: Enrollment[]
  classrooms?: Classroom[]
  achievements?: StudentAchievement[]
  availableAchievements?: Achievement[]
  avatars?: StudentAvatar[]
  backgrounds?: StudentBackground[]
  levelHistory?: StudentLevelHistory[]
  storeRewards?: StudentStoreReward[]
  applicationForms?: ApplicationForm[]
  applicationFormResponses?: ApplicationFormResponse[]

  // Métodos de instancia
  isActive(): boolean
  isGraduated(): boolean
  hasAchievement(achievementId: number): boolean
  hasEnrollment(classroomId: number): boolean
  canAfford(points: number): boolean
  isEligibleForReward(rewardId: number): boolean

  // Atributos calculados
  fullName?: string
  currentClassroom?: Classroom | null
  currentLevel?: Level | null
  currentRange?: Range | null
  progressToNextLevel?: number
  progressToNextRange?: number
  nextLevel?: Level | null
  nextRange?: Range | null
  totalAchievements?: number
  unlockedAchievements?: number
  achievementProgress?: number
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
  points_store_achieved?: number
  points_store?: number
  graduation_date?: string | null
}

/**
 * Tipo para actualizar un estudiante existente
 * @see database/migrations/2025_06_22_100030_create_students_table.php
 */
export type UpdateStudent = Partial<Omit<CreateStudent, 'user_id'>>
