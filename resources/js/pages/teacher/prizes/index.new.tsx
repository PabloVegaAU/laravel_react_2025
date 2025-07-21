import { PrizeManagement } from '@/components/prizes'
import { Head } from '@inertiajs/react'

export default function TeacherPrizesPage() {
  return (
    <>
      <Head title='Gestión de Premios' />
      <div className='container mx-auto p-4'>
        <PrizeManagement canManage={true} className='mt-6' />
      </div>
    </>
  )
}

// Add a display name for the component for better debugging
TeacherPrizesPage.displayName = 'TeacherPrizesPage'
