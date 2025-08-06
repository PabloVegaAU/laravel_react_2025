import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useForm } from '@inertiajs/react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

type Level = {
  id: number
  name: string
  level: number
}

type CreateBackgroundModalProps = {
  isOpen: boolean
  onClose: () => void
  onSuccess: (background: any) => void
}

export function CreateBackgroundModal({ isOpen, onClose, onSuccess }: CreateBackgroundModalProps) {
  const [levels, setLevels] = useState<Level[]>([])
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const { data, setData, errors, reset } = useForm({
    name: '',
    level_required: '',
    points_store: '',
    image: null as File | null
  })

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

  useEffect(() => {
    if (isOpen) {
      fetchLevels()
      reset()
      setPreviewImage(null)
    }
  }, [isOpen])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setData('image', file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const formData = new FormData()
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''

      // Add CSRF token to form data
      formData.append('_token', csrfToken)
      formData.append('name', data.name)
      formData.append('level_required', data.level_required)
      formData.append('points_store', data.points_store)
      if (data.image) {
        formData.append('image', data.image)
      }

      const response = await fetch('/admin/backgrounds', {
        method: 'POST',
        body: formData,
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          Accept: 'application/json',
          'X-CSRF-TOKEN': csrfToken
        },
        credentials: 'include'
      })

      const responseData = await response.json()

      if (response.ok) {
        // Show success message
        toast.success(responseData.message || 'Fondo creado exitosamente')

        // Reset form and close modal
        reset()
        setPreviewImage(null)

        // Call the onSuccess callback with the new background data
        if (onSuccess && typeof onSuccess === 'function') {
          onSuccess(responseData.data)
        }

        // Close the modal
        onClose()
      } else {
        // Show error message
        toast.error(responseData.message || 'Error al crear el fondo')
        console.error('Error creating background:', responseData)
      }
    } catch (error) {
      console.error('Error creating background:', error)
      toast.error('Error al procesar la solicitud')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>Crear Fondo</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='name'>Nombre</Label>
            <Input id='name' value={data.name} onChange={(e) => setData('name', e.target.value)} required />
            {errors.name && <p className='text-sm text-red-500'>{errors.name}</p>}
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='level_required'>Nivel Requerido</Label>
              <select
                id='level_required'
                value={data.level_required}
                onChange={(e) => setData('level_required', e.target.value)}
                className='border-input bg-background ring-offset-background flex h-10 w-full rounded-md border px-3 py-2 text-sm'
                required
              >
                <option value=''>Seleccionar nivel</option>
                {levels.map((level) => (
                  <option key={level.id} value={level.id}>
                    Nivel {level.level} - {level.name}
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
                value={data.points_store}
                onChange={(e) => setData('points_store', e.target.value)}
                required
              />
              {errors.points_store && <p className='text-sm text-red-500'>{errors.points_store}</p>}
            </div>
          </div>

          <div className='space-y-2'>
            <Label>Imagen</Label>
            <div className='mt-1 flex justify-center rounded-md border-2 border-dashed px-6 pt-5 pb-6'>
              <div className='space-y-1 text-center'>
                {previewImage ? (
                  <img src={previewImage} alt='Preview' className='h-32 w-full rounded-md object-cover' />
                ) : (
                  <svg className='mx-auto h-12 w-12 text-gray-400' stroke='currentColor' fill='none' viewBox='0 0 48 48'>
                    <path
                      d='M28 8H12a4 4 0 00-4 4v20m32-12v8v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28l4 4m4-24h8m-4-4v8m-12 4h.02'
                      strokeWidth={2}
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                )}
                <div className='flex text-sm text-gray-600'>
                  <label htmlFor='file-upload' className='relative cursor-pointer text-indigo-600 hover:text-indigo-500'>
                    <span>Cargar imagen</span>
                    <input id='file-upload' type='file' className='sr-only' onChange={handleFileChange} accept='image/*' />
                  </label>
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
              {isLoading ? 'Guardando...' : 'Guardar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
