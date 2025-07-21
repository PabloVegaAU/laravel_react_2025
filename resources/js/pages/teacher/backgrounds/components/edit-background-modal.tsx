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

// ...imports
export function EditBackgroundModal({ isOpen, onClose, background, onSuccess }: EditBackgroundModalProps) {
  const [levels, setLevels] = useState<Level[]>([])
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const { data, setData, errors, reset } = useForm({
    name: background?.name || '',
    level_required: background?.level_required.toString() || '',
    points_store: background?.points_store.toString() || '',
    image: null as File | null,
    _method: 'PUT' as const
  })

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

  useEffect(() => {
    if (isOpen) fetchLevels()
  }, [isOpen])

  const fetchLevels = async () => {
    try {
      const response = await fetch('/api/levels')
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
      let uploadedImagePath = background.image

      // Si hay nueva imagen, súbela primero
      if (data.image) {
        const imageForm = new FormData()
        imageForm.append('image', data.image)

        const uploadRes = await fetch('/api/upload-image', {
          method: 'POST',
          body: imageForm,
          headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
          },
          credentials: 'include'
        })

        const uploadData = await uploadRes.json()
        if (uploadRes.ok && uploadData.success && uploadData.path) {
          uploadedImagePath = uploadData.path
        } else {
          throw new Error('Error al subir imagen')
        }
      }

      const response = await fetch('/api/backgroundgra', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
        },
        body: JSON.stringify({
          p_id: background.id,
          p_name: data.name,
          p_image: uploadedImagePath,
          p_level_required: parseInt(data.level_required),
          p_points_store: parseFloat(data.points_store)
        })
      })

      const result = await response.json()
      if (response.ok) {
        onSuccess(result)
        onClose()
      } else {
        console.error('Error updating background:', result)
      }
    } catch (error) {
      console.error('Error:', error)
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
          {/* Nombre */}
          <div className='space-y-2'>
            <Label htmlFor='name'>Nombre</Label>
            <Input id='name' value={data.name} onChange={(e) => setData('name', e.target.value)} required />
            {errors.name && <p className='text-sm text-red-500'>{errors.name}</p>}
          </div>

          {/* Nivel y Puntos */}
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
                required
              />
              {errors.points_store && <p className='text-sm text-red-500'>{errors.points_store}</p>}
            </div>
          </div>

          {/* Imagen */}
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
                  <label htmlFor='file-upload-edit' className='relative cursor-pointer text-indigo-600 hover:text-indigo-500'>
                    <span>Cambiar imagen</span>
                    <input id='file-upload-edit' type='file' className='sr-only' onChange={handleFileChange} accept='image/*' />
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
