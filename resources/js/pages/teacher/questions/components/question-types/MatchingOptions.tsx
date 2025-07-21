import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Link2, X } from 'lucide-react'
import { QuestionTypeProps } from './types'

export function MatchingOptions({ options, onChange, disabled = false }: QuestionTypeProps) {
  const handleAddPair = () => {
    const pairIndex = Math.floor(options.length / 2)
    const newOptions = [
      ...options,
      {
        value: `Opción ${String.fromCharCode(65 + pairIndex)}`,
        is_correct: true,
        order: options.length,
        correct_order: 0,
        pair_key: `${pairIndex + 1}`,
        pair_side: 'left' as const,
        score: 1
      },
      {
        value: `Opción ${pairIndex + 1}`,
        is_correct: true,
        order: options.length + 1,
        correct_order: 1,
        pair_key: `${pairIndex + 1}`,
        pair_side: 'right' as const,
        score: 1
      }
    ]

    onChange(newOptions)
  }

  const handleRemovePair = (pairIndex: number) => {
    const firstIndex = pairIndex * 2
    const newOptions = options.filter((_, i) => i < firstIndex || i > firstIndex + 1)

    // Reorder and rekey remaining pairs
    const updatedOptions = newOptions.map((opt, i) => {
      const newPairIndex = Math.floor(i / 2) + 1
      const isLeft = i % 2 === 0

      return {
        ...opt,
        order: i,
        pair_key: `${newPairIndex}`,
        pair_side: isLeft ? ('left' as const) : ('right' as const),
        value: isLeft ? `Opción ${String.fromCharCode(65 + Math.floor(i / 2))}` : `Opción ${Math.floor(i / 2) + 1}`
      }
    })

    onChange(updatedOptions)
  }

  const handleUpdateOption = (index: number, value: string) => {
    const newOptions = [...options]
    newOptions[index] = {
      ...newOptions[index],
      value,
      order: index
    }
    onChange(newOptions)
  }

  // Group options into pairs
  const pairs: Array<[(typeof options)[0], (typeof options)[1]?]> = []
  for (let i = 0; i < options.length; i += 2) {
    pairs.push([options[i], options[i + 1]])
  }

  return (
    <div className='text-foreground space-y-6'>
      <div className='space-y-4'>
        {pairs.map(([left, right], pairIndex) => (
          <div key={pairIndex} className='flex items-center gap-4'>
            <div className='flex flex-1 items-center gap-2'>
              <Input
                value={left?.value || ''}
                onChange={(e) => handleUpdateOption(pairIndex * 2, e.target.value)}
                placeholder={`Opción ${String.fromCharCode(65 + pairIndex)}`}
                disabled={disabled}
                className='w-full'
              />
              <Link2 className='text-muted-foreground dark:text-foreground/70 h-4 w-4 flex-shrink-0' />
              <Input
                value={right?.value || ''}
                onChange={(e) => handleUpdateOption(pairIndex * 2 + 1, e.target.value)}
                placeholder={`Opción ${pairIndex + 1}`}
                disabled={disabled}
                className='w-full'
              />
              <Button
                type='button'
                variant='ghost'
                size='icon'
                onClick={() => handleRemovePair(pairIndex)}
                disabled={disabled}
                className='text-destructive hover:bg-destructive/10 hover:text-destructive dark:hover:bg-destructive/20 h-9 w-9 shrink-0'
              >
                <X className='h-4 w-4' />
                <span className='sr-only'>Eliminar par</span>
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div>
        <Button
          type='button'
          variant='outline'
          className='dark:border-input dark:hover:bg-accent dark:hover:text-accent-foreground'
          size='sm'
          onClick={handleAddPair}
          disabled={disabled || pairs.some((pair) => !pair[0]?.value || !pair[1]?.value)}
        >
          Agregar par
        </Button>
      </div>

      {pairs.length < 2 && <p className='text-muted-foreground text-sm'>Agrega al menos 2 pares para continuar</p>}
    </div>
  )
}
