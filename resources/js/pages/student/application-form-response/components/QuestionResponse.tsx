import { ApplicationFormResponseQuestion } from '@/types/application-form'
import { ResponseAnswer } from '@/types/application-form/form/response'
import { MatchingResponse } from './question-types/MatchingResponse'
import { OrderingResponse } from './question-types/OrderingResponse'
import { SingleChoiceResponse } from './question-types/SingleChoiceResponse'
import { TrueFalseResponse } from './question-types/TrueFalseResponse'

interface QuestionResponseProps {
  question: ApplicationFormResponseQuestion
  response: ResponseAnswer
  onOptionSelect?: (optionId: number) => void
  onReorder: (optionIds: number[]) => void
  onMatchingPairSelect: (leftId: number, rightId: number | null) => void
  disabled?: boolean
  onExplanationChange?: (explanation: string) => void
  error?: string
}

export function QuestionResponse({
  question,
  response,
  onOptionSelect,
  onReorder,
  onMatchingPairSelect,
  disabled = false,
  onExplanationChange,
  error
}: QuestionResponseProps) {
  const questionType = question.application_form_question.question.question_type.id

  switch (questionType) {
    case 1: // Pregunta unica
      if (!onOptionSelect) return <div>Error: onOptionSelect no fue proporcionado.</div>
      return (
        <SingleChoiceResponse question={question} selectedOptions={response.selected_options} onOptionSelect={onOptionSelect} disabled={disabled} />
      )
    case 2: // Ordenamiento
      return <OrderingResponse question={question} order={response.order || []} onOrderChange={onReorder} disabled={disabled} />
    case 3: // Emparejamiento
      return (
        <MatchingResponse
          question={question}
          pairs={response.pairs || {}}
          onPairSelect={(leftOptionId, rightOptionId) => onMatchingPairSelect(leftOptionId, rightOptionId)}
          disabled={disabled}
        />
      )
    case 4: // Verdadero o falso
      if (!onOptionSelect) return <div>Error: onOptionSelect no fue proporcionado.</div>
      return <TrueFalseResponse question={question} selectedOptions={response.selected_options} onOptionSelect={onOptionSelect} disabled={disabled} />
    case 5:
      return null
    default:
      return <div>Tipo de pregunta no soportado.</div>
  }
}
