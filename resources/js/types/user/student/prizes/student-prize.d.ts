import { Prize } from '@/types/prize'
import { Student } from '../..'

export interface StudentPrize {
  id: number
  student_id: number
  prize_id: number
  exchange_date: string
  claimed: boolean
  claimed_at: string

  // Relationships
  student?: Student
  prize?: Prize
}
