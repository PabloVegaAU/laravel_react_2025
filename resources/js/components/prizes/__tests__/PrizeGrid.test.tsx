import { Prize } from '@/types/prize'
import { render, screen } from '@testing-library/react'
import { PrizeGrid } from '../PrizeGrid'

// Mock the PrizeCard component
jest.mock('../PrizeCard', () => ({
  __esModule: true,
  default: ({ prize, onRedeem }: { prize: Prize; onRedeem?: (prize: Prize) => void }) => (
    <div data-testid='prize-card' data-prize-id={prize.id}>
      {prize.name}
      {onRedeem && <button onClick={() => onRedeem(prize)}>Redeem</button>}
    </div>
  )
}))

describe('PrizeGrid', () => {
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
      stock: 3,
      is_active: true,
      available_until: '2023-12-31T23:59:59Z',
      image: 'prizes/test2.jpg',
      created_at: '2023-01-02T00:00:00Z',
      updated_at: '2023-01-02T00:00:00Z',
      deleted_at: null
    }
  ]

  it('renders loading state correctly', () => {
    const { container } = render(<PrizeGrid prizes={[]} loading={true} />)

    // Check for skeleton loaders
    const skeletons = container.querySelectorAll('.animate-pulse')
    expect(skeletons.length).toBeGreaterThan(0)

    // Default skeleton count is 8
    expect(skeletons.length).toBe(8)
  })

  it('renders custom number of skeleton loaders', () => {
    const { container } = render(<PrizeGrid prizes={[]} loading={true} skeletonCount={4} />)

    const skeletons = container.querySelectorAll('.animate-pulse')
    expect(skeletons.length).toBe(4)
  })

  it('renders empty state when no prizes are provided', () => {
    render(<PrizeGrid prizes={[]} loading={false} />)

    expect(screen.getByText('No se encontraron premios')).toBeInTheDocument()
    expect(screen.getByText('Intenta ajustar los filtros de búsqueda o crear un nuevo premio.')).toBeInTheDocument()
  })

  it('renders custom empty message', () => {
    const customMessage = 'No prizes found'
    render(<PrizeGrid prizes={[]} loading={false} emptyMessage={customMessage} />)

    expect(screen.getByText(customMessage)).toBeInTheDocument()
  })

  it('renders prize cards when prizes are provided', () => {
    render(<PrizeGrid prizes={mockPrizes} loading={false} />)

    const prizeCards = screen.getAllByTestId('prize-card')
    expect(prizeCards).toHaveLength(2)
    expect(screen.getByText('Test Prize 1')).toBeInTheDocument()
    expect(screen.getByText('Test Prize 2')).toBeInTheDocument()
  })

  it('applies custom className to the grid container', () => {
    const { container } = render(<PrizeGrid prizes={mockPrizes} loading={false} className='custom-grid' />)

    const grid = container.firstChild
    expect(grid).toHaveClass('custom-grid')
  })

  it('passes onRedeem callback to PrizeCard components', () => {
    const handleRedeem = jest.fn()

    render(<PrizeGrid prizes={[mockPrizes[0]]} loading={false} onRedeem={handleRedeem} />)

    const redeemButton = screen.getByText('Redeem')
    redeemButton.click()

    expect(handleRedeem).toHaveBeenCalledWith(mockPrizes[0])
  })

  it('renders with responsive grid classes', () => {
    const { container } = render(<PrizeGrid prizes={mockPrizes} loading={false} />)

    const grid = container.firstChild
    expect(grid).toHaveClass('grid')
    expect(grid).toHaveClass('grid-cols-1')
    expect(grid).toHaveClass('sm:grid-cols-2')
    expect(grid).toHaveClass('md:grid-cols-3')
    expect(grid).toHaveClass('lg:grid-cols-4')
    expect(grid).toHaveClass('gap-4')
  })
})
