import { Skeleton } from '@/components/ui/skeleton'
import { Prize } from '@/types/prize'
import React from 'react'
import { PrizeCard } from './PrizeCard'

interface PrizeGridProps {
  prizes: Prize[]
  loading?: boolean
  onRedeem?: (prize: Prize) => void
  emptyMessage?: string
  skeletonCount?: number
  className?: string
}

export const PrizeGrid: React.FC<PrizeGridProps> = ({
  prizes = [],
  loading = false,
  onRedeem,
  emptyMessage = 'No se encontraron premios',
  skeletonCount = 8,
  className = ''
}) => {
  if (loading) {
    return (
      <div className={`grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ${className}`}>
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <div key={`skeleton-${index}`} className='space-y-2'>
            <Skeleton className='h-48 w-full rounded-t-lg' />
            <Skeleton className='h-4 w-3/4' />
            <Skeleton className='h-4 w-1/2' />
            <Skeleton className='mt-2 h-10 w-full' />
          </div>
        ))}
      </div>
    )
  }

  if (prizes.length === 0) {
    return (
      <div className={`flex flex-col items-center justify-center py-12 ${className}`}>
        <div className='text-muted-foreground text-center'>
          <svg className='mx-auto h-12 w-12 text-gray-400' fill='none' viewBox='0 0 24 24' stroke='currentColor' aria-hidden='true'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={1}
              d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
            />
          </svg>
          <h3 className='mt-2 text-sm font-medium'>{emptyMessage}</h3>
          <p className='text-muted-foreground mt-1 text-sm'>Intenta ajustar los filtros de búsqueda o crear un nuevo premio.</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ${className}`}>
      {prizes.map((prize) => (
        <PrizeCard key={prize.id} prize={prize} onRedeem={onRedeem} />
      ))}
    </div>
  )
}

export default PrizeGrid
