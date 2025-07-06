import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { QuestionTypeProps } from './types'

export function TrueFalseOptions({ options, onChange, disabled = false }: QuestionTypeProps) {
  const handleSetCorrect = (isTrueCorrect: boolean) => {
    const trueOption = {
      value: 'Verdadero',
      is_correct: isTrueCorrect,
      order: 0,
      correct_order: 0,
      pair_key: null,
      pair_side: null,
      score: isTrueCorrect ? 1 : 0,
      feedback: null
    }

    const falseOption = {
      value: 'Falso',
      is_correct: !isTrueCorrect,
      order: 1,
      correct_order: 1,
      pair_key: null,
      pair_side: null,
      score: !isTrueCorrect ? 1 : 0,
      feedback: null
    }

    onChange([trueOption, falseOption])
  }

  // Initialize default options if empty
  if (options.length === 0) {
    handleSetCorrect(true)
    return null // Will re-render with new options
  }

  const trueOption = options.find((opt) => opt.value === 'Verdadero')
  const falseOption = options.find((opt) => opt.value === 'Falso')
  const currentCorrect = trueOption?.is_correct ? 'true' : 'false'

  return (
    <div className='space-y-4'>
      <div className='space-y-2'>
        <h4 className='text-sm font-medium'>Selecciona la respuesta correcta</h4>
        <p className='text-muted-foreground text-sm'>Marca cuál de las dos opciones es la respuesta correcta.</p>
      </div>

      <RadioGroup value={currentCorrect} onValueChange={(value) => handleSetCorrect(value === 'true')} className='space-y-3' disabled={disabled}>
        <div className='flex items-center space-x-2'>
          <RadioGroupItem value='true' id='true-option' />
          <Label htmlFor='true-option' className='text-base font-normal'>
            Verdadero
          </Label>
        </div>
        <div className='flex items-center space-x-2'>
          <RadioGroupItem value='false' id='false-option' />
          <Label htmlFor='false-option' className='text-base font-normal'>
            Falso
          </Label>
        </div>
      </RadioGroup>
    </div>
  )
}
