// Tipos base
export * from './types'

// Módulos de estudiante
export * from './achievement'
export * from './avatar'
export * from './background'

// Progreso
export * from './progress/level'
export * from './progress/reward'

// Re-exportar tipos útiles
export type { AchievementProgress, AchievementUnlockedResponse, StudentAchievement, UnlockAchievementData } from './achievement'
export type { ActiveAvatarResponse, AssignAvatarData, StudentAvatar, UpdateActiveAvatarData } from './avatar'
export type { ActiveBackgroundResponse, AssignBackgroundData, StudentBackground, UpdateActiveBackgroundData } from './background'
export type { StudentPrize } from './prizes/student-prize'
export type { ExperienceUpdatedResponse, StudentLevelHistory, StudentLevelProgress, UpdateStudentExperienceData } from './progress/level'
export type { Student, StudentBase, StudentFilters, StudentFormData } from './types'
