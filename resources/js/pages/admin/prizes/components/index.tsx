import DataTable from '@/components/organisms/data-table'
import FlashMessages from '@/components/organisms/flash-messages'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import AppLayout from '@/layouts/app-layout'
import { PaginatedResponse } from '@/types/core'
import { Prize } from '@/types/prize'
import { Head } from '@inertiajs/react'
import { Plus, Search } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { CreatePrizeModal } from './create-prize-modal'
import { EditPrizeModal } from './edit-prize-modal'
import { prizeColumns } from './prize-columns'

export default function TeacherPrizesPage() {
  const [prizesData, setPrizesData] = useState<PaginatedResponse<Prize> | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedPrize, setSelectedPrize] = useState<Prize | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10
  })

  // Función para cargar los premios con paginación y búsqueda
  const fetchPrizes = useCallback(async () => {
    try {
      setIsLoading(true)
      const queryParams = new URLSearchParams({
        page: (pagination.pageIndex + 1).toString(),
        per_page: pagination.pageSize.toString(),
        ...(searchTerm && { search: searchTerm })
      })

      const response = await fetch(`/admin/prizes?${queryParams}`, {
        headers: {
          Accept: 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setPrizesData(data.prizes || data)
    } catch (error) {
      console.error('Error al cargar los premios:', error)
      toast.error('Error al cargar la lista de premios')
    } finally {
      setIsLoading(false)
    }
  }, [pagination.pageIndex, pagination.pageSize, searchTerm])

  // Cargar los premios cuando cambia la paginación o el término de búsqueda
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchPrizes()
    }, 300) // Debounce de 300ms para la búsqueda

    return () => clearTimeout(timeoutId)
  }, [fetchPrizes])

  // Manejar edición de premio
  const handleEdit = (prize: Prize) => {
    setSelectedPrize(prize)
    setIsEditModalOpen(true)
  }

  // Actualizar columnas para incluir el manejador de edición
  const columns = prizeColumns({ onEdit: handleEdit }) // ✅ Correct: Passing object with onEdit

  return (
    <AppLayout>
      <Head title='Gestión de Premios' />
      <FlashMessages />

      <div className='relative flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4'>
        <div className='mb-6 flex items-center justify-between'>
          <h1 className='text-2xl font-bold text-gray-900 dark:text-gray-100'>Gestión de Premios</h1>
          <div className='flex items-center space-x-4'>
            <div className='relative w-64'>
              <Search className='absolute top-2.5 left-2.5 h-4 w-4 text-gray-500 dark:text-gray-400' />
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

        <div className='dark:border-sidebar-border dark:bg-sidebar rounded-lg border border-gray-200 bg-white'>
          {prizesData && <DataTable data={prizesData} columns={columns} />}
        </div>
      </div>

      <CreatePrizeModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          fetchPrizes()
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
          onSuccess={() => {
            fetchPrizes()
            setIsEditModalOpen(false)
            setSelectedPrize(null)
          }}
        />
      )}
    </AppLayout>
  )
}
