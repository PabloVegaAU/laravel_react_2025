import AppLayout from '@/layouts/app-layout'
import { useUserStore } from '@/store/useUserStore'
import { BreadcrumbItem } from '@/types/core'
import { Head } from '@inertiajs/react'
import { useEffect } from 'react'

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Tienda de Puntos',
    href: 'student/store'
  },
  {
    title: 'Avatares',
    href: 'student/store/avatars'
  }
]

export default function Dashboard() {
  const { setCurrentDashboardRole } = useUserStore()

  useEffect(() => {
    setCurrentDashboardRole('/student/store/avatars')
  }, [])

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title='Tienda de Puntos' />
      <header className='mb-2 flex items-center justify-between p-5'>
        <strong className='text-sm font-bold'>Tienda de avatares</strong>
        <div className='text-sm'>Tus puntos: 50pts</div>
      </header>
      <div className='grid grid-cols-4 gap-3 p-5'>
        <div className='flex flex-col items-center'>
          <div className='mb-1 flex h-16 w-16 items-center justify-center rounded-sm bg-blue-200 text-base font-normal text-black'>X</div>
          <div className='mb-1 w-full rounded-sm bg-green-300 text-center text-xs font-semibold text-green-900'>10 pts</div>
          <button className='w-full rounded-sm bg-green-300 py-1 text-xs font-semibold text-green-900'>Adquirir</button>
        </div>
        <div className='flex flex-col items-center'>
          <div className='mb-1 flex h-16 w-16 items-center justify-center rounded-sm bg-blue-200 text-base font-normal text-black'>X</div>
          <div className='mb-1 w-full rounded-sm bg-green-300 text-center text-xs font-semibold text-green-900'>10 pts</div>
          <button className='w-full rounded-sm bg-green-300 py-1 text-xs font-semibold text-green-900'>Adquirir</button>
        </div>
        <div className='flex flex-col items-center'>
          <div className='mb-1 flex h-16 w-16 items-center justify-center rounded-sm bg-blue-200 text-base font-normal text-black'>X</div>
          <div className='mb-1 w-full rounded-sm bg-green-300 text-center text-xs font-semibold text-green-900'>10 pts</div>
          <button className='w-full rounded-sm bg-green-300 py-1 text-xs font-semibold text-green-900'>Adquirir</button>
        </div>
        <div className='flex flex-col items-center'>
          <div className='mb-1 flex h-16 w-16 items-center justify-center rounded-sm bg-blue-200 text-base font-normal text-black'>X</div>
          <div className='mb-1 w-full rounded-sm bg-red-200 text-center text-xs font-semibold text-red-900'>10 pts</div>
          <button className='w-full rounded-sm bg-red-200 py-1 text-xs font-semibold text-red-900'>Adquirido</button>
        </div>
        <div className='flex flex-col items-center'>
          <div className='mb-1 flex h-16 w-16 items-center justify-center rounded-sm bg-blue-200 text-base font-normal text-black'>X</div>
          <div className='mb-1 w-full rounded-sm bg-green-300 text-center text-xs font-semibold text-green-900'>50 pts</div>
          <button className='w-full rounded-sm bg-green-300 py-1 text-xs font-semibold text-green-900'>Adquirir</button>
        </div>
        <div className='flex flex-col items-center'>
          <div className='mb-1 flex h-16 w-16 items-center justify-center rounded-sm bg-blue-200 text-base font-normal text-black'>X</div>
          <div className='mb-1 w-full rounded-sm bg-green-300 text-center text-xs font-semibold text-green-900'>25 pts</div>
          <button className='w-full rounded-sm bg-green-300 py-1 text-xs font-semibold text-green-900'>Adquirir</button>
        </div>
        <div className='flex flex-col items-center'>
          <div className='mb-1 flex h-16 w-16 items-center justify-center rounded-sm bg-blue-200 text-base font-normal text-black'>X</div>
          <div className='mb-1 w-full rounded-sm bg-green-300 text-center text-xs font-semibold text-green-900'>100pts</div>
          <button className='w-full rounded-sm bg-green-300 py-1 text-xs font-semibold text-green-900'>Adquirir</button>
        </div>
        <div className='flex flex-col items-center'>
          <div className='mb-1 flex h-16 w-16 items-center justify-center rounded-sm bg-blue-200 text-base font-normal text-black'>X</div>
          <div className='mb-1 w-full rounded-sm bg-red-200 text-center text-xs font-semibold text-red-900'>100 pts</div>
          <button className='w-full rounded-sm bg-red-200 py-1 text-xs font-semibold text-red-900'>Adquirido</button>
        </div>
      </div>
    </AppLayout>
  )
}
