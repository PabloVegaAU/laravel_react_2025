import AppLayout from '@/layouts/app-layout'
import { useUserStore } from '@/store/useUserStore'
import { Head } from '@inertiajs/react'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

// Define interface for icon props
interface IconProps {
  className?: string
}

// Icons from Heroicons (using CDN)
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
  const { setCurrentDashboardRole, user } = useUserStore()
  const [activeTab, setActiveTab] = useState<'todos' | 'avatares' | 'fondos' | 'premios' | 'logros'>('todos')
  const [items, setItems] = useState<Item[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [coins, setCoins] = useState(0)
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [achievements, setAchievements] = useState<any[]>([])
  const [renderKey, setRenderKey] = useState(0)

  useEffect(() => {
    setRenderKey((prev) => prev + 1)
    let cancelRequest = false

    // 1. Limpiar primero visualmente
    setItems([])
    setAchievements([])
    setIsLoading(true)

    // 2. Esperar 1 ciclo antes de hacer fetch para que el DOM reaccione
    const delay = setTimeout(() => {
      const fetchData = async () => {
        const studentId = user?.student_id
        if (!studentId) return

        try {
          if (activeTab === 'logros') {
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
          } else {
            const endpoints = {
              avatares: `/api/studentavatarslist`,
              fondos: `/api/studentbackgroundslist`,
              premios: `/api/studentprizeshistory`
            }

            let allItems: Item[] = []

            if (activeTab === 'todos' || activeTab === 'avatares') {
              const { data } = await axios.post(endpoints.avatares, { p_student_id: Number(studentId) })
              if (data.success) {
                allItems.push(
                  ...data.data.map((item: any) => ({
                    id: item.avatar_id,
                    name: item.name,
                    image: item.image,
                    tipo: 'avatar' as const,
                    fecha_obtencion: item.fecha_obtencion || null
                  }))
                )
              }
            }

            if (activeTab === 'todos' || activeTab === 'fondos') {
              const { data } = await axios.post(endpoints.fondos, { p_student_id: Number(studentId) })
              if (data.success) {
                allItems.push(
                  ...data.data.map((item: any) => ({
                    ...item,
                    tipo: 'fondo' as const,
                    fecha_obtencion: item.fecha_obtencion || null
                  }))
                )
              }
            }

            if (activeTab === 'todos' || activeTab === 'premios') {
              const { data } = await axios.post(endpoints.premios, { p_student_id: Number(studentId) })
              if (data.success) {
                allItems.push(
                  ...data.data.map((item: any) => ({
                    ...item,
                    tipo: 'premio' as const,
                    fecha_obtencion: item.fecha_obtencion || null
                  }))
                )
              }
            }

            if (!cancelRequest) {
              setItems(allItems)
            }
          }
        } catch (error) {
          toast.error('Error al cargar los objetos')
          console.error(error)
        } finally {
          if (!cancelRequest) {
            setIsLoading(false)
          }
        }
      }

      fetchData()
    }, 100) // Espera breve de 100ms para permitir re-render

    return () => {
      clearTimeout(delay)
      cancelRequest = true
    }
  }, [activeTab])

  const fetchAchievements = async () => {
    try {
      const studentId = user?.student_id
      if (!studentId) return
      const res = await axios.post('/api/studentachievementslist', {
        p_student_id: Number(studentId)
      })
      if (res.data.success) {
        // Map achievements to the Item type
        const achievementItems = res.data.data.map((achievement: any) => ({
          id: achievement.id,
          name: achievement.name,
          description: achievement.description,
          image: achievement.image || '/images/default-achievement.png', // Add a default image path
          tipo: 'logro' as const,
          fecha_obtencion: achievement.assigned_at,
          es_premiun: false
        }))

        setAchievements(achievementItems)
      }
    } catch (error) {
      console.error('Error fetching achievements:', error)
      toast.error('Error al cargar los logros')
    }
  }

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

  const handleClosePreview = () => {
    setIsPreviewOpen(false)
    setTimeout(() => setSelectedItem(null), 200)
  }

  const getFilteredItems = () => {
    // If we're in the 'logros' tab, only return achievements
    if (activeTab === 'logros') {
      return [...achievements]
    }

    // For other tabs, filter the regular items (excluding any logros)
    return items.filter((item) => {
      if (activeTab === 'todos') return item.tipo !== 'logro'
      if (activeTab === 'avatares') return item.tipo === 'avatar'
      if (activeTab === 'fondos') return item.tipo === 'fondo'
      if (activeTab === 'premios') return item.tipo === 'premio'
      return false
    })
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title='Mis Objetos' />
      <div className='w-full space-y-8 px-4 py-6 sm:px-6 lg:px-8'>
        <div className='mx-auto w-full max-w-7xl space-y-8'>
          {/* Header Section */}
          <div className='mb-8 flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0'>
            <div>
              <h2 className='text-2xl font-bold text-gray-800'>Mis Objetos</h2>
              <p className='text-sm text-gray-500'>Gestiona tus avatares, fondos y premios</p>
            </div>
            <div className='flex items-center space-x-4'>
              <div className='rounded-lg bg-yellow-100 px-4 py-2'>
                <span className='font-medium'>Monedas: </span>
                <span className='font-bold text-yellow-700'>{coins.toLocaleString()}</span>
              </div>
              <button
                className='flex items-center space-x-2 rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600'
                onClick={() => toast.info('Próximamente: Tienda de objetos')}
              >
                <span>Tienda</span>
                <SparklesIcon className='h-4 w-4' />
              </button>
            </div>
          </div>

          {/* Categories */}
          <div className='mb-6 flex space-x-2 overflow-x-auto pb-2'>
            {['todos', 'avatares', 'fondos', 'premios', 'logros'].map((tab) => {
              const isActive = activeTab === tab
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`flex items-center space-x-2 rounded-lg px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
                    isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
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
              <div className='h-8 w-8 animate-spin rounded-full border-b-2 border-blue-500'></div>
            </div>
          ) : getFilteredItems().length === 0 ? (
            <div className='flex h-64 flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6 text-center'>
              <SparklesIcon className='mx-auto h-12 w-12 text-gray-400' />
              <h3 className='mt-2 text-sm font-medium text-gray-900'>No hay objetos</h3>
              <p className='mt-1 text-sm text-gray-500'>
                {activeTab === 'todos' ? 'No tienes objetos en tu colección.' : `No tienes ${activeTab} en tu colección.`}
              </p>
              <div className='mt-6'>
                <button
                  type='button'
                  onClick={() => toast.info('Próximamente: Tienda de objetos')}
                  className='inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                >
                  <SparklesIcon className='mr-1.5 -ml-0.5 h-5 w-5' />
                  Visitar la tienda
                </button>
              </div>
            </div>
          ) : (
            <div key={renderKey} className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'>
              {getFilteredItems().map((item) => (
                <div
                  key={`${item.tipo}-${item.id}`}
                  onClick={() => handleItemClick(item)}
                  className='group relative cursor-pointer overflow-hidden rounded-xl bg-white p-3 shadow-sm transition-all hover:shadow-md hover:ring-2 hover:ring-blue-500'
                >
                  {/* Item Type Badge */}
                  <div className='absolute top-2 right-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-700'>
                    {getTypeIcon(item.tipo)}
                  </div>

                  {/* Item Image */}
                  <div className='relative mb-3 aspect-square w-full overflow-hidden rounded-lg bg-gray-100'>
                    {item.image ? (
                      <img
                        src={`/storage/${item.image}`}
                        alt={item.name}
                        className='h-full w-full object-cover transition-transform duration-300 group-hover:scale-105'
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.onerror = null
                          target.src = '/images/placeholder-item.png'
                          console.log('Error cargando imagen avatar:', item.image)
                        }}
                      />
                    ) : (
                      <div className='flex h-full items-center justify-center text-gray-400'>
                        <PhotoIcon className='h-12 w-12' />
                      </div>
                    )}
                  </div>

                  {/* Item Details */}
                  <div className='text-center'>
                    <h3 className='truncate text-sm font-medium text-gray-900'>{item.name}</h3>
                    <p className='mt-1 text-xs text-gray-500'>{getItemTypeLabel(item.tipo)}</p>

                    {/* Additional Info */}
                    <div className='mt-2 flex items-center justify-center space-x-2'>
                      {item.precio !== undefined && item.precio > 0 && (
                        <span className='flex items-center text-xs font-medium text-yellow-600'>
                          {item.precio.toLocaleString()} <span className='ml-0.5'>🪙</span>
                        </span>
                      )}

                      {item.nivel_desbloqueo && item.nivel_desbloqueo > 0 && (
                        <span className='text-xs text-gray-500'>Nv. {item.nivel_desbloqueo}</span>
                      )}

                      {item.fecha_obtencion && <span className='text-xs text-green-600'>Obtenido</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Item Preview Modal */}
          {isPreviewOpen && selectedItem && (
            <div className='bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4'>
              <div className='relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl'>
                <button
                  onClick={handleClosePreview}
                  className='absolute top-4 right-4 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500'
                >
                  <svg className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                  </svg>
                </button>

                <div className='flex flex-col items-center'>
                  {/* Item Image */}
                  <div className='relative mb-6 h-48 w-full overflow-hidden rounded-xl bg-gray-100'>
                    {selectedItem.image ? (
                      <img
                        src={`/storage/${selectedItem.image}`}
                        alt={selectedItem.name}
                        className='h-full w-full object-cover'
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.onerror = null
                          target.src = '/images/placeholder-item.png'
                        }}
                      />
                    ) : (
                      <div className='flex h-full items-center justify-center text-gray-400'>
                        <PhotoIcon />
                      </div>
                    )}
                  </div>

                  {/* Item Details */}
                  <div className='w-full text-center'>
                    <div className='mb-1 flex items-center justify-center'>
                      <span className='text-xl font-bold text-gray-900'>{selectedItem.name}</span>
                      <span className='ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800'>
                        {getItemTypeLabel(selectedItem.tipo)}
                      </span>
                    </div>

                    {selectedItem.description && <p className='mb-4 text-sm text-gray-600'>{selectedItem.description}</p>}

                    <div className='mt-4 grid grid-cols-2 gap-4 border-t border-gray-100 pt-4'>
                      {selectedItem.precio !== undefined && (
                        <div>
                          <p className='text-sm font-medium text-gray-500'>Precio</p>
                          <p className='mt-1 flex items-center justify-center text-lg font-bold text-yellow-600'>
                            {selectedItem.precio.toLocaleString()}
                            <span className='ml-1'>🪙</span>
                          </p>
                        </div>
                      )}

                      {selectedItem.nivel_desbloqueo && selectedItem.nivel_desbloqueo > 0 && (
                        <div>
                          <p className='text-sm font-medium text-gray-500'>Nivel Requerido</p>
                          <p className='mt-1 text-lg font-bold text-gray-900'>Nv. {selectedItem.nivel_desbloqueo}</p>
                        </div>
                      )}

                      {selectedItem.fecha_obtencion && (
                        <div>
                          <p className='text-sm font-medium text-gray-500'>Fecha de Obtención</p>
                          <p className='mt-1 text-sm text-gray-600'>
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
                          <p className='text-sm font-medium text-gray-500'>Tipo</p>
                          <p className='mt-1 text-sm font-medium text-purple-600'>Premium</p>
                        </div>
                      )}
                    </div>

                    <div className='mt-6'>
                      <button
                        type='button'
                        className='w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none'
                        onClick={handleClosePreview}
                      >
                        Cerrar
                      </button>
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
