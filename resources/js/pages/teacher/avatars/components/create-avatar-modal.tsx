import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useForm } from '@inertiajs/react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

type CreateAvatarModalProps = {
  isOpen: boolean
  onClose: () => void
  onSuccess: (newAvatar: any) => void
}

export function CreateAvatarModal({ isOpen, onClose, onSuccess }: CreateAvatarModalProps) {
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const { data, setData, errors, reset } = useForm({
    name: '',
    points_store: '',
    image: null as File | null,
    is_active: true
  })

  useEffect(() => {
    if (isOpen) {
      reset()
      setPreviewImage(null)
    }
  }, [isOpen])

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
    setIsLoading(true)

    try {
      let imageUrl = ''

      if (data.image) {
        const imageForm = new FormData()
        imageForm.append('image', data.image)

        try {
          const uploadResponse = await fetch('/api/upload', {
            method: 'POST',
            headers: {
              'X-Requested-With': 'XMLHttpRequest'
            },
            body: imageForm
          })

          if (uploadResponse.ok) {
            const uploadResult = await uploadResponse.json()
            if (uploadResult.success && uploadResult.url) {
              imageUrl = uploadResult.url
            } else {
              toast.warning('No se pudo obtener la URL de la imagen, se usará vacía.')
            }
          } else {
            toast.warning('No se pudo subir la imagen, se usará vacía.')
          }
        } catch (uploadError) {
          console.warn('Error al intentar subir imagen, se omite:', uploadError)
          toast.warning('La imagen no se subió, pero el avatar será creado igualmente.')
        }
      }

      const payload = {
        p_id: 0,
        p_name: data.name,
        p_image_url: imageUrl,
        p_price: data.points_store,
        p_is_active: data.is_active
      }

      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
      const response = await fetch('/api/avatargra', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'X-CSRF-TOKEN': csrfToken
        },
        body: JSON.stringify(payload)
      })

      const result = await response.json()

      if (response.ok && result.success) {
        const resData = result.data[0]
        toast.success(resData.mensa || 'Avatar creado correctamente')

        onSuccess({
          id: resData.numid,
          name: data.name,
          points_store: parseFloat(data.points_store),
          image: imageUrl,
          is_active: data.is_active
        })

        onClose()
        reset()
        setPreviewImage(null)
      } else {
        toast.error(result.message || 'Error al crear avatar')
      }
    } catch (err) {
      console.error('Error al crear avatar:', err)
      toast.error('Error del servidor al guardar avatar')
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

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='name'>Nombre</Label>
            <Input id='name' value={data.name} onChange={(e) => setData('name', e.target.value)} required />
            {errors.name && <p className='text-sm text-red-500'>{errors.name}</p>}
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
                    <input id='file-upload' type='file' className='sr-only' onChange={handleFileChange} accept='image/*' required />
                  </label>
                  <p className='pl-1'>o arrastra y suelta</p>
                </div>
                <p className='text-xs text-gray-500'>PNG, JPG, GIF hasta 10MB</p>
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
