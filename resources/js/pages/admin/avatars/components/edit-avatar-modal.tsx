import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFormData } from '@/types'
import { router, useForm } from '@inertiajs/react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

type Level = {
  id: number
  name: string
  level: number
}

type EditAvatarModalProps = {
  isOpen: boolean
  onClose: () => void
  avatar: Avatar | null
  onSuccess: (updatedAvatar: Avatar) => void
}

interface EditAvatarFormData extends AvatarFormData {
  _method: 'PUT'
  level_required: number
  [key: string]: any
}

export function EditAvatarModal({ isOpen, onClose, avatar: initialAvatar, onSuccess }: EditAvatarModalProps) {
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [avatar, setAvatar] = useState<Avatar | null>(initialAvatar)
  const [levels, setLevels] = useState<Level[]>([])

  useEffect(() => {
    setAvatar(initialAvatar)
  }, [initialAvatar])

  if (!isOpen || !avatar) return null

  const { data, setData, errors, setError } = useForm<EditAvatarFormData>({
    name: avatar.name || '',
    price: typeof avatar.price === 'string' ? parseFloat(avatar.price) : avatar.price || 0,
    is_active: avatar.is_active ?? true,
    image_url: null,
    level_required: avatar.level_required,
    _method: 'PUT'
  })

  useEffect(() => {
    if (avatar) {
      setData({
        name: avatar.name,
        price: typeof avatar.price === 'string' ? parseFloat(avatar.price) : avatar.price || 0,
        is_active: avatar.is_active ?? true,
        image_url: null,
        level_required: avatar.level_required,
        _method: 'PUT'
      })
      setPreviewImage(avatar.image_url ? avatar.image_url : null)
    }
  }, [avatar, setData])

  // Fetch levels
  useEffect(() => {
    if (!isOpen) return
    const fetchLevels = async () => {
      try {
        const res = await fetch('/api/levels', {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
          },
          credentials: 'include'
        })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const json = await res.json()
        setLevels(Array.isArray(json?.levels) ? json.levels : [])
      } catch (err) {
        console.error('Error fetching levels:', err)
        setLevels([])
      }
    }
    fetchLevels()
  }, [isOpen])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setData('image_url', file)
      const reader = new FileReader()
      reader.onloadend = () => setPreviewImage(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!avatar) {
      toast.error('Error cargando información del avatar')
      onClose()
      return
    }

    const formData = new FormData()
    formData.append('_method', 'PUT')
    formData.append('name', data.name)
    formData.append('price', data.price.toString())
    formData.append('is_active', data.is_active ? '1' : '0')
    formData.append('level_required', data?.level_required?.toString())

    if (data.image_url instanceof File) {
      formData.append('image_url', data.image_url)
    }

    router.post(`/admin/avatars/${avatar.id}`, formData, {
      onBefore: () => setIsLoading(true),
      onSuccess: (response) => {
        const avatarData = (response.props.avatar as any) || response
        const updatedAvatar: Avatar = {
          ...avatar,
          id: avatarData?.id ?? avatar.id,
          name: avatarData?.name ?? avatar.name,
          price: avatarData?.price ?? avatar.price,
          is_active: avatarData?.is_active ?? avatar.is_active ?? true,
          image_url: avatarData?.image_url ?? avatar.image_url,
          level_required: avatarData?.level_required ?? avatar.level_required,
          updated_at: avatarData.updated_at || new Date().toISOString()
        }

        toast.success('Avatar actualizado exitosamente')
        onClose()
        onSuccess(updatedAvatar)
      },
      onError: (error) => {
        setError(error)
        toast.error(error.message || 'Error al actualizar el avatar')
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
          <DialogTitle>Editar Avatar</DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='name'>Nombre *</Label>
            <Input id='name' value={data.name} onChange={(e) => setData('name', e.target.value)} required />
            {errors.name && <p className='text-sm text-red-500'>{errors.name}</p>}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='price'>Precio *</Label>
            <div className='relative mt-1 rounded-md shadow-sm'>
              <Input
                id='price'
                type='number'
                min='0'
                step='0.01'
                value={data.price}
                onChange={(e) => setData('price', parseFloat(e.target.value) || 0)}
                className='pl-7'
                required
              />
            </div>
            {errors.price && <p className='text-sm text-red-500'>{errors.price}</p>}
          </div>

          {/* Si NO quieres ocultarlo, quita style={{ display: 'none' }} */}
          <div className='space-y-2' /* style={{ display: 'none' }} */>
            <Label htmlFor='level_required'>Nivel requerido</Label>
            <select
              id='level_required'
              value={data.level_required ?? ''}
              onChange={(e) => setData('level_required', parseInt(e.target.value))}
              className='border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50'
            >
              {levels.map((level) => (
                <option key={level.id} value={level.id}>
                  Nivel {level.level} - {level.name}
                </option>
              ))}
            </select>
            {errors.level_required && <p className='text-sm text-red-500'>{errors.level_required}</p>}
          </div>

          <div className='flex items-center space-x-2'>
            <input
              type='checkbox'
              id='is_active'
              checked={data.is_active}
              onChange={(e) => setData('is_active', e.target.checked)}
              className='h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500'
            />
            <Label htmlFor='is_active' className='text-sm font-medium text-gray-700'>
              Activo
            </Label>
          </div>

          <div className='space-y-2'>
            <Label>Imagen del Avatar</Label>
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
                  <Label
                    htmlFor='image_url'
                    className='relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 focus-within:outline-none hover:text-indigo-500'
                  >
                    <Input id='image_url' name='image_url' type='file' accept='image/*' onChange={handleFileChange} className='sr-only' />
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
