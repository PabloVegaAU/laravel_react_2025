import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar } from '@/types'
import { useForm } from '@inertiajs/react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

type CreateAvatarFormData = {
  name: string
  price: number | string
  is_active: boolean
  image_url: File | string | null
  required_level_id: number | null
  [key: string]: any // Index signature to satisfy Inertia's useForm
}

type CreateAvatarModalProps = {
  isOpen: boolean
  onClose: () => void
  onSuccess: (avatar: Avatar) => void
}

export function CreateAvatarModal({ isOpen, onClose, onSuccess }: CreateAvatarModalProps) {
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [levels, setLevels] = useState<{ id: number; level: number }[]>([])

  const { data, setData, errors, reset } = useForm<CreateAvatarFormData>({
    name: '',
    price: 0,
    is_active: true,
    image_url: null,
    required_level_id: null
  })

  useEffect(() => {
    if (isOpen) {
      reset()
      setPreviewImage(null)
      // Fetch levels for the dropdown
      fetch('/api/levels')
        .then((res) => res.json())
        .then((data) => setLevels(data.data || []))
        .catch(console.error)
    }
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
    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.append('name', data.name)
      formData.append('price', data.price.toString())
      formData.append('is_active', data.is_active ? '1' : '0')
      if (data.required_level_id) {
        formData.append('required_level_id', data.required_level_id.toString())
      }
      if (data.image_url instanceof File) {
        formData.append('image_url', data.image_url)
      }

      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
      const response = await fetch('/admin/avatars', {
        method: 'POST',
        headers: {
          'X-CSRF-TOKEN': csrfToken,
          'X-Requested-With': 'XMLHttpRequest',
          Accept: 'application/json'
        },
        body: formData
      })

      const responseData = await response.json()

      if (!response.ok) {
        if (responseData.errors) {
          // Show validation errors as toast
          Object.values(responseData.errors)
            .flat()
            .forEach((errorMsg) => {
              toast.error(String(errorMsg))
            })
          return
        }
        throw new Error(responseData.message || 'Error creando avatar')
      }

      toast.success('Avatar creado correctamente')
      onSuccess(responseData.data || responseData.avatar)
      onClose()
    } catch (error) {
      console.error('Error creando avatar:', error)
      if (error instanceof Error && !error.message.includes('validation')) {
        toast.error(error.message || 'Error creando avatar')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>Crear Avatar</DialogTitle>
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

          <div className='space-y-2' style={{ display: 'none' }}>
            <Label htmlFor='required_level_id'>Nivel requerido</Label>
            <select
              id='required_level_id'
              value={data.required_level_id || ''}
              onChange={(e) => setData('required_level_id', e.target.value ? parseInt(e.target.value) : null)}
              className='border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50'
            >
              <option value=''>None (Available to all levels)</option>
              {levels.map((level) => (
                <option key={level.id} value={level.id}>
                  Level {level.level}
                </option>
              ))}
            </select>
            {errors.required_level_id && <p className='text-sm text-red-500'>{errors.required_level_id}</p>}
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
            <Label>Imagen del Avatar *</Label>
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
                  <Input id='image_url' name='image_url' type='file' accept='image/*' onChange={handleFileChange} className='sr-only' />
                  <Label
                    htmlFor='image_url'
                    className='relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 focus-within:outline-none hover:text-indigo-500'
                  >
                    <span>Cargar imagen</span>
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
              {isLoading ? 'Guardando...' : 'Guardar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
