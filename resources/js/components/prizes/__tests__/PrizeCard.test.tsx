import { Prize } from '@/types/prize'
import { fireEvent, render, screen } from '@testing-library/react'
import { PrizeCard } from '../PrizeCard'

// Mock the next/image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // Remove next/image specific props to avoid warnings
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { src, alt, ...rest } = props
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img src={src} alt={alt} {...rest} />
  }
}))

describe('PrizeCard', () => {
  const mockPrize: Prize = {
    id: 1,
    name: 'Test Prize',
    description: 'This is a test prize',
    points_cost: 1000,
    stock: 5,
    is_active: true,
    available_until: '2023-12-31T23:59:59Z',
    image: 'prizes/test.jpg',
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z',
    deleted_at: null
  }

  it('renders prize information correctly', () => {
    render(<PrizeCard prize={mockPrize} />)

    expect(screen.getByText('Test Prize')).toBeInTheDocument()
    expect(screen.getByText('1.000 pts')).toBeInTheDocument()
    expect(screen.getByText('5 disponibles')).toBeInTheDocument()
    expect(screen.getByText('Disponible')).toBeInTheDocument()
    expect(screen.getByText('This is a test prize')).toBeInTheDocument()
    expect(screen.getByRole('img')).toHaveAttribute('src', '/storage/prizes/test.jpg')
  })

  it('shows out of stock message when stock is 0', () => {
    const outOfStockPrize = { ...mockPrize, stock: 0 }
    render(<PrizeCard prize={outOfStockPrize} />)

    expect(screen.getByText('Agotado')).toBeInTheDocument()
    expect(screen.getByText('Canjear')).toBeDisabled()
  })

  it('shows inactive status when prize is not active', () => {
    const inactivePrize = { ...mockPrize, is_active: false }
    render(<PrizeCard prize={inactivePrize} />)

    expect(screen.getByText('Inactivo')).toBeInTheDocument()
    expect(screen.getByText('No disponible')).toBeInTheDocument()
  })

  it('calls onRedeem when redeem button is clicked', () => {
    const handleRedeem = jest.fn()
    render(<PrizeCard prize={mockPrize} onRedeem={handleRedeem} />)

    fireEvent.click(screen.getByText('Canjear'))
    expect(handleRedeem).toHaveBeenCalledWith(mockPrize)
  })

  it('navigates to prize detail when clicked', () => {
    render(<PrizeCard prize={mockPrize} />)

    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/prizes/1')
  })

  it('shows placeholder image when no image is provided', () => {
    const prizeWithoutImage = { ...mockPrize, image: null }
    render(<PrizeCard prize={prizeWithoutImage} />)

    expect(screen.getByRole('img')).toHaveAttribute('src', '/images/placeholder-prize.png')
  })

  it('shows low stock message when stock is between 1 and 4', () => {
    const lowStockPrize = { ...mockPrize, stock: 3 }
    render(<PrizeCard prize={lowStockPrize} />)

    expect(screen.getByText('Últimas 3 unidades')).toBeInTheDocument()
  })

  it('applies custom className when provided', () => {
    const { container } = render(<PrizeCard prize={mockPrize} className='custom-class' />)

    expect(container.firstChild).toHaveClass('custom-class')
  })

  it('does not show actions when showActions is false', () => {
    render(<PrizeCard prize={mockPrize} showActions={false} />)

    expect(screen.queryByText('Canjear')).not.toBeInTheDocument()
  })
})
