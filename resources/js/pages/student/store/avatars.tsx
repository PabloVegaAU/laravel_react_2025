import AppLayout from '@/layouts/app-layout'
import { useUserStore } from '@/store/useUserStore'
import { BreadcrumbItem } from '@/types/core'
import { Head, usePage } from '@inertiajs/react'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Tienda de Puntos', href: 'student/store' },
  { title: 'Avatares', href: 'student/store/avatars' }
]

type InertiaUser = {
  id: number
  name: string
  email: string
  student_id: number
}

type Avatar = {
  avatar_id: number
  name: string
  image: string
  points_store: number
  adquirido: boolean
  estado_adquisicion: string
}

export default function Dashboard() {
  const { setUser, setCurrentDashboardRole } = useUserStore()
  const { props } = usePage<{ user: InertiaUser }>()
  const [avatars, setAvatars] = useState<Avatar[]>([])
  const [puntos, setPuntos] = useState<number | null>(null)

  useEffect(() => {
    setCurrentDashboardRole('/student/store/avatars')

    if (props.user) {
      setUser({
        ...props.user,
        student_id: String(props.user.student_id)
      })

      fetchStudentProfile(props.user.student_id)
      fetchAvatars(props.user.student_id)
    }
  }, [props.user])

  const fetchAvatars = async (studentId: number) => {
    try {
      const response = await axios.post('/api/avatarlistforpurchase', {
        p_student_id: studentId
      })
      if (response.data.success) setAvatars(response.data.data)
    } catch (error) {
      console.error('Error al obtener los avatares:', error)
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
      if (error.response) {
        console.error('❌ Error de servidor:', error.response.data)
      } else {
        console.error('❌ Error al conectar con la API:', error.message)
      }
    }
  }

  const handlePurchase = async (avatarId: number) => {
    const confirm = window.confirm('¿Estás seguro de que deseas adquirir este avatar?')
    if (!confirm) return

    try {
      const response = await axios.post('/api/avatarpurchase', {
        p_student_id: props.user.student_id,
        p_avatar_id: avatarId
      })

      const result = response.data.data[0]

      if (result.error < 0) {
        toast.error(result.mensa)
      } else {
        toast.success(result.mensa)
        await Promise.all([fetchAvatars(props.user.student_id), fetchStudentProfile(props.user.student_id)])
      }
    } catch (error: any) {
      console.error('❌ Error en la compra:', error)
      toast.error('Ocurrió un error inesperado al procesar la compra.')
    }
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title='Tienda de Puntos - Avatares' />
      <div className='w-full space-y-8 px-4 py-6 sm:px-6 lg:px-8'>
        <div className='mx-auto w-full max-w-7xl space-y-8'>
          {/* Header */}
          <div className='mb-8 flex items-center justify-between'>
            <h2 className='text-2xl font-bold text-gray-800'>Tienda de Avatares</h2>
            <div className='flex items-center space-x-4'>
              <div className='rounded-lg bg-yellow-100 px-4 py-2'>
                <span className='font-medium'>Tus puntos: </span>
                <span className='font-bold text-yellow-700'>{puntos !== null ? `${puntos} pts` : '...'}</span>
              </div>
            </div>
          </div>

          {/* Grid de Avatares */}
          <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'>
            {avatars.map((avatar) => (
              <div key={avatar.avatar_id} className='rounded-xl bg-white p-3 shadow-sm transition-shadow hover:shadow-md'>
                <div className='mb-3 flex aspect-square items-center justify-center overflow-hidden rounded-lg bg-gray-100'>
                  <img src={`/storage/avatars/${avatar.image}`} alt={avatar.name} className='h-full w-full object-contain' />
                </div>
                <div className='text-center'>
                  <h3 className='font-medium text-gray-900'>{avatar.name}</h3>
                  <p className='text-sm text-gray-500'>Avatar</p>
                  <div className='mt-2 flex items-center justify-center space-x-2'>
                    <span className='font-medium text-yellow-600'>{avatar.points_store} pts</span>
                    <span className='text-gray-400'>|</span>
                    <span className='text-sm text-gray-500'>{avatar.adquirido ? 'Adquirido' : 'Disponible'}</span>
                  </div>
                  <button
                    disabled={avatar.adquirido}
                    onClick={() => handlePurchase(avatar.avatar_id)}
                    className={`mt-2 w-full rounded-md py-1 text-sm font-semibold ${
                      avatar.adquirido ? 'cursor-not-allowed bg-red-200 text-red-900' : 'bg-green-300 text-green-900 hover:bg-green-400'
                    }`}
                  >
                    {avatar.estado_adquisicion}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
