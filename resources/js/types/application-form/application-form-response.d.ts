import { Student } from '../user/student'
import { User } from '../user/user'
import { ApplicationForm } from './application-form'

type ResponseStatus = 'pending' | 'in progress' | 'submitted' | 'in review' | 'graded' | 'returned' | 'late'

/**
 * Represents a student's response to an application form
 * Based on:
 * - Migration: database/migrations/2025_06_22_100340_create_application_form_responses_table.php
 * - Model: app/Models/ApplicationFormResponse.php
 */
export interface ApplicationFormResponse {
  /** Unique identifier */
  id: number

  /** Foreign keys */
  application_form_id: number
  student_id: number

  /** Response data */
  score: number
  status: ResponseStatus

  /** Timestamps */
  started_at: string | null
  submitted_at: string | null
  graded_at: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null

  // Relations
  /** The application form this response is for */
  applicationForm?: ApplicationForm

  /** The student who submitted this response */
  student?: Student & { user?: User }

  /** The answers to each question in the form */
  answers?: ApplicationFormAnswer[]

  /** Feedback provided by the teacher */
  feedback?: ResponseFeedback[]
}

/**
 * Represents a student's answer to a specific question in a form
 */
export interface ApplicationFormAnswer {
  /** The question ID */
  question_id: number

  /** The actual answer (can be string, number, boolean, or array) */
  answer: string | number | boolean | string[] | number[]

  /** Score received for this answer */
  score?: number

  /** Whether the answer is correct (for auto-graded questions) */
  is_correct?: boolean

  /** Feedback specific to this answer */
  feedback?: string

  /** Timestamp when the answer was submitted */
  submitted_at: string
}

/**
 * Feedback provided by a teacher on a response
 */
export interface ResponseFeedback {
  /** The teacher who provided the feedback */
  teacher_id: number

  /** The feedback content */
  content: string

  /** Whether the feedback requires a response */
  requires_response: boolean

  /** Whether the student has responded to the feedback */
  student_responded: boolean

  /** Student's response to the feedback */
  student_response?: string

  /** Timestamp when the feedback was provided */
  created_at: string

  /** Timestamp when the feedback was last updated */
  updated_at: string
}

/**
 * Type for creating a new response
 */
export type CreateApplicationFormResponse = Omit<
  ApplicationFormResponse,
  | 'id'
  | 'score'
  | 'status'
  | 'started_at'
  | 'submitted_at'
  | 'graded_at'
  | 'created_at'
  | 'updated_at'
  | 'deleted_at'
  | 'applicationForm'
  | 'student'
  | 'answers'
  | 'feedback'
> & {
  /** Initial answers to questions */
  answers?: Array<{
    question_id: number
    answer: string | number | boolean | string[] | number[]
  }>
}

/**
 * Type for submitting a response
 */
export type SubmitApplicationFormResponse = {
  /** The response ID */
  id: number

  /** Final answers to submit */
  answers: Array<{
    question_id: number
    answer: string | number | boolean | string[] | number[]
  }>

  /** Optional note with the submission */
  note?: string
}

/**
 * Type for grading a response
 */
export type GradeApplicationFormResponse = {
  /** The response ID */
  id: number

  /** Scores for each question */
  scores: Array<{
    question_id: number
    score: number
    feedback?: string
  }>

  /** Overall feedback */
  overall_feedback?: string

  /** Whether to notify the student */
  notify_student?: boolean
}

/**
 * Type for filtering responses
 */
export interface ApplicationFormResponseFilters {
  application_form_id?: number | ''
  student_id?: number | ''
  status?: ResponseStatus | ''
  min_score?: number | ''
  max_score?: number | ''
  submitted_after?: string
  submitted_before?: string
  graded_after?: string
  graded_before?: string
  search?: string
}
