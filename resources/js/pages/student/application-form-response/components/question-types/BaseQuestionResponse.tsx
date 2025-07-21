import { cn } from '@/lib/utils'
import { ApplicationFormResponseQuestion } from '@/types/application-form/form/response/application-form-response-question'
import { QuestionOption } from '@/types/application-form/question/question-option'

// Props del componente ResponseOption
interface ResponseOptionProps {
  option: QuestionOption
  isSelected: boolean
  isCorrect?: boolean
  onClick: () => void
  disabled?: boolean
  className?: string
}

// Componente base para opciones de respuesta
export function ResponseOption({ option, isSelected, isCorrect = false, onClick, disabled = false, className = '' }: ResponseOptionProps) {
  return (
    <div
      onClick={!disabled ? onClick : undefined}
      className={cn(
        'flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors',
        isSelected
          ? 'border-primary bg-primary/5 hover:bg-primary/10 dark:border-primary/50 dark:bg-primary/10 dark:hover:bg-primary/20 dark:text-white'
          : 'border-gray-200 bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700',
        disabled && 'cursor-not-allowed opacity-70',
        className
      )}
    >
      <div
        className={cn(
          'flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border',
          isSelected ? 'border-primary bg-primary/10' : 'border-gray-300 bg-white'
        )}
      >
        {isSelected && <div className={cn('h-3 w-3 rounded-full', 'bg-primary')} />}
      </div>

      <div className='flex-1'>{option.value}</div>
    </div>
  )
}

// Props de BaseQuestionResponse
interface BaseQuestionResponseProps {
  /** Pregunta a mostrar */
  question: ApplicationFormResponseQuestion
  /** IDs de las opciones seleccionadas */
  selectedOptions: number[]
  /** Manejador de selección de opción */
  onOptionSelect: (optionId: number) => void
  /** Contenido de la pregunta (opciones de respuesta) */
  children: React.ReactNode
  /** Clases CSS adicionales */
  className?: string
}

// Componente base para vistas de preguntas
export function BaseQuestionResponse({ question, selectedOptions, onOptionSelect, children, className = '' }: BaseQuestionResponseProps) {
  return <div className={cn('space-y-4', className)}>{children}</div>
}
