import AppLayout from '@/layouts/app-layout'
import { useUserStore } from '@/store/useUserStore'
import { UserInertia } from '@/types/auth'
import { BreadcrumbItem } from '@/types/core'
import { Head, usePage } from '@inertiajs/react'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

type Prize = {
  id: number
  name: string
  description: string
  image: string
  stock: number
  points_cost: number
  is_active: boolean
  available_until: string | null
  created_at: string
  updated_at: string
  already_acquired: boolean
  estado_adquisicion: string
  fecha_adquisicion?: string | null
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Tienda de Puntos', href: '#' },
  { title: 'Premios', href: 'student/store/rewards' }
]

export default function Dashboard() {
  const { setUser } = useUserStore()
  const { props } = usePage<{ user: UserInertia }>()
  const [prizes, setPrizes] = useState<Prize[]>([])
  const [puntos, setPuntos] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'disponible' | 'adquirido'>('disponible')

  useEffect(() => {
    if (props.user) {
      setUser(props.user)

      fetchStudentProfile(props.user.id)
      fetchPrizes(props.user.id)
    }
  }, [props.user])

  const fetchPrizes = async (studentId: number) => {
    try {
      setLoading(true)
      const response = await axios.post('/api/prizelistforpurchase', {
        p_student_id: studentId
      })
      if (response.data.success) {
        setPrizes(response.data.data || [])
      }
    } catch (error) {
      console.error('Error al obtener los premios:', error)
      toast.error('Error al cargar los premios')
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

  const handlePurchase = async (prizeId: number) => {
    const confirm = window.confirm('¿Estás seguro de que deseas canjear este premio?')
    if (!confirm) return

    try {
      const response = await axios.post('/api/prizepurchase', {
        p_student_id: props.user.id,
        p_prize_id: prizeId
      })

      const result = response.data.data?.[0] || {}

      if (result.error < 0) {
        toast.error(result.mensa)
      } else {
        toast.success(result.mensa)
        await Promise.all([fetchPrizes(props.user.id), fetchStudentProfile(props.user.id)])
      }
    } catch (error: any) {
      console.error('❌ Error en el canje:', error)
      toast.error('Ocurrió un error inesperado al procesar el canje.')
    }
  }

  const filteredPrizes = prizes.filter((prize) => (activeTab === 'adquirido' ? prize.already_acquired : !prize.already_acquired))

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
      <div className='container mx-auto px-4 py-6'>
        <div className='mb-6 flex items-center justify-between'>
          <h1 className='text-2xl font-bold'>Premios</h1>
          <div className='rounded-lg bg-yellow-100 px-4 py-2'>
            <span className='font-medium'>Tus puntos: </span>
            <span className='font-bold text-yellow-700'>{puntos !== null ? `${puntos} pts` : '...'}</span>
          </div>
        </div>

        {/* Tabs */}
        <div className='mb-6 flex space-x-2 border-b'>
          <button
            onClick={() => setActiveTab('disponible')}
            className={`px-4 py-2 font-medium ${activeTab === 'disponible' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Disponible
          </button>
          <button
            onClick={() => setActiveTab('adquirido')}
            className={`px-4 py-2 font-medium ${activeTab === 'adquirido' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Adquirido
          </button>
        </div>

        {filteredPrizes.length === 0 ? (
          <div className='mt-8 rounded-lg bg-white p-8 text-center shadow'>
            <p className='text-gray-500'>
              {activeTab === 'adquirido' ? 'No has canjeado ningún premio aún.' : 'No hay premios disponibles para canjear.'}
            </p>
          </div>
        ) : (
          <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
            {filteredPrizes.map((prize) => (
              <div key={prize.id} className='overflow-hidden rounded-lg border bg-white shadow-sm transition-shadow hover:shadow-md'>
                <div className='h-48 bg-gray-100'>
                  {prize.image ? (
                    <img
                      src={prize.image.startsWith('http') ? prize.image : `${prize.image}`}
                      alt={prize.name}
                      className='h-full w-full object-cover'
                    />
                  ) : (
                    <div className='flex h-full items-center justify-center bg-gray-200 text-gray-400'>
                      <span>Sin imagen</span>
                    </div>
                  )}
                </div>
                <div className='p-4'>
                  <h3 className='text-lg font-semibold'>{prize.name}</h3>
                  <p className='mt-1 text-sm text-gray-600'>{prize.description}</p>
                  <div className='mt-3 flex items-center justify-between'>
                    <span className='text-sm font-medium text-gray-900'>{prize.points_cost} pts</span>
                    {prize.already_acquired ? (
                      <span className='rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800'>Canjeado</span>
                    ) : (
                      <button
                        onClick={() => handlePurchase(prize.id)}
                        disabled={puntos !== null && (puntos < prize.points_cost || prize.stock <= 0 || !prize.is_active)}
                        className={`rounded-full px-4 py-1 text-sm font-medium text-white ${puntos !== null && puntos >= prize.points_cost && prize.stock > 0 && prize.is_active ? 'bg-blue-500 hover:bg-blue-600' : 'cursor-not-allowed bg-gray-400'}`}
                        title={!prize.is_active ? 'No disponible' : prize.stock <= 0 ? 'Sin stock' : ''}
                      >
                        {!prize.is_active ? 'No disponible' : prize.stock <= 0 ? 'Sin stock' : 'Canjear'}
                      </button>
                    )}
                  </div>
                  {prize.fecha_adquisicion && (
                    <p className='mt-2 text-xs text-gray-500'>Canjeado el: {new Date(prize.fecha_adquisicion).toLocaleDateString('es-ES')}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  )
}
