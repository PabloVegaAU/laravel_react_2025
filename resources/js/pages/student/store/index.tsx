import AppLayout from '@/layouts/app-layout'
import { useUserStore } from '@/store/useUserStore'
import { BreadcrumbItem } from '@/types/core'
import { Head, router, usePage } from '@inertiajs/react'
import axios from 'axios'
import { useEffect, useState } from 'react'

// Definimos el tipo que llega desde el backend
type InertiaUser = {
  id: number
  name: string
  email: string
  student_id: number
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Tienda de Puntos',
    href: '#'
  }
]

export default function Dashboard() {
  const { props } = usePage<{ user: InertiaUser }>()
  const { setUser, setCurrentDashboardRole } = useUserStore()
  const [puntos, setPuntos] = useState<number | null>(null)

  useEffect(() => {
    setCurrentDashboardRole('/student/store')

    if (props.user) {
      // Convertimos student_id a string al momento de setear en el store
      setUser({
        ...props.user,
        student_id: String(props.user.student_id)
      })

      // Lo enviamos como número al backend
      fetchStudentProfile(props.user.student_id)
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
      <header className='mb-2 flex items-center justify-between p-5'>
        <strong className='text-base font-bold'>TIENDA DE PUNTOS</strong>
        <div className='text-base'>Tus puntos: {puntos !== null ? `${puntos} pts` : '...'}</div>
      </header>
      <div className='mb-2 flex justify-end px-5'>
        <button
          onClick={() => router.visit('/student/objects')}
          className='flex items-center space-x-2 rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600'
        >
          <span>MIS OBJETOS</span>
        </button>
      </div>
      <main className='p-5 text-center'>
        <p className='mb-4 text-sm font-semibold'>COMPRAR</p>
        <div className='flex justify-center space-x-8'>
          {[
            { label: 'AVATARES', path: '/student/store/avatars' },
            { label: 'FONDOS', path: '/student/store/backgrounds' },
            { label: 'PREMIOS', path: '/student/store/rewards' }
          ].map(({ label, path }) => (
            <div key={label} className='flex flex-col items-center'>
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
              <button onClick={() => router.visit(path)} className='mt-1 w-20 rounded-md bg-blue-300 py-1 text-sm text-black'>
                {label}
              </button>
            </div>
          ))}
        </div>
      </main>
    </AppLayout>
  )
}
