import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Image } from '@/components/ui/image'
import { Prize } from '@/types/prize'
import { formatPrizePrice, formatStockInfo, getPrizeStatus, isPrizeAvailable } from '@/utils/prizeUtils'
import { Link } from '@inertiajs/react'
import React from 'react'

interface PrizeCardProps {
  prize: Prize
  showActions?: boolean
  onRedeem?: (prize: Prize) => void
  className?: string
}

export const PrizeCard: React.FC<PrizeCardProps> = ({ prize, showActions = true, onRedeem, className = '' }) => {
  const { text: statusText, variant: statusVariant } = getPrizeStatus(prize)
  const available = isPrizeAvailable(prize)

  const handleRedeem = (e: React.MouseEvent) => {
    e.preventDefault()
    if (onRedeem) {
      onRedeem(prize)
    }
  }

  return (
    <Link href={`/prizes/${prize.id}`} className='block h-full'>
      <Card className={`flex h-full flex-col overflow-hidden transition-shadow duration-200 hover:shadow-lg ${className}`}>
        <div className='bg-muted/20 relative aspect-square'>
          <Image
            src={prize.image ? `/storage/${prize.image}` : '/images/placeholder-prize.png'}
            alt={prize.name}
            className='h-full w-full object-cover'
            width={400}
            height={400}
          />
          <Badge variant={statusVariant as 'default' | 'destructive' | 'outline' | 'secondary'} className='absolute top-2 right-2 z-10'>
            {statusText}
          </Badge>
        </div>

        <CardHeader className='pb-2'>
          <CardTitle className='line-clamp-2 h-14 text-lg'>{prize.name}</CardTitle>
        </CardHeader>

        <CardContent className='flex-1 pb-2'>
          <div className='space-y-2'>
            <div className='flex items-center justify-between'>
              <span className='text-muted-foreground text-sm'>Precio:</span>
              <span className='text-primary font-semibold'>{formatPrizePrice(prize.points_cost)} pts</span>
            </div>

            <div className='flex items-center justify-between'>
              <span className='text-muted-foreground text-sm'>Disponibilidad:</span>
              <span className='text-sm'>{formatStockInfo(prize.stock)}</span>
            </div>

            {prize.available_until && (
              <div className='flex items-center justify-between text-sm'>
                <span className='text-muted-foreground'>Válido hasta:</span>
                <span>{new Date(prize.available_until).toLocaleDateString()}</span>
              </div>
            )}
          </div>

          {prize.description && <p className='text-muted-foreground mt-2 line-clamp-2 text-sm'>{prize.description}</p>}
        </CardContent>

        {showActions && (
          <CardFooter className='pt-2'>
            <Button variant={available ? 'default' : 'outline'} className='w-full' disabled={!available} onClick={handleRedeem}>
              {available ? 'Canjear' : 'No disponible'}
            </Button>
          </CardFooter>
        )}
      </Card>
    </Link>
  )
}

export default PrizeCard
