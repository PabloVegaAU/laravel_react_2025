import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import AppLayout from '@/layouts/app-layout'
import { Edit, Gift, Plus, Search, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { CreatePrizeModal } from './create-prize-modal'
import { EditPrizeModal } from './edit-prize-modal'

type Prize = {
  id: number
  name: string
  description: string
  image: string
  stock: number
  points_cost: number
  is_active: boolean
  available_until: string | null
}

export default function TeacherPrizesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedPrize, setSelectedPrize] = useState<Prize | null>(null)
  const [prizes, setPrizes] = useState<Prize[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch prizes
  useEffect(() => {
    const fetchPrizes = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/prizes')
        const data = await response.json()
        if (data.success) {
          setPrizes(data.data || [])
        }
      } catch (error) {
        console.error('Error fetching prizes:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPrizes()
  }, [])

  const filteredPrizes = prizes.filter(
    (prize) => prize.name.toLowerCase().includes(searchTerm.toLowerCase()) || prize.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro de que deseas eliminar este premio?')) {
      try {
        const response = await fetch(`/api/prizes/${id}`, {
          method: 'DELETE',
          headers: {
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
            Accept: 'application/json',
            'Content-Type': 'application/json'
          }
        })

        if (response.ok) {
          setPrizes(prizes.filter((prize) => prize.id !== id))
        } else {
          const errorData = await response.json()
          console.error('Error deleting prize:', errorData)
          alert('Error al eliminar el premio: ' + (errorData.message || 'Error desconocido'))
        }
      } catch (error) {
        console.error('Error deleting prize:', error)
        alert('Error al eliminar el premio. Por favor, inténtalo de nuevo.')
      }
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Sin fecha límite'
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (isLoading) {
    return (
      <AppLayout>
        <div className='flex h-64 items-center justify-center'>
          <div className='border-primary h-12 w-12 animate-spin rounded-full border-t-2 border-b-2'></div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className='container mx-auto p-6'>
        <div className='mb-6 flex items-center justify-between'>
          <div className='flex items-center space-x-2'>
            <Gift className='text-primary h-8 w-8' />
            <h1 className='text-2xl font-bold text-gray-800'>Gestión de Premios</h1>
          </div>
          <div className='flex items-center space-x-4'>
            <div className='relative w-64'>
              <Search className='absolute top-2.5 left-2.5 h-4 w-4 text-gray-500' />
              <Input
                type='search'
                placeholder='Buscar premio...'
                className='pl-8'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className='mr-2 h-4 w-4' />
              Crear Premio
            </Button>
          </div>
        </div>

        <div className='overflow-hidden rounded-lg border bg-white'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className='w-12'>#</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead className='text-center'>Disponible</TableHead>
                <TableHead className='text-center'>Stock</TableHead>
                <TableHead className='text-center'>Costo (puntos)</TableHead>
                <TableHead className='text-center'>Disponible hasta</TableHead>
                <TableHead className='text-right'>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPrizes.length > 0 ? (
                filteredPrizes.map((prize, index) => (
                  <TableRow key={prize.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className='font-medium'>
                      <div className='flex items-center space-x-3'>
                        {prize.image && <img src={`/storage/${prize.image}`} alt={prize.name} className='h-10 w-10 rounded object-cover' />}
                        <span>{prize.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className='max-w-xs truncate'>{prize.description || 'Sin descripción'}</TableCell>
                    <TableCell className='text-center'>
                      <span
                        className={`rounded-full px-2 py-1 text-xs ${prize.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                      >
                        {prize.is_active ? 'Activo' : 'Inactivo'}
                      </span>
                    </TableCell>
                    <TableCell className='text-center'>
                      <span
                        className={`rounded-full px-2 py-1 text-xs ${prize.stock > 0 ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}
                      >
                        {prize.stock}
                      </span>
                    </TableCell>
                    <TableCell className='text-center'>
                      <span className='font-medium'>{prize.points_cost}</span>
                    </TableCell>
                    <TableCell className='text-center text-sm'>{formatDate(prize.available_until)}</TableCell>
                    <TableCell className='flex justify-end space-x-2'>
                      <Button
                        variant='ghost'
                        size='icon'
                        onClick={() => {
                          setSelectedPrize(prize)
                          setIsEditModalOpen(true)
                        }}
                      >
                        <Edit className='h-4 w-4' />
                      </Button>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='text-red-600 hover:bg-red-50 hover:text-red-800'
                        onClick={() => handleDelete(prize.id)}
                      >
                        <Trash2 className='h-4 w-4' />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className='py-8 text-center text-gray-500'>
                    {searchTerm
                      ? 'No se encontraron premios que coincidan con la búsqueda.'
                      : 'No hay premios registrados. Crea tu primer premio para comenzar.'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <CreatePrizeModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={(newPrize) => {
          setPrizes([newPrize, ...prizes])
          setIsCreateModalOpen(false)
        }}
      />

      {selectedPrize && (
        <EditPrizeModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false)
            setSelectedPrize(null)
          }}
          prize={selectedPrize}
          onSuccess={(updatedPrize) => {
            setPrizes(prizes.map((prize) => (prize.id === updatedPrize.id ? updatedPrize : prize)))
            setIsEditModalOpen(false)
            setSelectedPrize(null)
          }}
        />
      )}
    </AppLayout>
  )
}
