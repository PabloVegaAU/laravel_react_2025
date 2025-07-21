import { fireEvent, render, screen } from '@testing-library/react'
import { PrizeFilters } from '../PrizeFilters'

describe('PrizeFilters', () => {
  const defaultProps = {
    search: '',
    onSearchChange: jest.fn(),
    sortBy: 'name_asc',
    onSortChange: jest.fn(),
    filters: {
      inStock: false,
      activeOnly: false,
      minPoints: '',
      maxPoints: ''
    },
    onFilterChange: jest.fn(),
    onReset: jest.fn(),
    activeFilterCount: 0
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders search input and sort select', () => {
    render(<PrizeFilters {...defaultProps} />)

    expect(screen.getByPlaceholderText('Buscar premios...')).toBeInTheDocument()
    expect(screen.getByText('Nombre (A-Z)')).toBeInTheDocument()
  })

  it('calls onSearchChange when search input changes', () => {
    render(<PrizeFilters {...defaultProps} />)

    const searchInput = screen.getByPlaceholderText('Buscar premios...')
    fireEvent.change(searchInput, { target: { value: 'test' } })

    expect(defaultProps.onSearchChange).toHaveBeenCalledWith('test')
  })

  it('calls onSortChange when sort option is selected', () => {
    render(<PrizeFilters {...defaultProps} />)

    // Open the select
    fireEvent.click(screen.getByText('Nombre (A-Z)'))

    // Select an option
    const option = screen.getByText('Precio (menor a mayor)')
    fireEvent.click(option)

    expect(defaultProps.onSortChange).toHaveBeenCalledWith('points_asc')
  })

  it('shows active filter count', () => {
    render(<PrizeFilters {...defaultProps} activeFilterCount={2} />)

    const filterButton = screen.getByText('Filtros')
    const badge = filterButton.nextElementSibling

    expect(badge).toHaveTextContent('2')
  })

  it('opens filter popover when filter button is clicked', () => {
    render(<PrizeFilters {...defaultProps} />)

    const filterButton = screen.getByText('Filtros')
    fireEvent.click(filterButton)

    expect(screen.getByText('Solo disponibles en stock')).toBeInTheDocument()
    expect(screen.getByText('Solo premios activos')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Mínimo')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Máximo')).toBeInTheDocument()
  })

  it('calls onFilterChange when checkboxes are toggled', () => {
    render(<PrizeFilters {...defaultProps} />)

    // Open the filter popover
    fireEvent.click(screen.getByText('Filtros'))

    // Toggle the inStock checkbox
    const inStockCheckbox = screen.getByLabelText('Solo disponibles en stock')
    fireEvent.click(inStockCheckbox)

    expect(defaultProps.onFilterChange).toHaveBeenCalledWith({ inStock: true })

    // Toggle the activeOnly checkbox
    const activeOnlyCheckbox = screen.getByLabelText('Solo premios activos')
    fireEvent.click(activeOnlyCheckbox)

    expect(defaultProps.onFilterChange).toHaveBeenCalledWith({ activeOnly: true })
  })

  it('calls onFilterChange when point range inputs change', () => {
    render(<PrizeFilters {...defaultProps} />)

    // Open the filter popover
    fireEvent.click(screen.getByText('Filtros'))

    // Change min points
    const minPointsInput = screen.getByPlaceholderText('Mínimo')
    fireEvent.change(minPointsInput, { target: { value: '100' } })

    expect(defaultProps.onFilterChange).toHaveBeenCalledWith({ minPoints: '100' })

    // Change max points
    const maxPointsInput = screen.getByPlaceholderText('Máximo')
    fireEvent.change(maxPointsInput, { target: { value: '500' } })

    expect(defaultProps.onFilterChange).toHaveBeenCalledWith({ maxPoints: '500' })
  })

  it('only allows numbers in point range inputs', () => {
    render(<PrizeFilters {...defaultProps} filters={{ ...defaultProps.filters, minPoints: '100' }} />)

    // Open the filter popover
    fireEvent.click(screen.getByText('Filtros'))

    const minPointsInput = screen.getByPlaceholderText('Mínimo') as HTMLInputElement

    // Try to enter non-numeric characters
    fireEvent.change(minPointsInput, { target: { value: 'abc' } })

    // The value should remain unchanged
    expect(minPointsInput.value).toBe('100')
  })

  it('calls onReset when reset button is clicked', () => {
    render(<PrizeFilters {...defaultProps} activeFilterCount={2} />)

    // Open the filter popover
    fireEvent.click(screen.getByText('Filtros'))

    // Click the reset button
    const resetButton = screen.getByText('Restablecer')
    fireEvent.click(resetButton)

    expect(defaultProps.onReset).toHaveBeenCalled()
  })

  it('applies custom className to the container', () => {
    const { container } = render(<PrizeFilters {...defaultProps} className='custom-class' />)

    expect(container.firstChild).toHaveClass('custom-class')
  })
})
