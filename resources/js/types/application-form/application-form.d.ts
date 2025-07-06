import { Classroom } from '../academic/classroom'
import { CurricularArea } from '../academic/curricular-area'
import { TeacherClassroomCurricularArea } from '../academic/teacher-classroom-area'
import { LearningSession } from '../learning/learning-session'
import { Teacher } from '../user/teacher'
import { ApplicationFormQuestion } from './application-form-question'
import { ApplicationFormResponse } from './application-form-response'

type ApplicationFormStatus = 'draft' | 'scheduled' | 'active' | 'inactive' | 'archived'

/**
 * Represents an application form in the system
 * Based on:
 * - Migration: database/migrations/2025_06_22_100330_create_application_forms_table.php
 * - Model: app/Models/ApplicationForm.php
 */
export interface ApplicationForm {
  /** Unique identifier */
  id: number

  /** Basic information */
  name: string
  description: string

  /** Status information */
  status: ApplicationFormStatus
  score_max: number
  start_date: string // ISO date string
  end_date: string // ISO date string

  /** Timestamps */
  created_at: string
  updated_at: string
  deleted_at: string | null

  // Foreign keys
  teacher_classroom_curricular_area_id: number
  teacher_id: number
  learning_session_id: number

  // Relations
  /** The teacher-classroom-curricular area assignment */
  teacherClassroomCurricularArea?: TeacherClassroomCurricularArea

  /** The teacher who created this form */
  teacher?: Teacher

  /** The learning session this form is associated with */
  learningSession?: LearningSession

  /** Questions in this form */
  questions?: ApplicationFormQuestion[]

  /** Responses to this form */
  responses?: ApplicationFormResponse[]

  /** Classroom this form is assigned to (via teacherClassroomCurricularArea) */
  classroom?: Classroom

  /** Curricular area this form is for (via teacherClassroomCurricularArea) */
  curricularArea?: CurricularArea
}

/**
 * Type for creating a new application form
 */
export type CreateApplicationForm = Omit<
  ApplicationForm,
  | 'id'
  | 'created_at'
  | 'updated_at'
  | 'deleted_at'
  | 'teacherClassroomCurricularArea'
  | 'teacher'
  | 'learningSession'
  | 'questions'
  | 'responses'
  | 'classroom'
  | 'curricularArea'
> & {
  /** Array of question IDs to associate with this form */
  question_ids?: number[]
}

/**
 * Type for updating an existing application form
 */
export type UpdateApplicationForm = Partial<
  Omit<CreateApplicationForm, 'teacher_classroom_curricular_area_id' | 'teacher_id' | 'learning_session_id'>
> & {
  /** Array of question IDs to update the form's questions */
  question_ids?: number[]
}

/**
 * Type for application form statistics
 */
export interface ApplicationFormStats {
  total_questions: number
  total_responses: number
  average_score: number | null
  completion_rate: number
  status_distribution: {
    draft: number
    scheduled: number
    active: number
    inactive: number
    archived: number
  }
  recent_activity: {
    date: string
    action: string
    details: string
  }[]
}

/**
 * Type for filtering application forms
 */
export interface ApplicationFormFilters {
  status?: ApplicationFormStatus | ''
  teacher_id?: number | ''
  classroom_id?: number | ''
  curricular_area_id?: number | ''
  date_from?: string
  date_to?: string
  search?: string
}

/**
 * Type for application form submission
 */
export interface SubmitApplicationFormData {
  form_id: number
  student_id: number
  responses: {
    question_id: number
    answer: string | number | boolean | string[] | number[]
  }[]
}
