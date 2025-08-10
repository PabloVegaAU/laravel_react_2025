import AppLayout from '@/layouts/app-layout'
import { useUserStore } from '@/store/useUserStore'
import { SharedData } from '@/types/core'
import { Head, Link, usePage } from '@inertiajs/react'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

// Props para los iconos
interface IconProps {
  className?: string
}

// Componentes de iconos
const PhotoIcon: React.FC<IconProps> = ({ className = 'h-5 w-5' }) => (
  <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className={className}>
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z'
    />
  </svg>
)

const UserCircleIcon: React.FC<IconProps> = ({ className = 'h-5 w-5' }) => (
  <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className={className}>
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z'
    />
  </svg>
)

const TrophyIcon: React.FC<IconProps> = ({ className = 'h-5 w-5' }) => (
  <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className={className}>
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M9.497 14.25H7.5m4.007-4.242a4.5 4.5 0 01-1.507 1.093M9.497 9.75H12m-2.51 1.093a4.5 4.5 0 011.507-1.093m-1.507 1.093A4.49 4.49 0 017.5 9.75m8.382-3.976a4.5 4.5 0 011.653 1.13m-1.653-1.13a4.5 4.5 0 00-1.653-1.13m-13.5 0a4.49 4.49 0 00-1.652 1.13m1.652-1.13a4.5 4.5 0 011.653-1.13m13.5 0c.171.285.27.619.27.976 0 .358-.099.691-.27.976m0 0a4.5 4.5 0 01-1.653 1.13m-13.5 0a4.5 4.5 0 01-1.653-1.13m13.5 0c.171-.285.27-.618.27-.976 0-.358-.099-.691-.27-.976m0 0a4.5 4.5 0 00-1.653-1.13M12 3v.75m0 3.75a2.25 2.25 0 01-2.25 2.25M12 8.25a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z'
    />
  </svg>
)

const SparklesIcon: React.FC<IconProps> = ({ className = 'h-5 w-5' }) => (
  <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className={className}>
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z'
    />
  </svg>
)

type Item = {
  id: number
  name: string
  image: string
  nivel_desbloqueo?: number
  precio?: number
  fecha_obtencion?: string
  es_premiun?: boolean
  tipo: 'avatar' | 'fondo' | 'premio' | 'logro'
  description?: string
}

const breadcrumbs = [
  { title: 'Inicio', href: '/student/dashboard' },
  { title: 'Mis Objetos', href: '#' }
]

export default function MyObjects() {
  const { auth } = usePage<SharedData>().props
  const { setAvatar, setBackground } = useUserStore()
  const [activeTab, setActiveTab] = useState<'todos' | 'avatares' | 'fondos' | 'premios' | 'logros'>('todos')
  const [items, setItems] = useState<Item[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [achievements, setAchievements] = useState<any[]>([])
  const [renderKey, setRenderKey] = useState(0)
  const [puntos, setPuntos] = useState<number | null>(null)
  const [isApplying, setIsApplying] = useState(false)

  const studentId = auth.user?.id

  // Obtiene el perfil del estudiante para mostrar sus puntos
  const fetchStudentProfile = async (studentId: number) => {
    try {
      const response = await axios.post('/api/studentprofile', {
        p_student_id: studentId
      })
      if (response.data.success && response.data.data.length > 0) {
        setPuntos(response.data.data[0].puntos)
      }
    } catch (error) {
      toast.error('Error al cargar los puntos del estudiante')
    }
  }

  // Efecto para cargar los objetos según la pestaña activa
  useEffect(() => {
    setRenderKey((prev) => prev + 1)
    let cancelRequest = false

    const resetState = () => {
      setItems([])
      setAchievements([])
      setIsLoading(true)
    }

    const fetchData = async () => {
      if (!studentId) return

      resetState()
      await fetchStudentProfile(Number(studentId))

      try {
        if (activeTab === 'logros') {
          await fetchAchievements()
        } else {
          await fetchItems()
        }
      } catch (error) {
        toast.error('Error al cargar los objetos')
      } finally {
        if (!cancelRequest) {
          setIsLoading(false)
        }
      }
    }

    const fetchAchievements = async () => {
      const res = await axios.post('/api/studentachievementslist', {
        p_student_id: Number(studentId)
      })

      if (res.data.success && !cancelRequest) {
        const achievementItems = res.data.data.map((achievement: any) => ({
          id: achievement.id,
          name: achievement.name,
          description: achievement.description,
          image: achievement.image || '/images/default-achievement.png',
          tipo: 'logro' as const,
          fecha_obtencion: achievement.assigned_at,
          es_premiun: false
        }))
        setAchievements(achievementItems)
      }
    }

    const fetchItems = async () => {
      const endpoints = {
        avatares: activeTab === 'todos' || activeTab === 'avatares' ? '/api/studentavatarslist' : null,
        fondos: activeTab === 'todos' || activeTab === 'fondos' ? '/api/studentbackgroundslist' : null,
        premios: activeTab === 'todos' || activeTab === 'premios' ? '/api/studentprizeshistory' : null
      }

      const requests = []

      if (endpoints.avatares) {
        requests.push(axios.post(endpoints.avatares, { p_student_id: Number(studentId) }))
      }
      if (endpoints.fondos) {
        requests.push(axios.post(endpoints.fondos, { p_student_id: Number(studentId) }))
      }
      if (endpoints.premios) {
        requests.push(axios.post(endpoints.premios, { p_student_id: Number(studentId) }))
      }

      const responses = await Promise.all(requests)
      const allItems: Item[] = []

      responses.forEach(({ data }, index) => {
        if (!data.success || cancelRequest) return

        const items = data.data.map((item: any) => {
          const baseItem = {
            ...item,
            fecha_obtencion: item.fecha_obtencion || null
          }

          if (index === 0 && endpoints.avatares) {
            return { ...baseItem, tipo: 'avatar' as const, id: item.avatar_id }
          } else if ((index === 0 && !endpoints.avatares && endpoints.fondos) || (index === 1 && endpoints.avatares)) {
            return { ...baseItem, tipo: 'fondo' as const }
          } else {
            return { ...baseItem, tipo: 'premio' as const }
          }
        })

        allItems.push(...items)
      })

      if (!cancelRequest) {
        setItems(allItems)
      }
    }

    const timer = setTimeout(fetchData, 100)
    return () => {
      clearTimeout(timer)
      cancelRequest = true
    }
  }, [activeTab, studentId])

  const getItemTypeLabel = (type: string) => {
    switch (type) {
      case 'avatar':
        return 'Avatar'
      case 'fondo':
        return 'Fondo'
      case 'premio':
        return 'premio'
      case 'logro':
        return 'Logro'
      default:
        return type
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'avatar':
        return <UserCircleIcon className='h-5 w-5' />
      case 'fondo':
        return <PhotoIcon className='h-5 w-5' />
      case 'premio':
        return <TrophyIcon className='h-5 w-5' />
      case 'logro':
        return <SparklesIcon className='h-5 w-5' />
      default:
        return <SparklesIcon className='h-5 w-5' />
    }
  }

  const handleItemClick = (item: Item) => {
    setSelectedItem(item)
    setIsPreviewOpen(true)
  }

  // Aplica un objeto (avatar o fondo) al perfil del usuario
  const handleApplyItem = async (item: Item) => {
    if (!item || !studentId) {
      toast.error('Error: No se pudo identificar el usuario o el objeto')
      return
    }

    const itemId = item.tipo === 'fondo' ? (item as any).background_id : item.id
    if (itemId === undefined || itemId === null) {
      toast.error(`Error: No se pudo identificar el ID del ${item.tipo}`)
      return
    }

    try {
      setIsApplying(true)
      const endpoint = item.tipo === 'avatar' ? '/api/studentavatarapply' : '/api/studentbackgroundapply'

      const requestData = new URLSearchParams({
        p_student_id: studentId.toString(),
        [item.tipo === 'avatar' ? 'p_avatar_id' : 'p_background_id']: itemId.toString()
      })

      // Actualizar la UI inmediatamente para mejor experiencia de usuario
      if (item.tipo === 'avatar') {
        setAvatar(item.image)
      } else {
        setBackground(item.image)
      }

      const response = await axios.post(endpoint, requestData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      })

      const result = response.data?.data?.[0] || response.data?.[0]

      if (result?.error === 0 && result?.mensa) {
        toast.success(result.mensa)
        // Actualizar el store con los cambios
        useUserStore.getState().setUser({
          ...auth.user,
          [item.tipo]: item.image
        })
        setIsPreviewOpen(false)
      } else {
        throw new Error(result?.mensa || 'Error al aplicar el objeto')
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.data?.[0]?.mensa || error.response?.data?.[0]?.mensa || `Error al aplicar el ${item.tipo}`
      toast.error(errorMessage)
    } finally {
      setIsApplying(false)
    }
  }

  const handleClosePreview = () => {
    setIsPreviewOpen(false)
    setTimeout(() => setSelectedItem(null), 200)
  }

  // Filtra los ítems según la pestaña activa
  const getFilteredItems = () => {
    if (activeTab === 'logros') return [...achievements]

    const filterMap = {
      todos: (item: Item) => item.tipo !== 'logro',
      avatares: (item: Item) => item.tipo === 'avatar',
      fondos: (item: Item) => item.tipo === 'fondo',
      premios: (item: Item) => item.tipo === 'premio'
    }

    return items.filter(filterMap[activeTab as keyof typeof filterMap] || (() => false))
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title='Mis Objetos' />

      <div className='p-4w-full flex h-full flex-1 flex-col gap-4 space-y-8 overflow-x-auto rounded-xl px-4 py-6 sm:px-6 lg:px-8'>
        <div className='mx-auto w-full max-w-7xl space-y-8'>
          {/* Header Section */}
          <div className='mb-8 flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0'>
            <div className='bg-background rounded-lg border p-6 shadow-sm'>
              <h2 className='text-foreground text-2xl font-bold'>Mis Objetos</h2>
              <p className='text-muted-foreground text-sm'>Gestiona tus avatares, fondos y premios</p>
            </div>
            <div className='flex items-center space-x-4'>
              <div className='rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-2 dark:border-yellow-800 dark:bg-yellow-950'>
                <span className='font-medium text-yellow-900 dark:text-yellow-100'>Tus puntos: </span>
                <span className='font-bold text-yellow-700 dark:text-yellow-300'>{puntos !== null ? `${puntos} pts` : '...'}</span>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className='bg-background mb-6 flex space-x-2 overflow-x-auto rounded-lg border p-6 shadow-sm'>
            {['todos', 'avatares', 'fondos', 'premios', 'logros'].map((tab) => {
              const isActive = activeTab === tab
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`flex items-center space-x-2 rounded-lg px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
                    isActive ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  {tab === 'todos' && <SparklesIcon className='h-4 w-4' />}
                  {tab === 'avatares' && <UserCircleIcon className='h-4 w-4' />}
                  {tab === 'fondos' && <PhotoIcon className='h-4 w-4' />}
                  {tab === 'premios' && <TrophyIcon className='h-4 w-4' />}
                  {tab === 'logros' && <SparklesIcon className='h-4 w-4' />}
                  <span>{tab.charAt(0).toUpperCase() + tab.slice(1)}</span>
                </button>
              )
            })}
          </div>

          {/* Items Grid */}
          {isLoading ? (
            <div className='flex h-64 items-center justify-center'>
              <div className='border-primary h-8 w-8 animate-spin rounded-full border-b-2'></div>
            </div>
          ) : getFilteredItems().length === 0 ? (
            <div className='flex h-64 flex-col items-center justify-center rounded-lg bg-white p-6 text-center'>
              <SparklesIcon className='text-muted-foreground mx-auto h-12 w-12' />
              <h3 className='text-foreground mt-2 text-sm font-medium'>No hay objetos</h3>
              <p className='text-muted-foreground mt-1 text-sm'>
                {activeTab === 'todos' ? 'No tienes objetos en tu colección.' : `No tienes ${activeTab} en tu colección.`}
              </p>
              <div className='mt-6'>
                <Link
                  href={route('student.store')}
                  className='bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:outline-primary inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2'
                >
                  <SparklesIcon className='mr-1.5 -ml-0.5 h-5 w-5' />
                  Visitar la tienda
                </Link>
              </div>
            </div>
          ) : (
            <div key={renderKey} className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'>
              {getFilteredItems().map((item) => (
                <div
                  key={`${item.tipo}-${item.id || Math.random().toString(36).substr(2, 9)}`}
                  onClick={() => handleItemClick(item)}
                  className='group bg-card hover:ring-primary/50 relative cursor-pointer overflow-hidden rounded-xl border p-3 shadow-sm transition-all hover:shadow-md hover:ring-2'
                >
                  {/* Item Type Badge */}
                  <div className='bg-primary/10 text-primary absolute top-2 right-2 z-10 flex h-6 w-6 items-center justify-center rounded-full'>
                    {getTypeIcon(item.tipo)}
                  </div>

                  {/* Item Image */}
                  <div className='bg-muted relative mb-3 aspect-square w-full overflow-hidden rounded-lg'>
                    {item.image ? (
                      <img
                        src={`${item.image}`}
                        alt={item.name}
                        className='h-full w-full object-cover transition-transform duration-300 group-hover:scale-105'
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.onerror = null
                          target.src = '/images/placeholder-item.png'
                        }}
                      />
                    ) : (
                      <div className='text-muted-foreground flex h-full items-center justify-center'>
                        <PhotoIcon className='h-12 w-12' />
                      </div>
                    )}
                  </div>

                  {/* Item Details */}
                  <div className='text-center'>
                    <h3 className='text-foreground truncate text-sm font-medium'>{item.name}</h3>
                    <p className='text-muted-foreground mt-1 text-xs'>{getItemTypeLabel(item.tipo)}</p>
                    {/* Additional Info */}
                    <div className='mt-2 flex items-center justify-center space-x-2'>
                      {item.precio !== undefined && item.precio > 0 && (
                        <span className='flex items-center text-xs font-medium text-yellow-600 dark:text-yellow-400'>
                          {item.precio.toLocaleString()} <span className='ml-0.5'>🪙</span>
                        </span>
                      )}

                      {item.nivel_desbloqueo && item.nivel_desbloqueo > 0 && (
                        <span className='text-muted-foreground text-xs'>Nv. {item.nivel_desbloqueo}</span>
                      )}

                      {item.fecha_obtencion && <span className='text-xs text-green-600 dark:text-green-400'>Obtenido</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Item Preview Modal */}
          {isPreviewOpen && selectedItem && (
            <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4'>
              <div className='bg-background relative w-full max-w-lg rounded-2xl border p-6 shadow-xl'>
                <button
                  onClick={handleClosePreview}
                  className='text-muted-foreground hover:bg-muted hover:text-foreground absolute top-4 right-4 rounded-full p-1'
                >
                  <svg className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                  </svg>
                </button>

                <div className='flex flex-col items-center'>
                  {/* Item Image */}
                  <div className='bg-muted relative mb-6 h-48 w-full overflow-hidden rounded-xl'>
                    {selectedItem.image ? (
                      <img
                        src={`${selectedItem.image}`}
                        alt={selectedItem.name}
                        className='h-full w-full object-cover'
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.onerror = null
                          target.src = '/images/placeholder-item.png'
                        }}
                      />
                    ) : (
                      <div className='text-muted-foreground flex h-full items-center justify-center'>
                        <PhotoIcon />
                      </div>
                    )}
                  </div>

                  {/* Item Details */}
                  <div className='w-full text-center'>
                    <div className='mb-1 flex items-center justify-center'>
                      <span className='text-foreground text-xl font-bold'>{selectedItem.name}</span>
                      <span className='bg-primary/10 text-primary ml-2 rounded-full px-2 py-0.5 text-xs font-medium'>
                        {getItemTypeLabel(selectedItem.tipo)}
                      </span>
                    </div>

                    {selectedItem.description && <p className='text-muted-foreground mb-4 text-sm'>{selectedItem.description}</p>}

                    <div className='border-border mt-4 grid grid-cols-2 gap-4 border-t pt-4'>
                      {selectedItem.precio !== undefined && (
                        <div>
                          <p className='text-muted-foreground text-sm font-medium'>Precio</p>
                          <p className='mt-1 flex items-center justify-center text-lg font-bold text-yellow-600 dark:text-yellow-400'>
                            {selectedItem.precio.toLocaleString()}
                            <span className='ml-1'>🪙</span>
                          </p>
                        </div>
                      )}

                      {selectedItem.nivel_desbloqueo && selectedItem.nivel_desbloqueo > 0 && (
                        <div>
                          <p className='text-muted-foreground text-sm font-medium'>Nivel Requerido</p>
                          <p className='text-foreground mt-1 text-lg font-bold'>Nv. {selectedItem.nivel_desbloqueo}</p>
                        </div>
                      )}

                      {selectedItem.fecha_obtencion && (
                        <div>
                          <p className='text-muted-foreground text-sm font-medium'>Fecha de Obtención</p>
                          <p className='text-muted-foreground mt-1 text-sm'>
                            {new Date(selectedItem.fecha_obtencion).toLocaleDateString('es-ES', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      )}

                      {selectedItem.es_premiun && (
                        <div>
                          <p className='text-muted-foreground text-sm font-medium'>Tipo</p>
                          <p className='mt-1 text-sm font-medium text-purple-600 dark:text-purple-400'>Premium</p>
                        </div>
                      )}
                    </div>

                    <div className='mt-4 flex justify-between space-x-2'>
                      <button
                        type='button'
                        onClick={handleClosePreview}
                        className='bg-muted text-muted-foreground hover:bg-muted/80 focus:ring-primary flex-1 rounded-md px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-offset-2 focus:outline-none'
                      >
                        Cerrar
                      </button>
                      {(selectedItem?.tipo === 'avatar' || selectedItem?.tipo === 'fondo') && (
                        <button
                          type='button'
                          onClick={() => handleApplyItem(selectedItem)}
                          disabled={isApplying}
                          className='bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary flex-1 rounded-md px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:opacity-50'
                        >
                          {isApplying ? 'Aplicando...' : `Usar este ${selectedItem.tipo}`}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  )
}
