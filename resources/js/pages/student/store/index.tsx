import AppLayout from '@/layouts/app-layout'
import { useUserStore } from '@/store/useUserStore'
import { UserInertia } from '@/types/auth'
import { BreadcrumbItem } from '@/types/core'
import { Head, router, usePage } from '@inertiajs/react'
import axios from 'axios'
import { useEffect, useState } from 'react'

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Tienda de Puntos',
    href: '#'
  }
]

export default function Dashboard() {
  const { props } = usePage<{ user: UserInertia }>()
  const { setUser } = useUserStore()
  const [puntos, setPuntos] = useState<number | null>(null)

  useEffect(() => {
    if (props.user) {
      // Convertimos student_id a string al momento de setear en el store
      setUser({
        ...props.user,
        id: Number(props.user.id)
      })

      // Lo enviamos como número al backend
      fetchStudentProfile(props.user.id)
    }
  }, [props.user])

  const fetchStudentProfile = async (studentId: number) => {
    try {
      const response = await axios.post('/api/studentprofile', {
        p_student_id: studentId
      })
      if (response.data.success && response.data.data.length > 0) {
        setPuntos(response.data.data[0].puntos)
      }
    } catch (error: any) {
      if (error.response) {
        console.error('❌ Error de servidor:', error.response.data)
      } else {
        console.error('❌ Error al conectar con la API:', error.message)
      }
    }
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title='Tienda de Puntos' />
      <header className='mb-4 flex flex-col items-start justify-between gap-4 p-6 sm:flex-row sm:items-center sm:gap-0 lg:p-8'>
        <div className='bg-background rounded-lg border p-6 shadow-sm'>
          <h2 className='text-foreground text-2xl font-bold'>Tienda de Objetos</h2>
        </div>
        <div className='flex items-center space-x-4'>
          <div className='rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-2 dark:border-yellow-800 dark:bg-yellow-950'>
            <span className='font-medium text-yellow-900 dark:text-yellow-100'>Tus puntos: </span>
            <span className='font-bold text-yellow-700 dark:text-yellow-300'>{puntos !== null ? `${puntos} pts` : '...'}</span>
          </div>
        </div>
      </header>
      <div className='mb-6 flex justify-center px-6 sm:justify-end lg:px-8'>
        <button
          onClick={() => router.visit('/student/objects')}
          className='border-border dark:bg-muted mb-8 flex items-center space-x-2 rounded-lg border bg-white p-6 text-base font-medium transition-colors sm:px-8 sm:py-4 sm:text-lg lg:text-xl'
        >
          <span>MIS OBJETOS</span>
        </button>
      </div>
      <main className='p-6 text-center lg:p-8'>
        <div className='flex items-center justify-center'>
          <div className='border-border dark:bg-muted mb-8 rounded-lg border bg-white p-6'>
            <p className='text-foreground text-lg font-semibold sm:text-xl lg:text-2xl xl:text-3xl'>COMPRAR</p>
          </div>
        </div>
        <div className='flex flex-col items-center justify-center space-y-8 sm:flex-row sm:space-y-0 sm:space-x-12 lg:space-x-16'>
          {[
            { label: 'AVATARES', path: '/student/store/avatars', image: '/images/avatars/default.png' },
            { label: 'FONDOS', path: '/student/store/backgrounds', image: '/images/backgrounds/default.png' },
            { label: 'PREMIOS', path: '/student/store/rewards', image: '/images/rewards/default.png' }
          ].map(({ label, path, image }) => (
            <div key={label} className='flex flex-col items-center'>
              <div className='border-border bg-muted relative size-24 overflow-hidden rounded-xl border sm:size-32 md:size-40 lg:size-48 xl:size-56'>
                <img src={image} alt={label} className='h-full w-full object-cover' />
              </div>
              <button
                onClick={() => router.visit(path)}
                className='bg-secondary text-secondary-foreground hover:bg-secondary/80 mt-4 w-24 rounded-lg px-4 py-2 text-sm font-medium transition-colors sm:w-32 sm:text-base md:w-40 md:px-6 md:py-3 lg:text-lg xl:text-xl'
              >
                {label}
              </button>
            </div>
          ))}
        </div>
      </main>
    </AppLayout>
  )
}
