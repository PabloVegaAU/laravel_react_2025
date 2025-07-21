import InputError from '@/components/input-error'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Check, X } from 'lucide-react'
import { QuestionTypeProps } from './types'

interface BaseQuestionTypeProps extends QuestionTypeProps {
  title: string
  addButtonText: string
  minOptions?: number
  error?: string
  onAddOption: () => void
  onRemoveOption: (index: number) => void
  onUpdateOption: (index: number, value: string) => void
  onSetCorrect?: (index: number) => void
  children?: React.ReactNode
  disabled?: boolean
  showCorrectOption?: boolean
}

export function BaseQuestionType({
  options,
  title,
  addButtonText,
  minOptions = 2,
  error,
  onAddOption,
  onRemoveOption,
  onUpdateOption,
  onSetCorrect,
  children,
  disabled = false,
  showCorrectOption = false
}: BaseQuestionTypeProps) {
  const canAddMore = options.length === 0 || options.every((opt) => opt.value.trim() !== '')

  return (
    <div className='text-foreground flex flex-col gap-4'>
      <div className='flex flex-col gap-2'>
        <h4 className='text-sm font-medium'>{title}</h4>
        <InputError message={error} />
      </div>

      <div className='flex flex-col gap-3'>
        {options.map((option, index) => (
          <div key={index} className='flex items-start gap-2'>
            {showCorrectOption && onSetCorrect && (
              <Button
                type='button'
                variant={option.is_correct ? 'default' : 'outline'}
                size='icon'
                onClick={() => onSetCorrect(index)}
                disabled={disabled}
                className={`h-9 w-9 shrink-0 transition-colors ${option.is_correct ? 'bg-green-600 text-white hover:bg-green-700' : 'hover:bg-muted'}`}
                title={option.is_correct ? 'Respuesta correcta' : 'Marcar como correcta'}
              >
                <Check className='h-4 w-4' />
                <span className='sr-only'>Marcar como correcta</span>
              </Button>
            )}
            <div className='flex-1'>
              <Input
                value={option.value}
                onChange={(e) => onUpdateOption(index, e.target.value)}
                placeholder={`Opción ${index + 1}`}
                className='w-full'
                disabled={disabled}
              />
            </div>
            {options.length > minOptions && (
              <Button
                type='button'
                variant='ghost'
                size='icon'
                onClick={() => onRemoveOption(index)}
                disabled={disabled}
                className='text-destructive hover:bg-destructive/10 hover:text-destructive dark:hover:bg-destructive/20 h-9 w-9 shrink-0'
                title='Eliminar opción'
              >
                <X className='h-4 w-4' />
                <span className='sr-only'>Eliminar opción</span>
              </Button>
            )}
          </div>
        ))}
      </div>

      <div className='mt-2'>
        <Button type='button' variant='outline' size='sm' onClick={onAddOption} disabled={!canAddMore || disabled}>
          {addButtonText}
        </Button>
      </div>

      {children && <div className='mt-4'>{children}</div>}
    </div>
  )
}
