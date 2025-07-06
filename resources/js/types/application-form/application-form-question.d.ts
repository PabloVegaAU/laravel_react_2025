import { Question } from '../question/question'
import { ApplicationForm } from './application-form'
import { ApplicationFormResponseQuestion } from './application-form-response-question'

/**
 * Represents the relationship between an application form and its questions
 * Based on:
 * - Migration: database/migrations/2025_06_22_100350_create_application_form_questions_table.php
 * - Pivot model: app/Models/ApplicationFormQuestion.php
 */
export interface ApplicationFormQuestion {
  /** Unique identifier */
  id: number

  /** Foreign keys */
  application_form_id: number
  question_id: number

  /** Configuration */
  order: number
  score: number
  points_store: number

  /** Timestamps */
  created_at: string
  updated_at: string

  // Relations
  /** The application form this question belongs to */
  applicationForm?: ApplicationForm

  /** The actual question */
  question?: Question

  /** All responses to this specific question in the form */
  responseQuestions?: ApplicationFormResponseQuestion[]
}

/**
 * Type for creating a new application form question relationship
 */
export type CreateApplicationFormQuestion = Omit<
  ApplicationFormQuestion,
  'id' | 'created_at' | 'updated_at' | 'applicationForm' | 'question' | 'responseQuestions'
>

/**
 * Type for updating an existing application form question relationship
 */
export type UpdateApplicationFormQuestion = Partial<Omit<CreateApplicationFormQuestion, 'application_form_id' | 'question_id'>> & {
  /** New order position (if changing) */
  order?: number

  /** New score (if changing) */
  score?: number

  /** New store points (if changing) */
  points_store?: number
}

/**
 * Type for reordering questions in a form
 */
export interface ReorderApplicationFormQuestions {
  /** Array of question IDs in their new order */
  question_ids: number[]

  /** Optional: new scores for questions */
  scores?: Record<number, number>

  /** Optional: new store points for questions */
  points_store?: Record<number, number>
}

/**
 * Type for bulk updating application form questions
 */
export interface BulkUpdateApplicationFormQuestions {
  /** Array of question updates */
  updates: Array<{
    id: number
    order?: number
    score?: number
    points_store?: number
  }>
}
