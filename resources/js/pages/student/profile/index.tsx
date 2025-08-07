import ProgressBar from '@/components/organisms/progress-bar'
import { Button } from '@/components/ui/button'
import { useMobileNavigation } from '@/hooks/use-mobile-navigation'
import AppLayout from '@/layouts/app-layout'
import { useUserStore } from '@/store/useUserStore'
import { BreadcrumbItem, SharedData } from '@/types/core'
import { Head, Link, router, usePage } from '@inertiajs/react'
import axios from 'axios'
import { LogOut } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Perfil', href: 'student/profile' }]

type StudentProfile = {
  nombres: string
  apellidos: string
  anio_escolar: string
  grado: string
  nivel: string
  seccion: string
  celular: string
  fecha_nacimiento: string
  dni: string
  puntos?: number
  rango_nombre?: string
  rango_imagen?: string
  avatar_imagen?: string
  level_numero?: number
}

export default function Profile() {
  const cleanup = useMobileNavigation()
  const { auth } = usePage<SharedData>().props
  const { reset } = useUserStore()
  const [isLoading, setIsLoading] = useState(true)
  const [profile, setProfile] = useState<StudentProfile>({
    nombres: '',
    apellidos: '',
    anio_escolar: '',
    grado: '',
    nivel: '',
    seccion: '',
    celular: '',
    fecha_nacimiento: '',
    dni: '',
    puntos: 0,
    rango_nombre: '',
    rango_imagen: '',
    avatar_imagen: '',
    level_numero: 0
  })

  useEffect(() => {
    fetchProfileData()
  }, [])

  const fetchProfileData = async () => {
    try {
      setIsLoading(true)
      const profileRes = await axios.post('/api/studentprofile', {
        p_student_id: Number(auth.user?.id)
      })

      if (profileRes.data.success && profileRes.data.data?.length > 0) {
        const data = profileRes.data.data[0]
        setProfile((prev) => ({ ...prev, ...data }))
      }
    } catch (error) {
      console.error(error)
      toast.error('Error al cargar los datos del perfil')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <AppLayout breadcrumbs={breadcrumbs}>
        <div className='flex h-64 items-center justify-center'>
          <div className='h-8 w-8 animate-spin rounded-full border-b-2 border-blue-500'></div>
        </div>
      </AppLayout>
    )
  }

  const handleLogout = () => {
    cleanup()
    reset()
    router.flushAll()
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title='Tu Perfil' />
      <div className='w-full space-y-8 px-4 py-6 sm:px-6 lg:px-8'>
        <div className='mx-auto w-full max-w-7xl space-y-8'>
          <div className='mb-8 flex items-center justify-between'>
            <h2 className='text-2xl font-bold text-gray-800'>Mi Perfil</h2>
            <a href={route('student.objects')} className='rounded-lg bg-blue-500 px-6 py-2 text-white hover:bg-blue-600'>
              Mis objetos
            </a>
          </div>

          <div className='rounded-xl bg-white p-6 shadow-md'>
            <h3 className='mb-4 text-xl font-semibold text-gray-700'>Gamificación</h3>
            <div className='flex flex-col space-y-6 md:flex-row md:items-center md:space-x-6'>
              <ProgressBar />
              <div className='flex-1'>
                <div className='text-gray-600'>Level actual</div>
                <div className='flex items-center space-x-3'>
                  <div className='flex h-12 w-12 items-center justify-center rounded-full bg-orange-200 font-bold text-orange-700'>
                    {profile.level_numero}°
                  </div>
                  <div>
                    <div className='font-medium'>{profile.rango_nombre}</div>
                  </div>
                </div>
              </div>
              <div className='flex-1 text-right'>
                <div className='text-gray-600'>Puntos acumulados</div>
                <div className='text-2xl font-bold text-blue-600'>{Number(profile.puntos).toLocaleString()} pts</div>
              </div>
            </div>
          </div>

          <div className='rounded-xl bg-white p-6 shadow-md'>
            <h3 className='mb-6 text-xl font-semibold text-gray-700'>Datos personales</h3>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              {['nombres', 'apellidos', 'anio_escolar', 'grado', 'level_numero', 'seccion'].map((field) => (
                <div key={field} className='space-y-1'>
                  <label className='text-sm font-medium text-gray-600 capitalize'>
                    {field.replace('_', ' ').replace('anio_escolar', 'año escolar')}
                  </label>
                  <input
                    className='w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2'
                    value={profile[field as keyof StudentProfile] as string}
                    readOnly
                  />
                </div>
              ))}
            </div>
          </div>

          {/* LOGOUT */}
          <Button variant='destructive' asChild>
            <Link className='block w-full' method='post' href={route('logout')} as='button' onClick={handleLogout}>
              <LogOut className='mr-2' />
              Log out
            </Link>
          </Button>
        </div>
      </div>
    </AppLayout>
  )
}
