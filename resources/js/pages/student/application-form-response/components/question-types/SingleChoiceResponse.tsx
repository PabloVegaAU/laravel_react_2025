import { ApplicationFormResponseQuestion } from '@/types/application-form/form/response/application-form-response-question'
import { BaseQuestionResponse, ResponseOption as ResponseOptionComponent } from './BaseQuestionResponse'

interface SingleChoiceResponseProps {
  question: ApplicationFormResponseQuestion
  selectedOptions: number[]
  onOptionSelect: (optionId: number) => void
  disabled?: boolean
}

// Componente de pregunta de opción única
export function SingleChoiceResponse({ question, selectedOptions, onOptionSelect, disabled = false }: SingleChoiceResponseProps) {
  const options = question.application_form_question.question?.options || []
  const isGraded = question.status !== 'pending'

  // Verificar si la opción es correcta (solo para preguntas calificadas)
  const isOptionCorrect = (optionId: number): boolean => {
    if (!isGraded) return false
    return question.selected_options.some((opt) => opt.question_option_id === optionId && opt.is_correct)
  }

  return (
    <BaseQuestionResponse question={question} selectedOptions={selectedOptions} onOptionSelect={onOptionSelect}>
      <div className='space-y-3'>
        {options.map((option) => {
          const isSelected = selectedOptions.includes(option.id)
          const isCorrect = isOptionCorrect(option.id)

          return (
            <ResponseOptionComponent
              key={option.id}
              option={option}
              isSelected={isSelected}
              isCorrect={isCorrect}
              onClick={() => onOptionSelect(option.id)}
              disabled={disabled || isGraded}
            />
          )
        })}
      </div>

      {question.explanation && (
        <div className='mt-4 rounded-md bg-blue-50 p-4 text-sm text-blue-800'>
          <p className='font-medium'>Tu explicación:</p>
          <p className='mt-1'>{question.explanation}</p>
        </div>
      )}
    </BaseQuestionResponse>
  )
}
