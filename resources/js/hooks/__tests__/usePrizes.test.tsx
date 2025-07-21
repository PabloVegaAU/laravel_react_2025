import { PrizesProvider, usePrizesContext } from '@/contexts/PrizesContext'
import { act, renderHook } from '@testing-library/react-hooks'
import { QueryClient, QueryClientProvider } from 'react-query'
import { toast } from 'sonner'

// Mock the API module
jest.mock('@/lib/api/prizes', () => ({
  fetchPrizes: jest.fn(),
  fetchPrize: jest.fn(),
  createPrize: jest.fn(),
  updatePrize: jest.fn(),
  deletePrize: jest.fn(),
  togglePrizeStatus: jest.fn()
}))

// Mock the toast
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn()
  }
}))

// Create a test wrapper component
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={new QueryClient()}>
    <PrizesProvider>{children}</PrizesProvider>
  </QueryClientProvider>
)

describe('usePrizes', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should fetch prizes on mount', async () => {
    const mockPrizes = [{ id: 1, name: 'Test Prize', points_cost: 100, stock: 5, is_active: true }]

    require('@/lib/api/prizes').fetchPrizes.mockResolvedValueOnce({
      data: mockPrizes,
      meta: { total: 1 }
    })

    const { result, waitForNextUpdate } = renderHook(() => usePrizesContext(), { wrapper })

    expect(result.current.loading).toBe(true)

    await waitForNextUpdate()

    expect(result.current.loading).toBe(false)
    expect(result.current.prizes).toEqual(mockPrizes)
    expect(result.current.total).toBe(1)
  })

  it('should handle fetch error', async () => {
    const errorMessage = 'Failed to fetch prizes'
    require('@/lib/api/prizes').fetchPrizes.mockRejectedValueOnce(new Error(errorMessage))

    const { result, waitForNextUpdate } = renderHook(() => usePrizesContext(), { wrapper })

    await waitForNextUpdate()

    expect(result.current.error).toBe('Error al cargar los premios')
    expect(toast.error).toHaveBeenCalledWith('Error al cargar los premios')
  })

  it('should create a new prize', async () => {
    const newPrize = {
      id: 2,
      name: 'New Prize',
      description: 'Test description',
      points_cost: 200,
      stock: 10,
      is_active: true,
      created_at: '2023-01-01',
      updated_at: '2023-01-01'
    }

    require('@/lib/api/prizes').createPrize.mockResolvedValueOnce({
      data: newPrize
    })

    require('@/lib/api/prizes').fetchPrizes.mockResolvedValueOnce({
      data: [newPrize],
      meta: { total: 1 }
    })

    const { result, waitForNextUpdate } = renderHook(() => usePrizesContext(), { wrapper })

    await act(async () => {
      await result.current.createPrize({
        name: 'New Prize',
        description: 'Test description',
        points_cost: 200,
        stock: 10,
        is_active: true
      })
    })

    expect(toast.success).toHaveBeenCalledWith('Premio creado exitosamente')
    expect(require('@/lib/api/prizes').createPrize).toHaveBeenCalledWith({
      name: 'New Prize',
      description: 'Test description',
      points_cost: 200,
      stock: 10,
      is_active: true
    })
  })

  it('should update a prize', async () => {
    const updatedPrize = {
      id: 1,
      name: 'Updated Prize',
      description: 'Updated description',
      points_cost: 300,
      stock: 5,
      is_active: true,
      updated_at: '2023-01-02'
    }

    require('@/lib/api/prizes').updatePrize.mockResolvedValueOnce({
      data: updatedPrize
    })

    require('@/lib/api/prizes').fetchPrizes.mockResolvedValueOnce({
      data: [updatedPrize],
      meta: { total: 1 }
    })

    const { result, waitForNextUpdate } = renderHook(() => usePrizesContext(), { wrapper })

    await act(async () => {
      await result.current.updatePrize(1, {
        name: 'Updated Prize',
        description: 'Updated description',
        points_cost: 300
      })
    })

    expect(toast.success).toHaveBeenCalledWith('Premio actualizado exitosamente')
    expect(require('@/lib/api/prizes').updatePrize).toHaveBeenCalledWith(1, {
      name: 'Updated Prize',
      description: 'Updated description',
      points_cost: 300
    })
  })

  it('should delete a prize', async () => {
    require('@/lib/api/prizes').deletePrize.mockResolvedValueOnce(undefined)

    require('@/lib/api/prizes').fetchPrizes.mockResolvedValueOnce({
      data: [],
      meta: { total: 0 }
    })

    const { result, waitForNextUpdate } = renderHook(() => usePrizesContext(), { wrapper })

    await act(async () => {
      await result.current.deletePrize(1)
    })

    expect(toast.success).toHaveBeenCalledWith('Premio eliminado exitosamente')
    expect(require('@/lib/api/prizes').deletePrize).toHaveBeenCalledWith(1)
  })

  it('should toggle prize status', async () => {
    const toggledPrize = {
      id: 1,
      name: 'Test Prize',
      is_active: false,
      updated_at: '2023-01-03'
    }

    require('@/lib/api/prizes').togglePrizeStatus.mockResolvedValueOnce({
      data: toggledPrize
    })

    require('@/lib/api/prizes').fetchPrizes.mockResolvedValueOnce({
      data: [toggledPrize],
      meta: { total: 1 }
    })

    const { result, waitForNextUpdate } = renderHook(() => usePrizesContext(), { wrapper })

    await act(async () => {
      await result.current.togglePrizeStatus(1, false)
    })

    expect(toast.success).toHaveBeenCalledWith('Premio desactivado exitosamente')
    expect(require('@/lib/api/prizes').togglePrizeStatus).toHaveBeenCalledWith(1, false)
  })
})
