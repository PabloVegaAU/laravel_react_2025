import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useForm } from '@inertiajs/react'
import { useEffect, useState } from 'react'

type Level = {
  id: number
  name: string
}

type Background = {
  id: number
  name: string
  level_required: number
  points_store: number
  image: string
}

type EditBackgroundModalProps = {
  isOpen: boolean
  onClose: () => void
  background: Background | null
  onSuccess: (updatedBackground: Background) => void
}

export function EditBackgroundModal({ isOpen, onClose, background, onSuccess }: EditBackgroundModalProps) {
  const [levels, setLevels] = useState<Level[]>([])
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const { data, setData, put, processing, errors, reset } = useForm({
    name: background?.name || '',
    level_required: background?.level_required.toString() || '',
    points_store: background?.points_store.toString() || '',
    image: null as File | null,
    _method: 'PUT' as const
  })

  // Reset form when background changes
  useEffect(() => {
    if (background) {
      setData({
        name: background.name,
        level_required: background.level_required.toString(),
        points_store: background.points_store.toString(),
        image: null,
        _method: 'PUT'
      })
      setPreviewImage(background.image ? `/storage/${background.image}` : null)
    }
  }, [background])

  // Fetch levels when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchLevels()
    }
  }, [isOpen])

  const fetchLevels = async () => {
    try {
      const response = await fetch('/api/levels') // You'll need to create this endpoint
      const data = await response.json()
      setLevels(data.levels || [])
    } catch (error) {
      console.error('Error fetching levels:', error)
    }
  }

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
    if (!background) return

    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.append('name', data.name)
      formData.append('level_required', data.level_required)
      formData.append('points_store', data.points_store)
      formData.append('_method', 'PUT')

      if (data.image) {
        formData.append('image', data.image)
      }

      const response = await fetch(`/teacher/backgrounds/${background.id}`, {
        method: 'POST', // Using POST with _method=PUT for file uploads
        body: formData,
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
        }
      })

      if (response.ok) {
        const updatedBackground = await response.json()
        onSuccess(updatedBackground)
        onClose()
      } else {
        const errorData = await response.json()
        console.error('Error updating background:', errorData)
      }
    } catch (error) {
      console.error('Error updating background:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!background) return null

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>Editar Fondo</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='name'>Nombre</Label>
            <Input id='name' value={data.name} onChange={(e) => setData('name', e.target.value)} placeholder='Ej: Campo' required />
            {errors.name && <p className='text-sm text-red-500'>{errors.name}</p>}
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='level_required'>Nivel Requerido</Label>
              <select
                id='level_required'
                value={data.level_required}
                onChange={(e) => setData('level_required', e.target.value)}
                className='border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50'
                required
              >
                <option value=''>Seleccionar nivel</option>
                {levels.map((level) => (
                  <option key={level.id} value={level.id}>
                    Nivel {level.name}
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
                placeholder='Ej: 50'
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
                  <div className='mt-2'>
                    <img src={previewImage} alt='Preview' className='h-32 w-full rounded-md object-cover' />
                  </div>
                ) : (
                  <svg className='mx-auto h-12 w-12 text-gray-400' stroke='currentColor' fill='none' viewBox='0 0 48 48' aria-hidden='true'>
                    <path
                      d='M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02'
                      strokeWidth={2}
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                )}
                <div className='flex text-sm text-gray-600'>
                  <label
                    htmlFor='file-upload-edit'
                    className='relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 focus-within:outline-none hover:text-indigo-500'
                  >
                    <span>Cambiar imagen</span>
                    <input id='file-upload-edit' name='file-upload' type='file' className='sr-only' onChange={handleFileChange} accept='image/*' />
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
              {isLoading ? 'Actualizando...' : 'Actualizar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
