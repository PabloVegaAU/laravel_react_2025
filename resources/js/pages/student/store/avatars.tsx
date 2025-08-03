import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import AppLayout from '@/layouts/app-layout'
import { useUserStore } from '@/store/useUserStore'
import { BreadcrumbItem } from '@/types/core'
import { Head, usePage } from '@inertiajs/react'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Tienda de Puntos', href: '#' },
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
  const [selectedAvatar, setSelectedAvatar] = useState<Avatar | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

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

  const handlePreviewClick = (avatar: Avatar) => {
    setSelectedAvatar(avatar)
    setIsPreviewOpen(true)
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title='Tienda de Puntos - Avatares' />

      {/* Preview Modal */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Vista Previa del Avatar</DialogTitle>
          </DialogHeader>
          <div className='flex flex-col items-center gap-4 py-4'>
            <div className='relative h-64 w-64 overflow-hidden rounded-full bg-white shadow-md'>
              {selectedAvatar?.image ? (
                <img
                  src={selectedAvatar.image.startsWith('http') ? selectedAvatar.image : `/storage/${selectedAvatar.image}`}
                  alt={selectedAvatar.name}
                  className='h-full w-full object-contain p-4'
                />
              ) : (
                <div className='flex h-full w-full items-center justify-center rounded-full bg-gray-100'>
                  <span className='text-gray-400'>Sin imagen</span>
                </div>
              )}
            </div>
            <h3 className='text-xl font-medium'>{selectedAvatar?.name}</h3>
            <div className='flex items-center gap-2'>
              <span className='rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-800'>{selectedAvatar?.points_store} pts</span>
              <span className='rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800'>
                {selectedAvatar?.adquirido ? 'Adquirido' : 'Disponible'}
              </span>
            </div>
            <Button
              onClick={() => {
                if (selectedAvatar) {
                  handlePurchase(selectedAvatar.avatar_id)
                }
                setIsPreviewOpen(false)
              }}
              disabled={selectedAvatar?.adquirido}
              className={`mt-2 w-full ${selectedAvatar?.adquirido ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'}`}
            >
              {selectedAvatar?.estado_adquisicion}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
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
              <div
                key={avatar.avatar_id}
                className='group relative cursor-pointer rounded-xl bg-white p-3 shadow-sm transition-all hover:shadow-md'
                onClick={() => handlePreviewClick(avatar)}
              >
                <div className='mb-3 flex aspect-square items-center justify-center overflow-hidden rounded-lg bg-white shadow-sm transition-transform duration-300 group-hover:scale-105'>
                  {avatar.image ? (
                    <div className='relative h-full w-full'>
                      <img
                        src={avatar.image.startsWith('http') ? avatar.image : `/storage/${avatar.image}`}
                        alt={avatar.name}
                        className='h-full w-full object-contain p-4 transition-opacity duration-200 group-hover:opacity-90'
                      />
                    </div>
                  ) : (
                    <div className='flex h-full w-full items-center justify-center bg-gray-100'>
                      <span className='text-center text-gray-400'>Avatar {avatar.name}</span>
                    </div>
                  )}
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
                    onClick={(e) => {
                      e.stopPropagation()
                      handlePurchase(avatar.avatar_id)
                    }}
                    className={`mt-2 w-full rounded-md py-1 text-sm font-semibold transition-colors ${
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
