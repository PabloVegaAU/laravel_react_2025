import { useToast } from '@/components/ui/use-toast'
import { usePrizes } from '@/hooks/usePrizes'
import { Prize } from '@/types/prize'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { PrizeManagement } from '../PrizeManagement'

// Mock the usePrizes hook
jest.mock('@/hooks/usePrizes')

// Mock the useToast hook
jest.mock('@/components/ui/use-toast', () => ({
  useToast: jest.fn()
}))

// Mock the CreatePrizeModal and EditPrizeModal components
jest.mock('@/pages/teacher/prizes/components/create-prize-modal', () => ({
  CreatePrizeModal: ({ isOpen, onClose, onSubmit }: any) => (
    <div data-testid='create-prize-modal' data-open={isOpen}>
      <button onClick={() => onClose()}>Close Create Modal</button>
      <button onClick={() => onSubmit({ name: 'New Prize', points_cost: 1000 })}>Submit Create</button>
    </div>
  )
}))

jest.mock('@/pages/teacher/prizes/components/edit-prize-modal', () => ({
  EditPrizeModal: ({ isOpen, onClose, onSubmit, onDelete, onToggleStatus, prize }: any) => (
    <div data-testid='edit-prize-modal' data-open={isOpen}>
      <div data-testid='editing-prize'>{prize?.name}</div>
      <button onClick={() => onClose()}>Close Edit Modal</button>
      <button onClick={() => onSubmit({ name: 'Updated Prize', points_cost: 1500 })}>Submit Update</button>
      <button onClick={() => onDelete()}>Delete Prize</button>
      <button onClick={() => onToggleStatus(!prize?.is_active)}>Toggle Status</button>
    </div>
  )
}))

describe('PrizeManagement', () => {
  const mockPrizes: Prize[] = [
    {
      id: 1,
      name: 'Test Prize 1',
      description: 'Description 1',
      points_cost: 1000,
      stock: 5,
      is_active: true,
      available_until: '2023-12-31T23:59:59Z',
      image: 'prizes/test1.jpg',
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z',
      deleted_at: null
    },
    {
      id: 2,
      name: 'Test Prize 2',
      description: 'Description 2',
      points_cost: 2000,
      stock: 0,
      is_active: false,
      available_until: '2023-12-31T23:59:59Z',
      image: 'prizes/test2.jpg',
      created_at: '2023-01-02T00:00:00Z',
      updated_at: '2023-01-02T00:00:00Z',
      deleted_at: null
    }
  ]

  const mockUsePrizes = usePrizes as jest.MockedFunction<typeof usePrizes>
  const mockToast = useToast as jest.MockedFunction<typeof useToast>

  const mockCreatePrize = jest.fn().mockResolvedValue({})
  const mockUpdatePrize = jest.fn().mockResolvedValue({})
  const mockDeletePrize = jest.fn().mockResolvedValue({})
  const mockTogglePrizeStatus = jest.fn().mockResolvedValue({})

  const toastMock = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()

    mockUsePrizes.mockReturnValue({
      prizes: mockPrizes,
      loading: false,
      error: null,
      createPrize: mockCreatePrize,
      updatePrize: mockUpdatePrize,
      deletePrize: mockDeletePrize,
      togglePrizeStatus: mockTogglePrizeStatus
    })

    mockToast.mockReturnValue({
      toast: toastMock,
      dismiss: jest.fn(),
      toasts: []
    })

    // Mock window.confirm
    window.confirm = jest.fn().mockReturnValue(true)
  })

  it('renders the prize management component', () => {
    render(<PrizeManagement />)

    expect(screen.getByText('Gestión de Premios')).toBeInTheDocument()
    expect(screen.getByText('2 premios encontrados')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Buscar premios...')).toBeInTheDocument()
  })

  it('shows loading state when prizes are being fetched', () => {
    mockUsePrizes.mockReturnValueOnce({
      prizes: [],
      loading: true,
      error: null,
      createPrize: mockCreatePrize,
      updatePrize: mockUpdatePrize,
      deletePrize: mockDeletePrize,
      togglePrizeStatus: mockTogglePrizeStatus
    })

    const { container } = render(<PrizeManagement />)

    const skeletons = container.querySelectorAll('.animate-pulse')
    expect(skeletons.length).toBeGreaterThan(0)
  })

  it('shows error message when there is an error', () => {
    const errorMessage = 'Failed to load prizes'
    mockUsePrizes.mockReturnValueOnce({
      prizes: [],
      loading: false,
      error: new Error(errorMessage),
      createPrize: mockCreatePrize,
      updatePrize: mockUpdatePrize,
      deletePrize: mockDeletePrize,
      togglePrizeStatus: mockTogglePrizeStatus
    })

    render(<PrizeManagement />)

    expect(screen.getByText(`Error al cargar los premios: ${errorMessage}`)).toBeInTheDocument()
  })

  it('filters prizes based on search input', () => {
    render(<PrizeManagement />)

    const searchInput = screen.getByPlaceholderText('Buscar premios...')
    fireEvent.change(searchInput, { target: { value: 'Test Prize 1' } })

    expect(screen.getByText('1 premio encontrado')).toBeInTheDocument()
    expect(screen.getByText('Test Prize 1')).toBeInTheDocument()
    expect(screen.queryByText('Test Prize 2')).not.toBeInTheDocument()
  })

  it('sorts prizes based on sort option', () => {
    render(<PrizeManagement />)

    // Open the sort select
    fireEvent.click(screen.getByText('Nombre (A-Z)'))

    // Select sort by price descending
    fireEvent.click(screen.getByText('Precio (mayor a menor)'))

    // The prizes should be sorted by points_cost in descending order
    const prizeCards = screen.getAllByTestId('prize-card')
    expect(prizeCards[0]).toHaveAttribute('data-prize-id', '2') // Higher points
    expect(prizeCards[1]).toHaveAttribute('data-prize-id', '1') // Lower points
  })

  it('filters prizes based on inStock filter', () => {
    render(<PrizeManagement />)

    // Open the filter popover
    fireEvent.click(screen.getByText('Filtros'))

    // Check the inStock checkbox
    const inStockCheckbox = screen.getByLabelText('Solo disponibles en stock')
    fireEvent.click(inStockCheckbox)

    // Only the prize with stock > 0 should be shown
    expect(screen.getByText('1 premio encontrado')).toBeInTheDocument()
    expect(screen.getByText('Test Prize 1')).toBeInTheDocument()
    expect(screen.queryByText('Test Prize 2')).not.toBeInTheDocument()
  })

  it('resets all filters when reset button is clicked', () => {
    render(<PrizeManagement />)

    // Set some filters
    const searchInput = screen.getByPlaceholderText('Buscar premios...')
    fireEvent.change(searchInput, { target: { value: 'Test Prize 1' } })

    // Open the filter popover
    fireEvent.click(screen.getByText('Filtros'))

    // Check the inStock checkbox
    const inStockCheckbox = screen.getByLabelText('Solo disponibles en stock')
    fireEvent.click(inStockCheckbox)

    // Click the reset button
    fireEvent.click(screen.getByText('Restablecer'))

    // All prizes should be shown again
    expect(screen.getByText('2 premios encontrados')).toBeInTheDocument()
    expect(screen.getByText('Test Prize 1')).toBeInTheDocument()
    expect(screen.getByText('Test Prize 2')).toBeInTheDocument()
  })

  it('opens create prize modal when new prize button is clicked', () => {
    render(<PrizeManagement canManage={true} />)

    // Click the new prize button
    fireEvent.click(screen.getByText('Nuevo Premio'))

    // The create prize modal should be open
    const createModal = screen.getByTestId('create-prize-modal')
    expect(createModal).toHaveAttribute('data-open', 'true')
  })

  it('calls createPrize when a new prize is submitted', async () => {
    render(<PrizeManagement canManage={true} />)

    // Open the create prize modal
    fireEvent.click(screen.getByText('Nuevo Premio'))

    // Submit the form
    fireEvent.click(screen.getByText('Submit Create'))

    // The createPrize function should be called with the form data
    await waitFor(() => {
      expect(mockCreatePrize).toHaveBeenCalledWith({
        name: 'New Prize',
        points_cost: 1000
      })
    })

    // A success toast should be shown
    expect(toastMock).toHaveBeenCalledWith({
      title: '¡Éxito!',
      description: 'El premio se ha creado correctamente.',
      variant: 'default'
    })
  })

  it('calls updatePrize when a prize is updated', async () => {
    // Mock the PrizeCard component to trigger the edit action
    jest.mock('../PrizeCard', () => ({
      __esModule: true,
      default: ({ prize, onEdit }: { prize: Prize; onEdit?: (prize: Prize) => void }) => (
        <div data-testid='prize-card' data-prize-id={prize.id}>
          <button onClick={() => onEdit?.(prize)}>Edit</button>
        </div>
      )
    }))

    // Re-import the PrizeManagement component to use the mocked PrizeCard
    const { default: PrizeManagement } = require('../PrizeManagement')

    render(<PrizeManagement canManage={true} />)

    // Click the edit button on the first prize
    fireEvent.click(screen.getAllByText('Edit')[0])

    // The edit modal should be open with the correct prize
    expect(screen.getByTestId('editing-prize')).toHaveTextContent('Test Prize 1')

    // Submit the form
    fireEvent.click(screen.getByText('Submit Update'))

    // The updatePrize function should be called with the form data
    await waitFor(() => {
      expect(mockUpdatePrize).toHaveBeenCalledWith(1, {
        name: 'Updated Prize',
        points_cost: 1500
      })
    })

    // A success toast should be shown
    expect(toastMock).toHaveBeenCalledWith({
      title: '¡Éxito!',
      description: 'El premio se ha actualizado correctamente.',
      variant: 'default'
    })
  })

  it('calls deletePrize when a prize is deleted', async () => {
    // Mock the PrizeCard component to trigger the edit action
    jest.mock('../PrizeCard', () => ({
      __esModule: true,
      default: ({ prize, onEdit }: { prize: Prize; onEdit?: (prize: Prize) => void }) => (
        <div data-testid='prize-card' data-prize-id={prize.id}>
          <button onClick={() => onEdit?.(prize)}>Edit</button>
        </div>
      )
    }))

    // Re-import the PrizeManagement component to use the mocked PrizeCard
    const { default: PrizeManagement } = require('../PrizeManagement')

    render(<PrizeManagement canManage={true} />)

    // Click the edit button on the first prize
    fireEvent.click(screen.getAllByText('Edit')[0])

    // Click the delete button
    fireEvent.click(screen.getByText('Delete Prize'))

    // The deletePrize function should be called with the prize id
    expect(mockDeletePrize).toHaveBeenCalledWith(1)

    // A success toast should be shown
    expect(toastMock).toHaveBeenCalledWith({
      title: '¡Éxito!',
      description: 'El premio se ha eliminado correctamente.',
      variant: 'default'
    })
  })

  it('calls togglePrizeStatus when status is toggled', async () => {
    // Mock the PrizeCard component to trigger the edit action
    jest.mock('../PrizeCard', () => ({
      __esModule: true,
      default: ({ prize, onEdit }: { prize: Prize; onEdit?: (prize: Prize) => void }) => (
        <div data-testid='prize-card' data-prize-id={prize.id}>
          <button onClick={() => onEdit?.(prize)}>Edit</button>
        </div>
      )
    }))

    // Re-import the PrizeManagement component to use the mocked PrizeCard
    const { default: PrizeManagement } = require('../PrizeManagement')

    render(<PrizeManagement canManage={true} />)

    // Click the edit button on the first prize
    fireEvent.click(screen.getAllByText('Edit')[0])

    // Toggle the status
    fireEvent.click(screen.getByText('Toggle Status'))

    // The togglePrizeStatus function should be called with the correct parameters
    expect(mockTogglePrizeStatus).toHaveBeenCalledWith(1, false)

    // A success toast should be shown
    expect(toastMock).toHaveBeenCalledWith({
      title: '¡Éxito!',
      description: 'El premio se ha desactivado correctamente.',
      variant: 'default'
    })
  })

  it('calls onRedeem when a prize is redeemed', () => {
    const handleRedeem = jest.fn()

    // Mock the PrizeCard component to include the redeem button
    jest.mock('../PrizeCard', () => ({
      __esModule: true,
      default: ({ prize, onRedeem }: { prize: Prize; onRedeem?: (prize: Prize) => void }) => (
        <div data-testid='prize-card' data-prize-id={prize.id}>
          <button onClick={() => onRedeem?.(prize)}>Redeem</button>
        </div>
      )
    }))

    // Re-import the PrizeManagement component to use the mocked PrizeCard
    const { default: PrizeManagement } = require('../PrizeManagement')

    render(<PrizeManagement showRedeemButton={true} onRedeem={handleRedeem} />)

    // Click the redeem button on the first prize
    fireEvent.click(screen.getAllByText('Redeem')[0])

    // The onRedeem callback should be called with the prize
    expect(handleRedeem).toHaveBeenCalledWith(mockPrizes[0])
  })
})
