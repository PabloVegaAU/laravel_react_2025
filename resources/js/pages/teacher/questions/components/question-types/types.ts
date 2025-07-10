import { CreateQuestionOption, QuestionType } from '@/types/question'

// Propiedades para tipos de pregunta
export interface QuestionTypeProps {
  options: CreateQuestionOption[]
  onChange: (options: CreateQuestionOption[]) => void
  disabled?: boolean
}

export const QUESTION_TYPES: Record<string, string> = {
  'Opción Múltiple': '1',
  'Verdadero/Falso': '2',
  Emparejamiento: '3',
  Ordenamiento: '4'
} as const

export type QuestionTypeKey = keyof typeof QUESTION_TYPES
export type QuestionTypeValue = (typeof QUESTION_TYPES)[QuestionTypeKey]

// Helper function to get question type name by ID
export function getQuestionTypeNameById(id: string, questionTypes: QuestionType[]): string {
  const type = questionTypes.find((t) => t.id.toString() === id)
  return type?.name || 'Desconocido'
}

// Helper to get default options for a question type
export function getDefaultOptions(typeId: string): CreateQuestionOption[] {
  const baseOption = {
    correct_order: 0,
    pair_key: null,
    pair_side: null,
    feedback: null
  }

  switch (typeId) {
    case '1': // Opción Múltiple
      return [
        { ...baseOption, value: 'Opción 1', is_correct: true, order: 1, score: 1 },
        { ...baseOption, value: 'Opción 2', is_correct: false, order: 2, score: 0 }
      ]
    case '2': // Verdadero/Falso
      return [
        { ...baseOption, value: 'Verdadero', is_correct: true, order: 1, score: 1 },
        { ...baseOption, value: 'Falso', is_correct: false, order: 2, score: 0 }
      ]
    case '3': // Emparejamiento
      return [
        { ...baseOption, value: 'Opción A', pair_key: '1', pair_side: 'left', is_correct: true, order: 1, score: 1 },
        { ...baseOption, value: 'Opción 1', pair_key: '1', pair_side: 'right', is_correct: true, order: 2, score: 1 },
        { ...baseOption, value: 'Opción B', pair_key: '2', pair_side: 'left', is_correct: true, order: 3, score: 1 },
        { ...baseOption, value: 'Opción 2', pair_key: '2', pair_side: 'right', is_correct: true, order: 4, score: 1 }
      ]
    case '4': // Ordenamiento
      return [
        { ...baseOption, value: 'Primer paso', is_correct: true, order: 1, correct_order: 1, score: 1 },
        { ...baseOption, value: 'Segundo paso', is_correct: true, order: 2, correct_order: 2, score: 1 },
        { ...baseOption, value: 'Tercer paso', is_correct: true, order: 3, correct_order: 3, score: 1 }
      ]
    default:
      return []
  }
}
