import AppLayout from '@/layouts/app-layout'
import { useUserStore } from '@/store/useUserStore'
import { BreadcrumbItem } from '@/types/core'
import { Head, usePage } from '@inertiajs/react'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

type InertiaUser = {
  id: number
  name: string
  email: string
  student_id: number
}

type Prize = {
  prize_id: number
  name: string
  description: string
  image: string
  points_store: number
  fecha_adquisicion: string
  estado: string
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Tienda de Puntos', href: 'student/store' },
  { title: 'Premios', href: 'student/store/rewards' }
]

export default function Dashboard() {
  const { setUser, setCurrentDashboardRole } = useUserStore()
  const { props } = usePage<{ user: InertiaUser }>()
  const [prizes, setPrizes] = useState<Prize[]>([])
  const [puntos, setPuntos] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setCurrentDashboardRole('/student/store/rewards')

    if (props.user) {
      setUser({
        ...props.user,
        student_id: String(props.user.student_id)
      })

      fetchStudentProfile(props.user.student_id)
      fetchAcquiredPrizes(props.user.student_id)
    }
  }, [props.user])

  const fetchAcquiredPrizes = async (studentId: number) => {
    try {
      setLoading(true)
      const response = await axios.post('/api/studentprizeshistory', {
        p_student_id: studentId
      })
      if (response.data.success) {
        setPrizes(response.data.data)
      }
    } catch (error) {
      console.error('Error al obtener el historial de premios:', error)
      toast.error('Error al cargar el historial de premios')
    } finally {
      setLoading(false)
    }
  }

  const fetchStudentProfile = async (studentId: number) => {
    try {
      const response = await axios.post('/api/studentprofile', {
        p_student_id: studentId
      })
      if (response.data.success && response.data.data.length > 0) {
        setPuntos(response.data.data[0].puntos)
      }
    } catch (error: any) {
      console.error('❌ Error al cargar el perfil:', error)
      toast.error('Error al cargar los puntos del estudiante')
    }
  }

  // Función para formatear la fecha
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }
    return new Date(dateString).toLocaleDateString('es-ES', options)
  }

  if (loading) {
    return (
      <AppLayout breadcrumbs={breadcrumbs}>
        <Head title='Tienda de Puntos - Premios' />
        <div className='flex h-64 items-center justify-center'>
          <div className='h-8 w-8 animate-spin rounded-full border-b-2 border-blue-500'></div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title='Tienda de Puntos - Premios' />
      <div className='w-full space-y-8 px-4 py-6 sm:px-6 lg:px-8'>
        <div className='mx-auto w-full max-w-7xl space-y-8'>
          {/* Header */}
          <div className='mb-8 flex items-center justify-between'>
            <h2 className='text-2xl font-bold text-gray-800'>Tienda de Premios</h2>
            <div className='flex items-center space-x-4'>
              <div className='rounded-lg bg-yellow-100 px-4 py-2'>
                <span className='font-medium'>Tus puntos: </span>
                <span className='font-bold text-yellow-700'>{puntos !== null ? `${puntos} pts` : '...'}</span>
              </div>
            </div>
          </div>

          {/* Grid de Premios */}
          <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-4'>
            {prizes.map((prize) => (
              <div key={prize.prize_id} className='rounded-xl bg-white p-3 shadow-sm transition-shadow hover:shadow-md'>
                <div className='mb-3 flex aspect-square items-center justify-center overflow-hidden rounded-lg bg-gray-100'>
                  {prize.image ? (
                    <img
                      src={prize.image.startsWith('http') ? prize.image : `/storage/prizes/${prize.image}`}
                      alt={prize.name}
                      className='h-full w-full object-cover'
                    />
                  ) : (
                    <div className='flex h-full w-full items-center justify-center bg-gray-100'>
                      <span className='text-gray-400'>Sin imagen</span>
                    </div>
                  )}
                </div>
                <div className='text-center'>
                  <h3 className='font-medium text-gray-900'>{prize.name}</h3>
                  <p className='text-sm text-gray-500'>{prize.description || 'Premio'}</p>
                  <div className='mt-2'>
                    <div className='flex items-center justify-center space-x-2'>
                      <span className='font-medium text-yellow-600'>{prize.points_store} pts</span>
                      <span className='text-gray-400'>•</span>
                      <span className='text-sm text-gray-500'>{prize.estado}</span>
                    </div>
                    <div className='mt-1 text-xs font-bold text-gray-500'>ADQUIRIDO</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
