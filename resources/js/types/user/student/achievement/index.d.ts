import type { Achievement } from '../achievement/achievement'
import type { Student } from '../user/student'

/**
 * @see database/migrations/2025_06_22_100200_create_student_achievements_table.php
 * @see app/Models/StudentAchievement.php
 */
export interface StudentAchievement {
  id: number
  student_id: number
  achievement_id: number
  achieved_at: string

  // Relationships
  student?: Student
  achievement?: Achievement
}
