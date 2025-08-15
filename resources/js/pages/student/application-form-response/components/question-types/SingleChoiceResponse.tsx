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

  return (
    <BaseQuestionResponse question={question} selectedOptions={selectedOptions} onOptionSelect={onOptionSelect}>
      <div className='space-y-3'>
        {options.map((option) => {
          const isSelected = selectedOptions.includes(option.id)

          return (
            <ResponseOptionComponent
              key={option.id}
              option={option}
              isSelected={isSelected}
              onClick={() => onOptionSelect(option.id)}
              disabled={disabled}
            />
          )
        })}
      </div>
    </BaseQuestionResponse>
  )
}
