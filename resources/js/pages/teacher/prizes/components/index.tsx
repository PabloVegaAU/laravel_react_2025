import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import AppLayout from '@/layouts/app-layout'

import { Edit, Plus, Search, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { CreatePrizeModal } from './create-prize-modal'
import { EditPrizeModal } from './edit-prize-modal'

type Prize = {
  id: number
  name: string
  description: string
  points_cost: number
  stock: number
  available_until: string | null
  is_active: boolean
  image: string
  created_at: string
  updated_at: string
}

export default function TeacherPrizesPage() {
  const [prizes, setPrizes] = useState<Prize[]>([])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedPrize, setSelectedPrize] = useState<Prize | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  // Función para cargar los premios
  const fetchPrizes = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/teacher/prizes?page=1', {
        headers: {
          Accept: 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Error response:', errorText)
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      // Handle different possible response structures
      if (data.prizes && data.prizes.data) {
        setPrizes(data.prizes.data)
      } else if (Array.isArray(data)) {
        setPrizes(data)
      } else if (data.data) {
        setPrizes(data.data)
      } else {
        console.warn('Unexpected API response structure:', data)
        setPrizes([])
      }
    } catch (error) {
      console.error('Error al cargar los premios:', error)
      toast.error('Error al cargar la lista de premios')
    } finally {
      setIsLoading(false)
    }
  }

  // Cargar los premios al montar el componente
  useEffect(() => {
    fetchPrizes()
  }, [])

  const filteredPrizes = prizes.filter(
    (prize) =>
      prize.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prize.points_cost.toString().includes(searchTerm) ||
      prize.stock.toString().includes(searchTerm)
  )

  const handleDelete = async (prizeId: number) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este premio?')) {
      return
    }

    try {
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
      const response = await fetch(`/teacher/prizes/${prizeId}`, {
        method: 'POST',
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'X-CSRF-TOKEN': csrfToken,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ _method: 'DELETE' })
      })

      if (!response.ok) {
        throw new Error('Error al eliminar el premio')
      }

      // Recargar la lista completa de premios
      await fetchPrizes()
      toast.success('Premio eliminado exitosamente')
    } catch (error) {
      console.error('Error deleting prize:', error)
      toast.error(error instanceof Error ? error.message : 'Error al eliminar el premio')
    }
  }

  return (
    <AppLayout>
      <div className='container mx-auto p-6'>
        <div className='mb-6 flex items-center justify-between'>
          <h1 className='text-2xl font-bold text-gray-800'>Gestión de Premios</h1>
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

        <div className='rounded-lg border bg-white'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Imagen</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Puntos</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPrizes.map((prize) => (
                <TableRow key={prize.id}>
                  <TableCell>
                    {prize.image ? (
                      <img
                        src={prize.image.startsWith('http') ? prize.image : `/storage/${prize.image}`}
                        alt={prize.name}
                        className='h-10 w-10 rounded-full object-cover'
                      />
                    ) : (
                      <div className='flex h-10 w-10 items-center justify-center rounded-full bg-gray-200'>
                        <span className='text-xs text-gray-500'>Sin imagen</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className='font-medium'>{prize.name}</TableCell>
                  <TableCell>{prize.points_cost} pts</TableCell>
                  <TableCell>{prize.stock} unidades</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        prize.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {prize.is_active ? 'Activo' : 'Inactivo'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className='flex space-x-2'>
                      <Button
                        variant='ghost'
                        size='icon'
                        onClick={() => {
                          setSelectedPrize(prize)
                          setIsEditModalOpen(true)
                        }}
                        title='Editar premio'
                      >
                        <Edit className='h-4 w-4' />
                      </Button>
                      <Button
                        variant='ghost'
                        size='icon'
                        onClick={() => handleDelete(prize.id)}
                        className='text-red-600 hover:text-red-800'
                        title='Eliminar premio'
                      >
                        <Trash2 className='h-4 w-4' />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <CreatePrizeModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={async () => {
          await fetchPrizes()
          setIsCreateModalOpen(false)
        }}
      />

      {selectedPrize && (
        <EditPrizeModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false)
            setSelectedPrize(null) // Reset selectedPrize when closing
          }}
          prize={selectedPrize}
          onSuccess={async () => {
            await fetchPrizes()
            setIsEditModalOpen(false)
            setSelectedPrize(null) // Reset selectedPrize after successful update
          }}
        />
      )}
    </AppLayout>
  )
}
