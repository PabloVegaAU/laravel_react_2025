import { act, renderHook } from '@testing-library/react-hooks'
import { usePrizeForm } from '../usePrizeForm'

describe('usePrizeForm', () => {
  const mockOnSubmit = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should initialize with default values', () => {
    const { result } = renderHook(() =>
      usePrizeForm({
        onSubmit: mockOnSubmit
      })
    )

    expect(result.current.formData).toEqual({
      name: '',
      description: '',
      stock: '0',
      points_cost: '0',
      is_active: true,
      available_until: '',
      image: null
    })
    expect(result.current.previewImage).toBeNull()
    expect(result.current.isSubmitting).toBe(false)
    expect(result.current.errors).toEqual({})
  })

  it('should initialize with provided values', () => {
    const initialData = {
      id: 1,
      name: 'Test Prize',
      description: 'Test Description',
      stock: 5,
      points_cost: 100,
      is_active: true,
      available_until: '2023-12-31',
      image: 'prizes/test.jpg'
    }

    const { result } = renderHook(() =>
      usePrizeForm({
        initialData,
        onSubmit: mockOnSubmit
      })
    )

    expect(result.current.formData).toEqual({
      name: 'Test Prize',
      description: 'Test Description',
      stock: '5',
      points_cost: '100',
      is_active: true,
      available_until: '2023-12-31',
      image: null // Image should be in preview, not in form data
    })
    expect(result.current.previewImage).toBe('/storage/prizes/test.jpg')
  })

  it('should handle input changes', () => {
    const { result } = renderHook(() =>
      usePrizeForm({
        onSubmit: mockOnSubmit
      })
    )

    // Test text input
    act(() => {
      const event = {
        target: { name: 'name', value: 'New Prize' }
      } as React.ChangeEvent<HTMLInputElement>
      result.current.handleInputChange(event)
    })

    expect(result.current.formData.name).toBe('New Prize')

    // Test number input
    act(() => {
      const event = {
        target: { name: 'stock', value: '10' }
      } as React.ChangeEvent<HTMLInputElement>
      result.current.handleInputChange(event)
    })

    expect(result.current.formData.stock).toBe('10')
  })

  it('should handle switch changes', () => {
    const { result } = renderHook(() =>
      usePrizeForm({
        onSubmit: mockOnSubmit
      })
    )

    act(() => {
      result.current.handleSwitchChange('is_active', false)
    })

    expect(result.current.formData.is_active).toBe(false)
  })

  it('should handle date changes', () => {
    const { result } = renderHook(() =>
      usePrizeForm({
        onSubmit: mockOnSubmit
      })
    )

    const testDate = new Date('2023-12-31')
    act(() => {
      result.current.handleDateChange(testDate)
    })

    expect(result.current.formData.available_until).toBe('2023-12-31')
  })

  it('should handle image changes', () => {
    const { result } = renderHook(() =>
      usePrizeForm({
        onSubmit: mockOnSubmit
      })
    )

    // Create a mock file
    const file = new File(['test'], 'test.png', { type: 'image/png' })

    // Mock FileReader
    const mockFileReaderInstance = {
      onload: jest.fn(),
      readAsDataURL: jest.fn(),
      result: 'data:image/png;base64,test'
    }

    // @ts-ignore
    global.FileReader = jest.fn(() => mockFileReaderInstance)

    act(() => {
      const event = {
        target: {
          files: [file]
        }
      } as unknown as React.ChangeEvent<HTMLInputElement>
      result.current.handleImageChange(event)
    })

    // Verify FileReader was called
    expect(FileReader).toHaveBeenCalled()

    // Simulate FileReader onload event
    act(() => {
      mockFileReaderInstance.onload()
    })

    expect(result.current.formData.image).toBe(file)
    expect(result.current.previewImage).toBe('data:image/png;base64,test')
  })

  it('should validate form data', async () => {
    const { result } = renderHook(() =>
      usePrizeForm({
        onSubmit: mockOnSubmit
      })
    )

    // Set invalid data
    act(() => {
      result.current.setFormData({
        ...result.current.formData,
        name: '', // Empty name should trigger validation error
        stock: '-5' // Negative stock should trigger validation error
      })
    })

    // Trigger validation
    await act(async () => {
      await result.current.handleSubmit({ preventDefault: jest.fn() } as any)
    })

    expect(result.current.errors).toEqual({
      name: ['El nombre del premio es obligatorio'],
      stock: ['El stock debe ser un número mayor o igual a 0']
    })
    expect(mockOnSubmit).not.toHaveBeenCalled()
  })

  it('should submit form when validation passes', async () => {
    const mockSubmit = jest.fn().mockResolvedValue(undefined)
    const { result } = renderHook(() =>
      usePrizeForm({
        onSubmit: mockSubmit
      })
    )

    // Set valid data
    act(() => {
      result.current.setFormData({
        ...result.current.formData,
        name: 'Valid Prize',
        description: 'Test Description',
        stock: '10',
        points_cost: '100',
        is_active: true
      })
    })

    // Trigger submit
    await act(async () => {
      await result.current.handleSubmit({ preventDefault: jest.fn() } as any)
    })

    expect(mockSubmit).toHaveBeenCalledWith({
      name: 'Valid Prize',
      description: 'Test Description',
      stock: '10',
      points_cost: '100',
      is_active: true,
      available_until: '',
      image: null
    })
  })

  it('should handle API validation errors', async () => {
    const apiError = {
      response: {
        data: {
          errors: {
            name: ['The name has already been taken'],
            points_cost: ['The points cost must be at least 1']
          }
        }
      }
    }

    const mockSubmit = jest.fn().mockRejectedValue(apiError)

    const { result } = renderHook(() =>
      usePrizeForm({
        onSubmit: mockSubmit
      })
    )

    // Set valid data
    act(() => {
      result.current.setFormData({
        ...result.current.formData,
        name: 'Duplicate Prize',
        points_cost: '0'
      })
    })

    // Trigger submit
    await act(async () => {
      await result.current.handleSubmit({ preventDefault: jest.fn() } as any)
    })

    expect(result.current.errors).toEqual({
      name: ['The name has already been taken'],
      points_cost: ['The points cost must be at least 1']
    })
  })
})
