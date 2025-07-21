import AppLayout from '@/layouts/app-layout'
import { useUserStore } from '@/store/useUserStore'
import { BreadcrumbItem } from '@/types/core'
import { Head, usePage } from '@inertiajs/react'
import axios from 'axios'
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

type ProgressData = {
  nivel_actual: number
  porcentaje_completado: number
  rango: string
  posicion_ranking: number
  total_puntos: number
  progress_percent: number
  experience_achieved: number
  experience_required: number
  experience_max: number
}

export default function Profile() {
  const { setCurrentDashboardRole, user } = useUserStore()
  const { props } = usePage<{ user: any }>()
  const [isEditing, setIsEditing] = useState(false)
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
  const [progress, setProgress] = useState<ProgressData>({
    nivel_actual: 0,
    porcentaje_completado: 0,
    rango: 'Bronce',
    posicion_ranking: 0,
    total_puntos: 0,
    progress_percent: 0,
    experience_achieved: 0,
    experience_required: 0,
    experience_max: 0
  })

  useEffect(() => {
    setCurrentDashboardRole('/student/profile')
    fetchProfileData()
  }, [])

  const fetchProfileData = async () => {
    try {
      setIsLoading(true)
      const profileRes = await axios.post('/api/studentprofile', {
        p_student_id: Number(user?.student_id)
      })
      const progressRes = await axios.post('/api/studentprogressbar', {
        p_user_id: Number(user?.student_id)
      })
      if (profileRes.data.success && profileRes.data.data?.length > 0) {
        const data = profileRes.data.data[0]
        setProfile((prev) => ({ ...prev, ...data }))
      }
      if (progressRes.data.success && progressRes.data.data?.length > 0) {
        setProgress(progressRes.data.data[0])
      }
    } catch (error) {
      console.error(error)
      toast.error('Error al cargar los datos del perfil')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveChanges = async () => {
    try {
      const response = await axios.post('/api/studentprofileupd', {
        p_user_id: Number(user?.student_id),
        celular: profile.celular
      })
      if (response.data.success) {
        toast.success('Perfil actualizado correctamente')
        setIsEditing(false)
      } else {
        toast.error('Error al actualizar el perfil')
      }
    } catch (error) {
      console.error(error)
      toast.error('Error al actualizar el perfil')
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfile((prev) => ({ ...prev, [name]: value }))
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
              <div className='flex-1'>
                <div className='rounded-xl border border-green-300 bg-green-50 p-4 shadow-sm'>
                  <div className='mb-1 text-sm font-medium text-gray-600'>Nivel actual</div>
                  <div className='mb-2 flex items-center space-x-2'>
                    <div className='text-3xl font-bold text-green-700'>{progress.nivel_actual}</div>
                    <span className='rounded-full bg-green-200 px-3 py-1 text-xs font-semibold text-green-900'>
                      {progress.progress_percent}% completado
                    </span>
                  </div>

                  <div className='mb-2 h-3 w-full overflow-hidden rounded-full bg-gray-200'>
                    <div
                      className='h-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-700 ease-in-out'
                      style={{ width: `${progress.progress_percent}%` }}
                    ></div>
                  </div>

                  <div className='flex justify-between text-xs text-gray-600'>
                    <span>XP: {Number(progress.experience_achieved).toFixed(0)}</span>
                    <span>Objetivo: {Number(progress.experience_required).toFixed(0)}</span>
                    <span>Máx: {Number(progress.experience_max).toFixed(0)}</span>
                  </div>
                </div>
              </div>
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
                  <label className='text-sm font-medium text-gray-600 capitalize'>{field.replace('_', ' ')}</label>
                  <input
                    className='w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2'
                    value={profile[field as keyof StudentProfile] as string}
                    readOnly
                  />
                </div>
              ))}
            </div>

            <div className='mt-8 flex items-center justify-between border-t border-gray-100 pt-6'>
              <div className='space-x-3'>
                {isEditing ? (
                  <button
                    onClick={() => {
                      setIsEditing(false)
                      fetchProfileData()
                    }}
                    className='rounded-lg border border-gray-300 px-6 py-2.5 text-gray-700 hover:bg-gray-50'
                  >
                    Cancelar
                  </button>
                ) : (
                  <button className='rounded-lg bg-red-100 px-6 py-2.5 text-red-600 hover:bg-red-200'>Cambiar contraseña</button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
