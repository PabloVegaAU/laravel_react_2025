import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useForm } from '@inertiajs/react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

type Level = {
  id: number
  name: string
}

import { Avatar } from '@/types/avatar'

type EditAvatarModalProps = {
  isOpen: boolean
  onClose: () => void
  avatar: Avatar | null
  onSuccess: (updatedAvatar: Avatar) => void
}

export function EditAvatarModal({ isOpen, onClose, avatar, onSuccess }: EditAvatarModalProps) {
  const [levels, setLevels] = useState<Level[]>([])
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Debug: Log when avatar prop changes
  useEffect(() => {
    console.log('Avatar prop changed:', avatar)
  }, [avatar])

  const { data, setData, errors, reset } = useForm({
    name: '',
    level_required: '',
    points_store: '',
    price: '',
    image: null as File | null
  })

  // Initialize form when avatar changes
  useEffect(() => {
    console.log('Initializing form with avatar:', avatar)
    if (avatar) {
      const formData = {
        name: avatar.name || '',
        level_required: avatar.level_required?.toString() || '',
        points_store: avatar.points_store?.toString() || '',
        price: (avatar.price || '').toString(),
        image: null
      }
      console.log('Setting form data:', formData)
      setData(formData)
      setPreviewImage(avatar.image || null)

      // Log the current form state after a small delay to let it update
      setTimeout(() => {
        console.log('Current form state after update:', data)
      }, 100)
    } else {
      console.log('No avatar provided, resetting form')
      setData({
        name: '',
        level_required: '',
        points_store: '',
        price: '',
        image: null
      })
      setPreviewImage(null)
    }
  }, [avatar])

  // Fetch levels when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchLevels()
    }
  }, [isOpen])

  const fetchLevels = async () => {
    try {
      const res = await fetch('/api/levels')
      const json = await res.json()
      setLevels(json.levels || [])
    } catch (err) {
      console.error('Error al obtener niveles:', err)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setData('image', file)
      const reader = new FileReader()
      reader.onloadend = () => setPreviewImage(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!avatar) return

    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.append('_method', 'PUT')
      formData.append('name', data.name)
      formData.append('level_required', data.level_required)
      formData.append('points_store', data.points_store)
      formData.append('price', data.price)
      if (data.image) {
        formData.append('image', data.image)
      }

      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
      const response = await fetch(`/api/avatars/${avatar.id}`, {
        method: 'POST', // Using POST with _method=PUT for Laravel
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'X-CSRF-TOKEN': csrfToken
        },
        body: formData
      })

      const result = await response.json()
      if (response.ok && result.success) {
        const updatedAvatar = result.data[0]
        toast.success(updatedAvatar.message || 'Avatar actualizado correctamente')

        onSuccess({
          ...avatar,
          name: data.name,
          level_required: parseInt(data.level_required),
          points_store: parseFloat(data.points_store),
          image: result.image_url || avatar.image
        })

        onClose()
      } else {
        toast.error(result.message || 'Error al actualizar el avatar')
      }
    } catch (err) {
      console.error('Error al actualizar avatar:', err)
      toast.error('Error del servidor al actualizar el avatar')
    } finally {
      setIsLoading(false)
    }
  }

  if (!avatar) return null

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>Editar Avatar</DialogTitle>
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
                className='border-input bg-background ring-offset-background focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50'
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

          <div className='space-y-2'>
            <Label>Imagen</Label>
            <div className='mt-1 flex justify-center rounded-md border-2 border-dashed px-6 pt-5 pb-6'>
              <div className='space-y-1 text-center'>
                {previewImage ? (
                  <img src={previewImage} alt='Preview' className='h-32 w-full rounded-md object-cover' />
                ) : (
                  <div className='flex flex-col items-center'>
                    <img src={avatar.image} alt={avatar.name} className='mb-2 h-32 w-32 rounded-md object-cover' />
                    <p className='text-sm text-gray-500'>Imagen actual</p>
                  </div>
                )}
                <div className='flex text-sm text-gray-600'>
                  <label htmlFor='file-upload' className='relative cursor-pointer text-indigo-600 hover:text-indigo-500'>
                    <span>Cambiar imagen</span>
                    <input id='file-upload' type='file' className='sr-only' onChange={handleFileChange} accept='image/*' />
                  </label>
                </div>
                <p className='text-xs text-gray-500'>PNG, JPG, GIF hasta 10MB</p>
              </div>
            </div>
            {errors.image && <p className='text-sm text-red-500'>{errors.image}</p>}
          </div>

          <div className='flex justify-end space-x-2'>
            <Button type='button' variant='outline' onClick={onClose} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type='submit' disabled={isLoading}>
              {isLoading ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
