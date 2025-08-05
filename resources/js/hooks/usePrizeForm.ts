import { Prize, PrizeFormData } from '@/types/prize'
import { format } from 'date-fns'
import { ChangeEvent, useCallback, useState } from 'react'

interface UsePrizeFormProps {
  initialData?: Partial<Prize>
  onSubmit: (data: PrizeFormData) => Promise<void>
}

export function usePrizeForm({ initialData, onSubmit }: UsePrizeFormProps) {
  const [formData, setFormData] = useState<PrizeFormData>(() => ({
    name: initialData?.name || '',
    description: initialData?.description || '',
    stock: initialData?.stock?.toString() || '0',
    points_cost: initialData?.points_cost?.toString() || '0',
    is_active: initialData?.is_active ?? true,
    available_until: initialData?.available_until ? format(new Date(initialData.available_until), 'yyyy-MM-dd') : '',
    image: null
  }))

  const [previewImage, setPreviewImage] = useState<string | null>(initialData?.image ? `${initialData.image}` : null)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string[]>>({})

  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target

      setFormData((prev) => ({
        ...prev,
        [name]: value
      }))

      // Clear error for this field when user types
      if (errors[name]) {
        setErrors((prev) => {
          const newErrors = { ...prev }
          delete newErrors[name]
          return newErrors
        })
      }
    },
    [errors]
  )

  const handleSwitchChange = useCallback((name: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [name]: checked
    }))
  }, [])

  const handleDateChange = useCallback((date: Date | undefined) => {
    setFormData((prev) => ({
      ...prev,
      available_until: date ? format(date, 'yyyy-MM-dd') : ''
    }))
  }, [])

  const handleImageChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (file) {
      // Check file type
      if (!file.type.startsWith('image/')) {
        setErrors((prev) => ({
          ...prev,
          image: ['El archivo debe ser una imagen']
        }))
        return
      }

      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          image: ['La imagen no puede pesar más de 2MB']
        }))
        return
      }

      // Clear any previous image errors
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.image
        return newErrors
      })

      // Set the file in form data
      setFormData((prev) => ({
        ...prev,
        image: file
      }))

      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const removeImage = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      image: null
    }))
    setPreviewImage(null)

    // Clear any image errors
    setErrors((prev) => {
      const newErrors = { ...prev }
      delete newErrors.image
      return newErrors
    })
  }, [])

  const validateForm = useCallback((): boolean => {
    const newErrors: Record<string, string[]> = {}

    if (!formData.name.trim()) {
      newErrors.name = ['El nombre del premio es obligatorio']
    }

    if (formData.name.length > 100) {
      newErrors.name = ['El nombre no puede tener más de 100 caracteres']
    }

    if (formData.description.length > 1000) {
      newErrors.description = ['La descripción no puede tener más de 1000 caracteres']
    }

    const stock = parseInt(formData.stock.toString(), 10)
    if (isNaN(stock) || stock < 0) {
      newErrors.stock = ['El stock debe ser un número mayor o igual a 0']
    }

    const pointsCost = parseInt(formData.points_cost.toString(), 10)
    if (isNaN(pointsCost) || pointsCost < 0) {
      newErrors.points_cost = ['El costo en puntos debe ser un número mayor o igual a 0']
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [formData])

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()

      if (!validateForm()) {
        return
      }

      try {
        setIsSubmitting(true)
        await onSubmit(formData)
      } catch (err: any) {
        console.error('Error submitting form:', err)
        // Handle API validation errors
        if (err.response?.data?.errors) {
          setErrors(err.response.data.errors)
        }
        throw err
      } finally {
        setIsSubmitting(false)
      }
    },
    [formData, onSubmit, validateForm]
  )

  return {
    formData,
    previewImage,
    isSubmitting,
    errors,
    handleInputChange,
    handleSwitchChange,
    handleDateChange,
    handleImageChange,
    removeImage,
    handleSubmit,
    setFormData,
    setErrors
  }
}

export default usePrizeForm
