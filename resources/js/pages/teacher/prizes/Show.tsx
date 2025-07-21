import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PageProps } from '@/types'
import { Prize } from '@/types/prize'
import { usePage } from '@inertiajs/react'
import { ArrowLeft } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function ShowPrizePage({ auth, prizeId: initialPrizeId }: PageProps<{ prizeId: string }>) {
  const { props } = usePage()
  const [prize, setPrize] = useState<Prize | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const prizeId = initialPrizeId || props.prizeId

  useEffect(() => {
    if (prizeId) {
      fetchPrize()
    }
  }, [prizeId])

  const fetchPrize = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/prizes/${prizeId}`, {
        headers: {
          Accept: 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error('No se pudo cargar la información del premio')
      }

      const data = await response.json()
      setPrize(data.data)
    } catch (err) {
      console.error('Error fetching prize:', err)
      setError(err instanceof Error ? err.message : 'Error al cargar el premio')
    } finally {
      setIsLoading(false)
    }
  }

  const handleBack = () => {
    window.history.back()
  }

  const handleEdit = () => {
    window.location.href = `/teacher/prizes/${prizeId}/edit`
  }

  if (isLoading) {
    return (
      <div className='container mx-auto py-6'>
        <div className='flex items-center justify-center py-10'>
          <div className='border-primary h-8 w-8 animate-spin rounded-full border-b-2'></div>
          <span className='ml-2'>Cargando información del premio...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='container mx-auto py-6'>
        <div className='relative rounded border border-red-200 bg-red-50 px-4 py-3 text-red-700' role='alert'>
          <strong className='font-bold'>¡Error!</strong>
          <span className='block sm:inline'> {error}</span>
          <div className='mt-4'>
            <Button variant='outline' onClick={handleBack}>
              <ArrowLeft className='mr-2 h-4 w-4' />
              Volver atrás
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (!prize) {
    return (
      <div className='container mx-auto py-6'>
        <div className='py-10 text-center'>
          <p className='text-gray-500'>No se encontró el premio solicitado.</p>
          <div className='mt-4'>
            <Button variant='outline' onClick={handleBack}>
              <ArrowLeft className='mr-2 h-4 w-4' />
              Volver a la lista de premios
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='container mx-auto py-6'>
      <div className='mb-6 flex items-center justify-between'>
        <Button variant='ghost' onClick={handleBack} className='-ml-2'>
          <ArrowLeft className='mr-2 h-5 w-5' />
          Volver
        </Button>
        <Button onClick={handleEdit}>Editar Premio</Button>
      </div>

      <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
        <div className='space-y-6 md:col-span-2'>
          <Card>
            <CardHeader>
              <CardTitle className='text-2xl'>{prize.name}</CardTitle>
              <CardDescription>{prize.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <p className='text-sm font-medium text-gray-500'>Stock</p>
                  <p className='text-lg font-semibold'>{prize.stock}</p>
                </div>
                <div>
                  <p className='text-sm font-medium text-gray-500'>Costo en Puntos</p>
                  <p className='text-lg font-semibold'>{prize.points_cost}</p>
                </div>
                <div>
                  <p className='text-sm font-medium text-gray-500'>Estado</p>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      prize.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {prize.is_active ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
                <div>
                  <p className='text-sm font-medium text-gray-500'>Disponible hasta</p>
                  <p className='text-sm'>
                    {prize.available_until
                      ? new Date(prize.available_until).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })
                      : 'Sin fecha límite'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className='text-xl'>Descripción</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='whitespace-pre-line text-gray-700'>{prize.description || 'No hay descripción disponible.'}</p>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className='sticky top-6'>
            <CardHeader>
              <CardTitle>Imagen del Premio</CardTitle>
            </CardHeader>
            <CardContent className='flex justify-center'>
              {prize.image ? (
                <img src={`/storage/${prize.image}`} alt={prize.name} className='max-h-64 w-auto rounded object-contain' />
              ) : (
                <div className='flex h-48 w-full items-center justify-center rounded bg-gray-100 text-gray-400'>Sin imagen</div>
              )}
            </CardContent>
          </Card>

          <Card className='mt-6'>
            <CardHeader>
              <CardTitle>Acciones</CardTitle>
            </CardHeader>
            <CardContent className='space-y-3'>
              <Button variant='outline' className='w-full' onClick={() => (window.location.href = `/teacher/prizes/${prize.id}/edit`)}>
                Editar Premio
              </Button>
              <Button variant='outline' className='w-full' onClick={handleBack}>
                Volver a la lista
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
