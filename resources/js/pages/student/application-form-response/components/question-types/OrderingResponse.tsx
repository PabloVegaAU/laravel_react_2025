import { cn } from '@/lib/utils'
import { ApplicationFormResponseQuestion, QuestionOption } from '@/types/application-form'
import { GripVertical } from 'lucide-react'
import { DragEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react'

interface OrderingResponseProps {
  question: ApplicationFormResponseQuestion
  order: number[]
  onOrderChange: (optionIds: number[]) => void
  disabled?: boolean
}

export function OrderingResponse({ question, order = [], onOrderChange, disabled = false }: OrderingResponseProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  const dragItem = useRef<number | null>(null)
  const dragOverItem = useRef<number | null>(null)

  useEffect(() => {
    if (order.length === 0) onOrderChange(orderedOptions.map((opt) => opt.id))
  }, [])

  const questionOptions = useMemo(() => question.application_form_question.question?.options || [], [question])

  const orderedOptions = useMemo(() => {
    if (!order || order.length === 0) {
      return [...questionOptions].sort((a, b) => a.order - b.order)
    }

    // Filtrar opciones válidas que existen en el orden proporcionado
    const validOptions = order.map((id) => questionOptions.find((opt) => opt.id === id)).filter((opt): opt is QuestionOption => !!opt)

    // Incluir cualquier opción que no esté en el orden (por si acaso)
    const missingOptions = questionOptions.filter((opt) => !order.includes(opt.id))
    return [...validOptions, ...missingOptions]
  }, [order, questionOptions])

  const handleDragStart = useCallback(
    (e: DragEvent<HTMLDivElement>, index: number) => {
      e.dataTransfer.effectAllowed = 'move'
      dragItem.current = index
      setIsDragging(true)
      const element = e.currentTarget as HTMLElement
      element.classList.add('opacity-50')
      e.dataTransfer.setDragImage(new Image(), 0, 0)
    },
    [orderedOptions]
  )

  const handleDragEnter = useCallback((e: DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault()
    dragOverItem.current = index
    setDragOverIndex(index)
  }, [])

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }, [])

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
      const element = e.currentTarget as HTMLElement
      element.classList.remove('opacity-50')

      if (dragItem.current === null || dragOverItem.current === null) {
        setIsDragging(false)
        setDragOverIndex(null)
        return
      }

      // Solo reordenar si la posición cambió
      if (dragItem.current !== dragOverItem.current) {
        const newOrder = orderedOptions.map((opt) => opt.id)
        const [movedItem] = newOrder.splice(dragItem.current, 1)
        newOrder.splice(dragOverItem.current, 0, movedItem)

        // Notificar al padre el nuevo orden
        onOrderChange(newOrder)
      }

      // Restablecer estados
      dragItem.current = null
      dragOverItem.current = null
      setIsDragging(false)
      setDragOverIndex(null)
    },
    [orderedOptions, onOrderChange]
  )

  const handleDragEnd = useCallback((e: DragEvent<HTMLDivElement>) => {
    const element = e.currentTarget as HTMLElement
    element.classList.remove('opacity-50')
    setIsDragging(false)
    setDragOverIndex(null)
    dragItem.current = null
    dragOverItem.current = null
  }, [])

  return (
    <div className='space-y-2'>
      {orderedOptions.map((option, index) => {
        const isBeingDragged = isDragging && dragItem.current === index
        const isDragOver = dragOverIndex === index && dragItem.current !== index

        return (
          <div
            key={option.id}
            draggable={!disabled}
            onDragStart={(e) => handleDragStart(e, index)}
            onDragEnter={(e) => handleDragEnter(e, index)}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
            onDrop={handleDrop}
            className={cn(
              'flex items-center gap-3 rounded-lg border p-3 transition-all duration-200',
              disabled ? 'cursor-not-allowed opacity-80' : 'cursor-grab active:cursor-grabbing',
              isBeingDragged && 'opacity-50',
              isDragOver && 'bg-blue-50 ring-2 ring-blue-400',
              isDragging && !isBeingDragged && 'transition-transform duration-200',
              isDragOver && dragItem.current !== null && dragItem.current < index && 'translate-y-2',
              isDragOver && dragItem.current !== null && dragItem.current > index && '-translate-y-2'
            )}
            style={{
              transform:
                isDragOver && dragItem.current !== null
                  ? `translateY(${dragItem.current < index ? '4px' : dragItem.current > index ? '-4px' : '0'})`
                  : 'none'
            }}
          >
            {!disabled && (
              <span className='cursor-grab touch-none active:cursor-grabbing'>
                <GripVertical className='h-4 w-4 text-gray-400' />
              </span>
            )}
            <span className='flex-1 select-none'>{option.value}</span>
          </div>
        )
      })}
      {orderedOptions.length === 0 && <p className='text-sm text-gray-500'>No hay opciones disponibles</p>}
    </div>
  )
}
