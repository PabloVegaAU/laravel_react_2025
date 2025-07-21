import { cn } from '@/lib/utils'
import { ApplicationFormResponseQuestion, QuestionOption } from '@/types/application-form'
import { BaseQuestionResponse, ResponseOption as ResponseOptionComponent } from './BaseQuestionResponse'

interface TrueFalseResponseProps {
  question: ApplicationFormResponseQuestion
  selectedOptions: number[]
  onOptionSelect: (optionId: number) => void
  disabled?: boolean
}

// Componente de pregunta Verdadero/Falso
export function TrueFalseResponse({ question, selectedOptions, onOptionSelect, disabled = false }: TrueFalseResponseProps) {
  const options = question.application_form_question.question?.options || []
  const isGraded = question.status === 'graded'

  // Verificar si la opción es correcta
  const isOptionCorrect = (optionId: number): boolean => {
    if (!isGraded) return false
    return question.selected_options.some(
      (opt: { question_option_id: number; is_correct: boolean }) => opt.question_option_id === optionId && opt.is_correct
    )
  }

  // Obtener opciones Verdadero/Falso
  const trueOption = options.find((opt: QuestionOption) => opt.value.toLowerCase() === 'verdadero' || opt.value.toLowerCase() === 'true')

  const falseOption = options.find((opt: QuestionOption) => opt.value.toLowerCase() === 'falso' || opt.value.toLowerCase() === 'false')

  // Usar opciones normales si no se encuentran Verdadero/Falso
  const displayOptions: QuestionOption[] = trueOption && falseOption ? [trueOption, falseOption] : options

  return (
    <BaseQuestionResponse question={question} selectedOptions={selectedOptions} onOptionSelect={onOptionSelect}>
      <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
        {displayOptions.map((option: QuestionOption) => {
          const isSelected = selectedOptions.includes(option.id)
          const isCorrect = isOptionCorrect(option.id)

          // Verificar si es Verdadero/Falso para estilos
          const isTrueOption = option.value.toLowerCase() === 'verdadero' || option.value.toLowerCase() === 'true'

          return (
            <ResponseOptionComponent
              key={option.id}
              option={{
                ...option,
                value: isTrueOption ? 'Verdadero' : 'Falso' // Estandarizar texto
              }}
              isSelected={isSelected}
              isCorrect={isCorrect}
              onClick={() => !disabled && onOptionSelect(option.id)}
              disabled={disabled}
              className={cn(
                'transition-all duration-200',
                isSelected && 'ring-primary/30 dark:ring-primary/50 ring-2',
                !disabled && (isTrueOption ? 'hover:border-green-300 dark:hover:border-green-700' : 'hover:border-red-300 dark:hover:border-red-700')
              )}
            />
          )
        })}
      </div>
    </BaseQuestionResponse>
  )
}
