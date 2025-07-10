import { CreateQuestionOption } from '@/types/question'
import { BaseQuestionType } from './BaseQuestionType'
import { QuestionTypeProps } from './types'

export function SingleChoiceOptions({ options, onChange, disabled = false }: QuestionTypeProps) {
  /**
   * Agrega una nueva opción a la pregunta
   * La marca como correcta si es la primera opción
   */
  const handleAddOption = (): void => {
    const newOption: CreateQuestionOption = {
      value: `Opción ${options.length + 1}`,
      is_correct: options.length === 0, // Primera opción es correcta por defecto
      order: options.length + 1,
      score: options.length === 0 ? 1 : 0,
      feedback: null,
      correct_order: 0,
      pair_key: null,
      pair_side: null
    }

    onChange([...options, newOption])
  }

  /**
   * Elimina una opción de la pregunta
   * Si se elimina la opción correcta, marca la primera opción como correcta
   */
  const handleRemoveOption = (index: number): void => {
    const newOptions = options.filter((_: CreateQuestionOption, i: number) => i !== index)

    // Si se eliminó la respuesta correcta, marcar la primera opción como correcta
    if (options[index].is_correct && newOptions.length > 0) {
      newOptions[0] = {
        ...newOptions[0],
        is_correct: true,
        score: 1
      }
    }

    // Reordenar las opciones restantes
    const reorderedOptions = newOptions.map((opt, idx) => ({
      ...opt,
      order: idx + 1
    }))

    onChange(reorderedOptions)
  }

  /**
   * Actualiza el texto de una opción
   */
  const handleUpdateOption = (index: number, value: string): void => {
    const newOptions = [...options]
    newOptions[index] = {
      ...newOptions[index],
      value,
      order: newOptions[index].order ?? index + 1
    }
    onChange(newOptions)
  }

  /**
   * Establece una opción como la respuesta correcta
   */
  const handleSetCorrect = (index: number): void => {
    const newOptions = options.map((opt: CreateQuestionOption, i: number) => ({
      ...opt,
      is_correct: i === index,
      score: i === index ? 1 : 0
    }))
    onChange(newOptions)
  }

  return (
    <BaseQuestionType
      options={options}
      title='Opciones de respuesta'
      addButtonText='Agregar opción'
      error={options.length < 2 ? 'Debes agregar al menos 2 opciones' : undefined}
      onAddOption={handleAddOption}
      onRemoveOption={handleRemoveOption}
      onUpdateOption={handleUpdateOption}
      onSetCorrect={handleSetCorrect}
      showCorrectOption={true}
      onChange={onChange}
      disabled={disabled}
    >
      <div className='text-muted-foreground mt-2 text-sm'>
        <p>Haz clic en el ícono de verificación para marcar la respuesta correcta.</p>
      </div>
    </BaseQuestionType>
  )
}
