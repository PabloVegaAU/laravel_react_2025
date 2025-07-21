import { PageProps } from '@/types'
import { PrizesPage } from './components'

export default function CreatePrizePage({ auth }: PageProps) {
  return (
    <div className='container mx-auto py-6'>
      <h1 className='mb-6 text-2xl font-bold'>Crear Nuevo Premio</h1>
      <PrizesPage.CreatePrizeModal
        isOpen={true}
        onClose={() => window.history.back()}
        onSuccess={() => {
          // Redirect to prizes list after successful creation
          window.location.href = '/teacher/prizes'
        }}
      />
    </div>
  )
}

// Add a display name for the component for better debugging
CreatePrizePage.displayName = 'CreatePrizePage'
