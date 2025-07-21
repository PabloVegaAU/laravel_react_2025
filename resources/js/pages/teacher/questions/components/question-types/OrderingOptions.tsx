import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { GripVertical, X } from 'lucide-react'
import { useRef, useState } from 'react'
import { QuestionTypeProps } from './types'

export function OrderingOptions({ options, onChange, disabled = false }: QuestionTypeProps) {
  const [draggedItem, setDraggedItem] = useState<number | null>(null)
  const dragOverItem = useRef<number | null>(null)

  const handleAddOption = () => {
    const newOption = {
      value: `Opción ${options.length + 1}`,
      is_correct: true,
      order: options.length,
      correct_order: options.length,
      pair_key: null,
      pair_side: null,
      score: 1
    }
    onChange([...options, newOption])
  }

  const handleRemoveOption = (index: number) => {
    const newOptions = options.filter((_, i) => i !== index)

    // Update order for remaining items
    const updatedOptions = newOptions.map((opt, i) => ({
      ...opt,
      order: i,
      correct_order: i
    }))

    onChange(updatedOptions)
  }

  const handleUpdateOption = (index: number, value: string) => {
    const newOptions = [...options]
    newOptions[index] = {
      ...newOptions[index],
      value,
      order: index,
      correct_order: index
    }
    onChange(newOptions)
  }

  // Handle drag start
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    setDraggedItem(index)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/html', e.currentTarget.innerHTML)
  }

  // Handle drag over
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault()
    dragOverItem.current = index
  }

  // Handle drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault()

    if (draggedItem === null || dragOverItem.current === null) return

    const newOptions = [...options]
    const draggedOption = newOptions[draggedItem]

    // Remove the dragged item
    newOptions.splice(draggedItem, 1)

    // Insert it at the new position
    newOptions.splice(dragOverItem.current, 0, draggedOption)

    // Update the order and correct_order for all items
    const updatedOptions = newOptions.map((opt, i) => ({
      ...opt,
      order: i,
      correct_order: i
    }))

    onChange(updatedOptions)
    setDraggedItem(null)
    dragOverItem.current = null
  }

  return (
    <div className='space-y-4'>
      <div className='space-y-3'>
        {options.map((option, index) => (
          <div
            key={index}
            draggable={!disabled}
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={(e) => handleDrop(e, index)}
            className={`flex items-center gap-2 rounded-md border p-2 transition-colors ${draggedItem === index ? 'opacity-50' : ''} dark:border-gray-700 dark:bg-gray-800/50 dark:hover:bg-gray-800/70`}
          >
            <GripVertical className='text-muted-foreground dark:text-foreground/70 h-4 w-4 cursor-move' />
            <span className='text-muted-foreground text-sm font-medium'>{index + 1}.</span>
            <Input
              value={option.value}
              onChange={(e) => handleUpdateOption(index, e.target.value)}
              placeholder={`Opción ${index + 1}`}
              disabled={disabled}
              className='flex-1'
            />
            <Button
              type='button'
              variant='ghost'
              size='icon'
              onClick={() => handleRemoveOption(index)}
              disabled={disabled || options.length <= 2}
              className='text-destructive hover:bg-destructive/10 hover:text-destructive dark:hover:bg-destructive/20 h-9 w-9'
            >
              <X className='h-4 w-4' />
              <span className='sr-only'>Eliminar opción</span>
            </Button>
          </div>
        ))}
      </div>

      <div>
        <Button
          type='button'
          variant='outline'
          size='sm'
          onClick={handleAddOption}
          disabled={disabled}
          className='dark:border-input dark:hover:bg-accent dark:hover:text-accent-foreground'
        >
          Agregar opción
        </Button>
      </div>

      {options.length < 2 && <p className='text-muted-foreground text-sm'>Agrega al menos 2 opciones para continuar</p>}
    </div>
  )
}
