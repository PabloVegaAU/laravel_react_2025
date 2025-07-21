import { cn } from '@/lib/utils'
import { ApplicationFormResponseQuestion } from '@/types/application-form'
import { useCallback, useMemo, useState } from 'react'

interface MatchingResponseProps {
  question: ApplicationFormResponseQuestion
  pairs: Record<number, number>
  onPairSelect: (leftId: number, rightId: number | null) => void
  disabled?: boolean
  isCorrect?: boolean
}

export const MatchingResponse: React.FC<MatchingResponseProps> = ({
  question,
  pairs = {},
  onPairSelect,
  disabled = false,
  isCorrect = undefined
}) => {
  const [selectedLeftId, setSelectedLeftId] = useState<number | null>(null)

  const { leftOptions, rightOptions, optionMap } = useMemo(() => {
    const allOptions = question.application_form_question?.question?.options || []
    const map = new Map(allOptions.map((opt) => [opt.id, opt]))
    const left = allOptions.filter((opt) => opt.pair_side === 'left').sort((a, b) => (a.pair_key || '').localeCompare(b.pair_key || ''))
    const right = allOptions.filter((opt) => opt.pair_side === 'right').sort((a, b) => (a.pair_key || '').localeCompare(b.pair_key || ''))
    return { leftOptions: left, rightOptions: right, optionMap: map }
  }, [question.application_form_question?.question?.options, pairs])

  const getPairedRightId = useCallback(
    (leftId: number): number | null => {
      const pairedId = pairs[leftId] !== undefined ? pairs[leftId] : null
      return pairedId !== null && pairedId !== undefined ? Number(pairedId) : null
    },
    [pairs]
  )

  const isRightOptionPaired = useCallback(
    (rightId: number): boolean => {
      return Object.values(pairs).some((id) => id !== null && Number(id) === rightId)
    },
    [pairs]
  )

  const handleLeftOptionClick = useCallback(
    (leftId: number) => {
      if (disabled) {
        return
      }

      const pairedRightId = getPairedRightId(leftId)
      const isAlreadyPaired = pairedRightId !== null

      if (isAlreadyPaired) {
        setSelectedLeftId(null)
        onPairSelect(leftId, null)
        return
      }

      setSelectedLeftId(selectedLeftId === leftId ? null : leftId)
    },
    [disabled, selectedLeftId, getPairedRightId, onPairSelect]
  )

  const handleRightOptionClick = (rightId: number) => {
    if (disabled) {
      return
    }

    if (selectedLeftId === null) {
      return
    }

    const isPaired = isRightOptionPaired(rightId)
    const currentPair = Object.entries(pairs).find(([_, rId]) => rId === rightId)
    const pairedLeftId = currentPair ? Number(currentPair[0]) : null

    if (isPaired && pairedLeftId === selectedLeftId) {
      delete pairs[selectedLeftId]
      onPairSelect(selectedLeftId, null)
      setSelectedLeftId(null)
      return
    }

    if (isPaired && pairedLeftId !== null && pairedLeftId !== selectedLeftId) {
      delete pairs[pairedLeftId]
      onPairSelect(pairedLeftId, null)
    }

    pairs[selectedLeftId] = rightId
    onPairSelect(selectedLeftId, rightId)
    setSelectedLeftId(null)
  }

  const renderLeftOptions = () => {
    return leftOptions.map((option) => {
      const isSelected = selectedLeftId === option.id
      const pairedRightId = getPairedRightId(option.id)
      const isPaired = pairedRightId !== null && pairedRightId !== undefined
      const pairedOption = pairedRightId ? optionMap.get(pairedRightId) : null

      const pairInfo =
        isPaired && pairedOption ? (
          <div className='mt-1 flex items-center text-sm'>
            <span className='mr-1'>→</span>
            <span className='font-medium'>{pairedOption.value}</span>
            <span className='ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs'>Emparejado</span>
          </div>
        ) : null

      return (
        <div
          key={`left-${option.id}`}
          className={cn(
            'mb-3 cursor-pointer overflow-hidden rounded-lg border shadow-sm transition-all',
            isSelected && 'border-blue-500 bg-blue-50 ring-2 ring-blue-200',
            disabled && 'cursor-not-allowed opacity-70',
            !disabled && 'hover:bg-gray-50',
            'group relative flex flex-col justify-between'
          )}
          onClick={() => handleLeftOptionClick(option.id)}
        >
          <div className='p-3'>
            <div className='flex items-center justify-between'>
              <span className='text-sm font-medium text-gray-900'>{option.value}</span>
              {isSelected && <div className='flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-xs font-bold text-white'>✓</div>}
            </div>
            {pairInfo}
          </div>
        </div>
      )
    })
  }

  const renderRightOptions = () => {
    return rightOptions.map((option) => {
      const isPaired = isRightOptionPaired(option.id)
      const isSelected = selectedLeftId !== null && !isPaired
      const pairEntry = Object.entries(pairs).find(([_, rId]) => rId === option.id)
      const pairedLeftId = pairEntry ? Number(pairEntry[0]) : null
      const pairedOption = pairedLeftId ? optionMap.get(pairedLeftId) : null

      const pairInfo =
        isPaired && pairedOption ? (
          <div className='mt-1 flex items-center text-sm'>
            <span className='mr-1'>←</span>
            <span>{pairedOption.value}</span>
            <span className='ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs'>Emparejado</span>
          </div>
        ) : null

      return (
        <div
          key={`right-${option.id}`}
          className={cn(
            'mb-3 cursor-pointer overflow-hidden rounded-lg border shadow-sm transition-all',
            isSelected && 'border-blue-500 bg-blue-50 ring-2 ring-blue-200',
            disabled && 'cursor-not-allowed opacity-70',
            !disabled && !isPaired && 'hover:bg-gray-50',
            'group relative flex flex-col',
            isPaired ? 'cursor-default' : 'cursor-pointer'
          )}
          onClick={() => !isPaired && handleRightOptionClick(option.id)}
        >
          <div className='p-3'>
            <div className='flex items-center justify-between'>
              <span className={cn('text-sm', isPaired ? 'font-medium text-gray-900' : 'text-gray-700')}>{option.value}</span>
            </div>
            {pairInfo}
          </div>
        </div>
      )
    })
  }

  return (
    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
      {/* Left options */}
      <div className='space-y-2'>
        <h3 className='font-medium'>Opciones de la izquierda</h3>
        <div className='space-y-2'>{renderLeftOptions()}</div>
      </div>

      {/* Right options */}
      <div className='space-y-2'>
        <h3 className='font-medium'>Opciones de la derecha</h3>
        <div className='space-y-2'>{renderRightOptions()}</div>
      </div>
    </div>
  )
}
