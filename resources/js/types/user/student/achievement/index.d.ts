import type { Achievement } from '../achievement/achievement'
import type { Student } from '../user/student'

export interface StudentAchievement {
  id: number
  student_id: number
  achievement_id: number
  achieved_at: string

  // Relationships
  student?: Student
  achievement?: Achievement
}
