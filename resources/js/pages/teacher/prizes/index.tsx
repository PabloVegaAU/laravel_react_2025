import { PrizeManagement } from '@/components/prizes'
import AppLayout from '@/layouts/app-layout'
import { Head } from '@inertiajs/react'

export default function TeacherPrizesPage() {
  return (
    <AppLayout>
      <Head title='Gestión de Premios' />
      <div className='container mx-auto p-4'>
        <PrizeManagement canManage={true} className='mt-6' />
      </div>
    </AppLayout>
  )
}

// Add a display name for the component for better debugging
TeacherPrizesPage.displayName = 'TeacherPrizesPage'
