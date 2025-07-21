import {
  createPrize as createPrizeApi,
  deletePrize as deletePrizeApi,
  fetchPrize as fetchPrizeApi,
  fetchPrizes as fetchPrizesApi,
  togglePrizeStatus as togglePrizeStatusApi,
  updatePrize as updatePrizeApi
} from '@/lib/api/prizes'
import { Prize, PrizeFilters } from '@/types/prize'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

interface UsePrizesOptions {
  initialFilters?: PrizeFilters
  autoFetch?: boolean
}

export function usePrizes(options: UsePrizesOptions = {}) {
  const { initialFilters = {}, autoFetch = true } = options

  const [prizes, setPrizes] = useState<Prize[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<PrizeFilters>(initialFilters)
  const [total, setTotal] = useState<number>(0)

  // Fetch all prizes with current filters
  const fetchPrizes = useCallback(
    async (customFilters?: PrizeFilters) => {
      try {
        setLoading(true)
        setError(null)

        const activeFilters = customFilters || filters
        const response = await fetchPrizesApi(activeFilters)

        setPrizes(response.data)
        setTotal(response.meta?.total || response.data.length)

        return response.data
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error al cargar los premios'
        setError(errorMessage)
        toast.error(errorMessage)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [filters]
  )

  // Fetch a single prize by ID
  const fetchPrize = useCallback(async (id: number | string) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetchPrizeApi(id)
      return response.data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar el premio'
      setError(errorMessage)
      toast.error(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Create a new prize
  const createPrize = useCallback(
    async (prizeData: Omit<Prize, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>) => {
      try {
        setLoading(true)
        setError(null)

        const response = await createPrizeApi(prizeData)
        toast.success('Premio creado exitosamente')

        // Refresh the prizes list
        await fetchPrizes()

        return response.data
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error al crear el premio'
        setError(errorMessage)
        toast.error(errorMessage)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [fetchPrizes]
  )

  // Update an existing prize
  const updatePrize = useCallback(
    async (id: number | string, prizeData: Partial<Prize>) => {
      try {
        setLoading(true)
        setError(null)

        const response = await updatePrizeApi(id, prizeData)
        toast.success('Premio actualizado exitosamente')

        // Refresh the prizes list
        await fetchPrizes()

        return response.data
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error al actualizar el premio'
        setError(errorMessage)
        toast.error(errorMessage)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [fetchPrizes]
  )

  // Delete a prize
  const deletePrize = useCallback(
    async (id: number | string) => {
      try {
        setLoading(true)
        setError(null)

        await deletePrizeApi(id)
        toast.success('Premio eliminado exitosamente')

        // Refresh the prizes list
        await fetchPrizes()

        return true
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error al eliminar el premio'
        setError(errorMessage)
        toast.error(errorMessage)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [fetchPrizes]
  )

  // Toggle prize active status
  const togglePrizeStatus = useCallback(
    async (id: number | string, isActive: boolean) => {
      try {
        setLoading(true)
        setError(null)

        const response = await togglePrizeStatusApi(id, isActive)
        const statusText = isActive ? 'activado' : 'desactivado'
        toast.success(`Premio ${statusText} exitosamente`)

        // Refresh the prizes list
        await fetchPrizes()

        return response.data
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error al actualizar el estado del premio'
        setError(errorMessage)
        toast.error(errorMessage)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [fetchPrizes]
  )

  // Auto-fetch prizes when filters change if autoFetch is true
  useEffect(() => {
    if (autoFetch) {
      fetchPrizes()
    }
  }, [filters, autoFetch, fetchPrizes])

  return {
    prizes,
    loading,
    error,
    filters,
    total,
    setFilters,
    fetchPrizes,
    fetchPrize,
    createPrize,
    updatePrize,
    deletePrize,
    togglePrizeStatus
  }
}

export default usePrizes
