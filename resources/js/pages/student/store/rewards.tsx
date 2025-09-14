import FlashMessages from '@/components/organisms/flash-messages'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
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

  if (loading) {
    return (
      <AppLayout breadcrumbs={breadcrumbs}>
        <Head title='Tienda de Puntos - Premios' />
        <div className='flex h-64 items-center justify-center'>
          <div className='border-primary h-8 w-8 animate-spin rounded-full border-b-2'></div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title='Tienda de Puntos - Premios' />
      <FlashMessages />

      <div className='relative flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4'>
        {/* Header Section */}
        <div className='mb-8 flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0'>
          <div className='bg-background rounded-lg border p-6 shadow-sm'>
            <h2 className='text-foreground text-2xl font-bold'>Premios</h2>
            <p className='text-muted-foreground text-sm'>Gestiona tus premios</p>
          </div>
          <div className='flex items-center space-x-4'>
            <div className='rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-2 dark:border-yellow-800 dark:bg-yellow-950'>
              <span className='font-medium text-yellow-900 dark:text-yellow-100'>Tus puntos: </span>
              <span className='font-bold text-yellow-700 dark:text-yellow-300'>{puntos !== null ? `${puntos} pts` : '...'}</span>
            </div>
          </div>
        </div>
        <PrizeGrid prizes={prizes} puntos={puntos} onPurchase={handlePurchase} />
      </div>
    </AppLayout>
  )
}

function PrizeGrid({ prizes, puntos, onPurchase }: { prizes: Prize[]; puntos: number | null; onPurchase: (id: number) => void }) {
  if (prizes.length === 0) {
    return <div className='bg-card text-muted-foreground mt-8 rounded-lg p-8 text-center shadow'>No hay premios en esta categoría.</div>
  }

  return (
    <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
      {prizes.map((prize) => (
        <Card key={prize.id} className='overflow-hidden'>
          <CardHeader className='p-0'>
            {prize.image ? (
              <img src={prize.image} alt={prize.name} className='h-48 w-full object-cover' />
            ) : (
              <div className='bg-muted text-muted-foreground flex h-48 items-center justify-center'>Sin imagen</div>
            )}
          </CardHeader>
          <CardContent className='p-4'>
            <h3 className='text-foreground text-lg font-semibold'>{prize.name}</h3>
            <p className='text-muted-foreground mt-1 text-sm'>{prize.description}</p>
            <div className='mt-3 flex items-center justify-between'>
              <span className='text-foreground text-sm font-medium'>{prize.points_cost} pts</span>
              <Button
                onClick={() => onPurchase(prize.id)}
                disabled={puntos !== null && (Number(puntos) < Number(prize.points_cost) || prize.stock <= 0 || !prize.is_active)}
                variant='default'
              >
                {!prize.is_active ? 'No disponible' : prize.stock <= 0 ? 'Sin stock' : 'Canjear'}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
