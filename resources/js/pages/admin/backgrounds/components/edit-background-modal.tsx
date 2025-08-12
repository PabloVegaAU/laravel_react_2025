import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Background, EditModalBackground, Level } from '@/types/background'
import { router, useForm } from '@inertiajs/react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

type EditBackgroundModalProps = {
  isOpen: boolean
  onClose: () => void
  background: EditModalBackground
  onSuccess: (updatedBackground: Background) => void
}

export function EditBackgroundModal({ isOpen, onClose, background: initialBackground, onSuccess }: EditBackgroundModalProps) {
  const [levels, setLevels] = useState<Level[]>([])
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  // Local state for the form
  // Form state type
  type FormDataState = {
    name: string
    level_required: string
    activo: boolean
    points_store: string
    image: string | File | null
  }

  const [formData, setFormData] = useState<FormDataState>({
    name: initialBackground.name,
    level_required: initialBackground.level_required.level.toString(),
    activo: initialBackground.activo,
    points_store:
      typeof initialBackground.points_store === 'number' ? initialBackground.points_store.toString() : initialBackground.points_store || '0',
    image: initialBackground.image || null
  })

  // Reset state when initial background changes
  useEffect(() => {
    setFormData({
      name: initialBackground.name,
      level_required: initialBackground.level_required.level.toString(),
      activo: initialBackground.activo,
      points_store:
        typeof initialBackground.points_store === 'number' ? initialBackground.points_store.toString() : initialBackground.points_store || '0',
      image: initialBackground.image || null
    })

    // Set preview image if there's an existing image
    if (initialBackground.image) {
      // Ensure the image URL is properly formatted
      const imageUrl =
        initialBackground.image.startsWith('http') || initialBackground.image.startsWith('/') ? initialBackground.image : `${initialBackground.image}`
      setPreviewImage(imageUrl)
    } else {
      setPreviewImage(null)
    }
  }, [initialBackground])

  // Don't render if modal is closed
  if (!isOpen) return null

  // Define form data type
  type FormData = {
    name: string
    level_required: string
    activo: boolean
    points_store: string
    image: File | null
  }

  // Form state
  const { errors, reset } = useForm<FormData>()

  const [formState, setFormState] = useState({
    level_required: initialBackground.level_required,
    calculated_level: initialBackground.level_required.level.toString()
  })

  // Update form data when initialBackground changes
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      name: initialBackground.name,
      level_required: initialBackground.level_required.level.toString(),
      activo: initialBackground.activo,
      points_store:
        typeof initialBackground.points_store === 'number' ? initialBackground.points_store.toString() : initialBackground.points_store || '0',
      image: initialBackground.image || null
    }))
  }, [initialBackground])

  // Log when form data changes
  useEffect(() => {
    console.log('Form data updated:', formData)
  }, [formData])

  // Fetch levels when modal opens
  const fetchLevels = async () => {
    try {
      const url = '/api/levels'
      console.log('Fetching levels from:', url)
      const response = await fetch(url, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log('Levels API response:', data)
      setLevels(data.levels || [])
    } catch (error) {
      console.error('Error fetching levels:', error)
      setLevels([]) // Ensure levels is always an array even on error
    }
  }

  // Fetch levels when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchLevels()
    }
  }, [isOpen])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file
      }))
      const reader = new FileReader()
      reader.onloadend = () => setPreviewImage(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form data
    if (!formData.name || !formData.points_store) {
      toast.error('Por favor completa todos los campos requeridos')
      return
    }

    // Find the selected level
    const selectedLevel = levels.find((level) => level.id === parseInt(formData.level_required))

    if (!selectedLevel) {
      toast.error('Nivel no válido')
      return
    }

    const formDataToSend = new FormData()

    // Add form data
    formDataToSend.append('_method', 'PUT')
    formDataToSend.append('name', formData.name)
    formDataToSend.append('level_required', selectedLevel.level.toString())
    formDataToSend.append('points_store', formData.points_store)
    formDataToSend.append('activo', formData.activo ? '1' : '0')

    if (formData.image && typeof formData.image !== 'string') {
      formDataToSend.append('image', formData.image)
    }

    // Prepare the updated background data for the parent component
    const updatedBackground: Background = {
      ...initialBackground,
      name: formData.name,
      level_required: selectedLevel.level,
      level_name: selectedLevel.name,
      points_store: formData.points_store,
      activo: formData.activo,
      image: typeof formData.image === 'string' ? previewImage || '' : initialBackground.image || ''
    }

    router.post(`/admin/backgrounds/${initialBackground.id}`, formDataToSend, {
      onBefore: () => {
        setIsLoading(true)
      },
      onSuccess: () => {
        toast.success('Fondo actualizado exitosamente')
        onClose()
        onSuccess(updatedBackground)
      },
      onError: (error) => {
        toast.error(error.message || 'Error al actualizar el fondo')
      },
      onFinish: () => {
        setIsLoading(false)
      }
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>Editar Fondo</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-4'>
          {/* Nombre */}
          <div className='space-y-2'>
            <Label htmlFor='name'>Nombre</Label>
            <Input id='name' value={formData.name} onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))} required />
            {errors.name && <p className='text-sm text-red-500'>{errors.name}</p>}
          </div>

          {/* Nivel y Puntos */}
          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='level_required'>Nivel Requerido</Label>
              <select
                id='level_required'
                value={formData.level_required}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, level_required: e.target.value }))
                }}
                className='border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50'
                required
              >
                <option value=''>Seleccionar nivel</option>
                {levels.map((level) => (
                  <option key={level.id} value={level.id.toString()}>
                    Nivel {level.level}
                  </option>
                ))}
              </select>
              {errors.level_required && <p className='text-sm text-red-500'>{errors.level_required}</p>}
            </div>
            <div className='space-y-2'>
              <Label htmlFor='points_store'>Costo (puntos)</Label>
              <Input
                id='points_store'
                type='number'
                min='0'
                value={formData.points_store}
                onChange={(e) => setFormData((prev) => ({ ...prev, points_store: e.target.value }))}
                placeholder='Ej: 50'
                required
              />
              {errors.points_store && <p className='text-sm text-red-500'>{errors.points_store}</p>}
            </div>
          </div>

          {/* Activo */}
          <div className='flex items-center space-x-2'>
            <input
              type='checkbox'
              id='activo'
              checked={formData.activo}
              onChange={(e) => setFormData((prev) => ({ ...prev, activo: e.target.checked }))}
              className='h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500'
            />
            <Label htmlFor='activo' className='text-sm font-medium text-gray-700'>
              Activo
            </Label>
          </div>

          {/* Imagen */}
          <div className='space-y-2'>
            <Label>Imagen del Fondo</Label>
            <div className='mt-1 flex justify-center rounded-md border-2 border-dashed px-6 pt-5 pb-6'>
              <div className='space-y-1 text-center'>
                {previewImage ? (
                  <img src={previewImage} alt='Preview' className='h-32 w-full rounded-md object-cover' />
                ) : (
                  <svg className='mx-auto h-12 w-12 text-gray-400' stroke='currentColor' fill='none' viewBox='0 0 48 48'>
                    <path d='M28 8H12a4 4 0 00-4 4v20m32-12v8m-4-4h8m-4-4v8m-12 4h.02' strokeWidth={2} strokeLinecap='round' strokeLinejoin='round' />
                  </svg>
                )}
                <div className='flex text-sm text-gray-600'>
                  <Label
                    htmlFor='image'
                    className='relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 focus-within:outline-none hover:text-indigo-500'
                  >
                    <Input id='image' name='image' type='file' accept='image/*' onChange={handleFileChange} className='sr-only' />
                    <span>Cambiar imagen</span>
                  </Label>
                  <p className='pl-1'>o arrastra y suelta</p>
                </div>
                <p className='text-xs text-gray-500'>PNG, JPG, GIF hasta 2MB</p>
              </div>
            </div>
            {errors.image && <p className='text-sm text-red-500'>{errors.image}</p>}
          </div>

          <DialogFooter>
            <Button type='button' variant='outline' onClick={onClose} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type='submit' disabled={isLoading}>
              {isLoading ? 'Actualizando...' : 'Actualizar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
