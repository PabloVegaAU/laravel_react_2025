import { PageProps } from '@/types'
import { usePage } from '@inertiajs/react'
import { useEffect, useState } from 'react'
import { PrizesPage } from './components'

export default function EditPrizePage({ auth, prizeId: initialPrizeId }: PageProps<{ prizeId: string }>) {
  const { props } = usePage()
  const [prizeId, setPrizeId] = useState<string>(initialPrizeId || '')

  // In case the prizeId comes from the URL params
  useEffect(() => {
    if (!prizeId && props.prizeId) {
      setPrizeId(props.prizeId)
    }
  }, [props.prizeId, prizeId])

  if (!prizeId) {
    return (
      <div className='container mx-auto py-6'>
        <div className='py-10 text-center'>
          <p className='text-gray-500'>Cargando información del premio...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='container mx-auto py-6'>
      <h1 className='mb-6 text-2xl font-bold'>Editar Premio</h1>
      <PrizesPage.EditPrizeModal
        isOpen={true}
        onClose={() => window.history.back()}
        prizeId={prizeId}
        onSuccess={() => {
          // Redirect to prizes list after successful update
          window.location.href = '/teacher/prizes'
        }}
      />
    </div>
  )
}

// Add a display name for the component for better debugging
EditPrizePage.displayName = 'EditPrizePage'
