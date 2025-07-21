import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { usePrizes } from '@/hooks/usePrizes'
import { CreatePrizeModal } from '@/pages/teacher/prizes/components/create-prize-modal'
import { EditPrizeModal } from '@/pages/teacher/prizes/components/edit-prize-modal'
import { Prize } from '@/types/prize'
import { Plus } from 'lucide-react'
import React, { useCallback, useMemo, useState } from 'react'
import { PrizeFilters } from './PrizeFilters'
import { PrizeGrid } from './PrizeGrid'

type SortOption = 'name_asc' | 'name_desc' | 'points_asc' | 'points_desc' | 'newest' | 'oldest'

interface PrizeManagementProps {
  initialPrizes?: Prize[]
  canManage?: boolean
  onRedeem?: (prize: Prize) => void
  showRedeemButton?: boolean
  className?: string
}

export const PrizeManagement: React.FC<PrizeManagementProps> = ({
  initialPrizes = [],
  canManage = false,
  onRedeem,
  showRedeemButton = false,
  className = ''
}) => {
  const { toast } = useToast()
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('name_asc')
  const [filters, setFilters] = useState({
    inStock: false,
    activeOnly: false,
    minPoints: '',
    maxPoints: ''
  })

  // State for modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingPrize, setEditingPrize] = useState<Prize | null>(null)

  // Use the usePrizes hook for data fetching and mutations
  const { prizes = [], loading, error, createPrize, updatePrize, deletePrize, togglePrizeStatus } = usePrizes(initialPrizes)

  // Calculate active filter count
  const activeFilterCount = useMemo(() => {
    return Object.values(filters).filter(Boolean).length
  }, [filters])

  // Filter and sort prizes based on search, filters, and sort options
  const filteredAndSortedPrizes = useMemo(() => {
    let result = [...prizes]

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase()
      result = result.filter((prize) => prize.name.toLowerCase().includes(searchLower) || prize.description?.toLowerCase().includes(searchLower))
    }

    // Apply filters
    if (filters.inStock) {
      result = result.filter((prize) => prize.stock > 0)
    }

    if (filters.activeOnly) {
      result = result.filter((prize) => prize.is_active)
    }

    if (filters.minPoints) {
      const minPoints = parseInt(filters.minPoints, 10)
      if (!isNaN(minPoints)) {
        result = result.filter((prize) => prize.points_cost >= minPoints)
      }
    }

    if (filters.maxPoints) {
      const maxPoints = parseInt(filters.maxPoints, 10)
      if (!isNaN(maxPoints)) {
        result = result.filter((prize) => prize.points_cost <= maxPoints)
      }
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'name_asc':
          return a.name.localeCompare(b.name)
        case 'name_desc':
          return b.name.localeCompare(a.name)
        case 'points_asc':
          return a.points_cost - b.points_cost
        case 'points_desc':
          return b.points_cost - a.points_cost
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        default:
          return 0
      }
    })

    return result
  }, [prizes, search, filters, sortBy])

  // Handle filter changes
  const handleFilterChange = useCallback((newFilters: Partial<typeof filters>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters
    }))
  }, [])

  // Reset all filters
  const resetFilters = useCallback(() => {
    setFilters({
      inStock: false,
      activeOnly: false,
      minPoints: '',
      maxPoints: ''
    })
    setSearch('')
  }, [])

  // Handle prize creation
  const handleCreatePrize = async (data: any) => {
    try {
      await createPrize(data)
      toast({
        title: '¡Éxito!',
        description: 'El premio se ha creado correctamente.',
        variant: 'default'
      })
      setIsCreateModalOpen(false)
    } catch (error) {
      console.error('Error creating prize:', error)
      toast({
        title: 'Error',
        description: 'No se pudo crear el premio. Por favor, inténtalo de nuevo.',
        variant: 'destructive'
      })
      throw error
    }
  }

  // Handle prize update
  const handleUpdatePrize = async (id: number, data: any) => {
    if (!editingPrize) return

    try {
      await updatePrize(id, data)
      toast({
        title: '¡Éxito!',
        description: 'El premio se ha actualizado correctamente.',
        variant: 'default'
      })
      setEditingPrize(null)
    } catch (error) {
      console.error('Error updating prize:', error)
      toast({
        title: 'Error',
        description: 'No se pudo actualizar el premio. Por favor, inténtalo de nuevo.',
        variant: 'destructive'
      })
      throw error
    }
  }

  // Handle prize deletion
  const handleDeletePrize = async (id: number) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este premio?')) return

    try {
      await deletePrize(id)
      toast({
        title: '¡Éxito!',
        description: 'El premio se ha eliminado correctamente.',
        variant: 'default'
      })
    } catch (error) {
      console.error('Error deleting prize:', error)
      toast({
        title: 'Error',
        description: 'No se pudo eliminar el premio. Por favor, inténtalo de nuevo.',
        variant: 'destructive'
      })
    }
  }

  // Handle prize status toggle
  const handleToggleStatus = async (id: number, isActive: boolean) => {
    try {
      await togglePrizeStatus(id, isActive)
      toast({
        title: '¡Éxito!',
        description: `El premio se ha ${isActive ? 'activado' : 'desactivado'} correctamente.`,
        variant: 'default'
      })
    } catch (error) {
      console.error('Error toggling prize status:', error)
      toast({
        title: 'Error',
        description: `No se pudo ${isActive ? 'activar' : 'desactivar'} el premio. Por favor, inténtalo de nuevo.`,
        variant: 'destructive'
      })
    }
  }

  // Handle prize redemption
  const handleRedeemPrize = (prize: Prize) => {
    if (onRedeem) {
      onRedeem(prize)
    }
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <div className='flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Gestión de Premios</h2>
          <p className='text-muted-foreground'>
            {filteredAndSortedPrizes.length} {filteredAndSortedPrizes.length === 1 ? 'premio' : 'premios'} encontrados
          </p>
        </div>

        {canManage && (
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className='mr-2 h-4 w-4' />
            Nuevo Premio
          </Button>
        )}
      </div>

      <PrizeFilters
        search={search}
        onSearchChange={setSearch}
        sortBy={sortBy}
        onSortChange={setSortBy}
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={resetFilters}
        activeFilterCount={activeFilterCount}
      />

      {error && (
        <div className='bg-destructive/10 text-destructive rounded-md p-4'>
          <p>Error al cargar los premios: {error.message || 'Error desconocido'}</p>
        </div>
      )}

      <PrizeGrid prizes={filteredAndSortedPrizes} loading={loading} onRedeem={showRedeemButton ? handleRedeemPrize : undefined} />

      {/* Create Prize Modal */}
      {canManage && <CreatePrizeModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} onSubmit={handleCreatePrize} />}

      {/* Edit Prize Modal */}
      {canManage && editingPrize && (
        <EditPrizeModal
          isOpen={!!editingPrize}
          onClose={() => setEditingPrize(null)}
          prize={editingPrize}
          onSubmit={(data) => handleUpdatePrize(editingPrize.id, data)}
          onDelete={() => handleDeletePrize(editingPrize.id)}
          onToggleStatus={(isActive) => handleToggleStatus(editingPrize.id, isActive)}
        />
      )}
    </div>
  )
}

export default PrizeManagement
