import AppLayout from '@/layouts/app-layout'
import { useUserStore } from '@/store/useUserStore'
import { BreadcrumbItem } from '@/types/core'
import { Head } from '@inertiajs/react'
import { useEffect } from 'react'

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Tienda de Puntos',
    href: 'student/store'
  }
]

export default function Dashboard() {
  const { setCurrentDashboardRole } = useUserStore()

  useEffect(() => {
    setCurrentDashboardRole('/student/store')
  }, [])

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title='Tienda de Puntos' />
      <header className='mb-2 flex items-center justify-between p-5'>
        <strong className='text-base font-bold'>TIENDA DE PUNTOS</strong>
        <div className='text-base'>Tus puntos: 50pts</div>
      </header>
      <div className='mb-2 flex justify-end px-5'>
        <button className='rounded-sm bg-orange-300 px-4 py-1 text-sm font-semibold text-black'>MIS OBJETOS</button>
      </div>
      <main className='p-5 text-center'>
        <p className='mb-4 text-sm font-semibold'>COMPRAR</p>
        <div className='flex justify-center space-x-8'>
          <div className='flex flex-col items-center'>
            <div className='border-sidebar-border/70 relative h-20 w-20 overflow-hidden rounded-xl border'>
              <svg
                className='absolute inset-0 h-full w-full stroke-neutral-900/20'
                fill='none'
                stroke='currentColor'
                strokeWidth='1'
                viewBox='0 0 100 100'
                xmlns='http://www.w3.org/2000/svg'
                aria-hidden='true'
              >
                <rect width='100' height='100' fill='white' />
                <path d='M0 0L100 100M100 0L0 100' />
              </svg>
            </div>
            <button className='mt-1 w-20 rounded-md bg-blue-300 py-1 text-sm text-black'>AVATARES</button>
          </div>
          <div className='relative flex flex-col items-center'>
            <div className='border-sidebar-border/70 relative h-20 w-20 overflow-hidden rounded-xl border'>
              <svg
                className='absolute inset-0 h-full w-full stroke-neutral-900/20'
                fill='none'
                stroke='currentColor'
                strokeWidth='1'
                viewBox='0 0 100 100'
                xmlns='http://www.w3.org/2000/svg'
                aria-hidden='true'
              >
                <rect width='100' height='100' fill='white' />
                <path d='M0 0L100 100M100 0L0 100' />
              </svg>
            </div>
            <button className='mt-1 w-20 rounded-md bg-blue-300 py-1 text-sm text-black'>FONDOS</button>
          </div>
          <div className='flex flex-col items-center'>
            <div className='border-sidebar-border/70 relative h-20 w-20 overflow-hidden rounded-xl border'>
              <svg
                className='absolute inset-0 h-full w-full stroke-neutral-900/20'
                fill='none'
                stroke='currentColor'
                strokeWidth='1'
                viewBox='0 0 100 100'
                xmlns='http://www.w3.org/2000/svg'
                aria-hidden='true'
              >
                <rect width='100' height='100' fill='white' />
                <path d='M0 0L100 100M100 0L0 100' />
              </svg>
            </div>
            <button className='mt-1 w-20 rounded-md bg-blue-300 py-1 text-sm text-black'>PREMIOS</button>
          </div>
        </div>
      </main>
    </AppLayout>
  )
}
