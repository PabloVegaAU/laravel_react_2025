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

type Prize = {
  id: number
  name: string
  description: string
  points_cost: number
  stock: number
  available_until: string | null
  is_active: boolean
  image: string
  created_at: string
  updated_at: string
  level_required?: number | null // 👈 por si viene columna
  required_level?: { id: number; name: string; level: number } | null // 👈 por si viene relación
}

type EditPrizeModalProps = {
  isOpen: boolean
  onClose: () => void
  prize: Prize | null
  onSuccess: (updatedPrize: Prize) => void
}

type PrizeFormData = {
  name: string
  description: string
  points_cost: string
  stock: string
  available_until: string
  is_active: boolean
  image: File | null
  level_required_id: number | null // 👈 id para el select
  _method: 'PUT'
}

export function EditPrizeModal({ isOpen, onClose, prize: initialPrize, onSuccess }: EditPrizeModalProps) {
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [prize, setPrize] = useState<Prize | null>(initialPrize)
  const [levels, setLevels] = useState<Level[]>([]) // 👈 niveles

  useEffect(() => {
    setPrize(initialPrize)
  }, [initialPrize])

  if (!isOpen || !prize) return null

  const { data, setData, errors, reset } = useForm<PrizeFormData>({
    name: prize.name || '',
    description: prize.description || '',
    points_cost: prize.points_cost?.toString() || '0',
    stock: prize.stock?.toString() || '1',
    available_until: prize.available_until || '',
    is_active: prize.is_active ?? true,
    image: null,
    level_required_id: prize.required_level?.id ?? prize.level_required ?? null, // 👈 inicialización flexible
    _method: 'PUT'
  })

  useEffect(() => {
    if (prize) {
      setData({
        name: prize.name,
        description: prize.description || '',
        points_cost: prize.points_cost.toString(),
        stock: prize.stock.toString(),
        available_until: prize.available_until || '',
        is_active: prize.is_active,
        image: null,
        level_required_id: prize.required_level?.id ?? prize.level_required ?? null,
        _method: 'PUT'
      })

      if (prize.image && typeof prize.image === 'string') {
        const imageUrl = prize.image.startsWith('http') || prize.image.startsWith('/') ? prize.image : `${prize.image}`
        setPreviewImage(imageUrl)
      } else {
        setPreviewImage(null)
      }
    }
  }, [prize, setData])

  // Cargar niveles al abrir
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
      setData('image', file)
      const reader = new FileReader()
      reader.onloadend = () => setPreviewImage(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prize) {
      toast.error('No se pudo cargar la información del premio')
      onClose()
      return
    }
    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.append('name', data.name)
      formData.append('description', data.description)
      formData.append('points_cost', data.points_cost)
      formData.append('stock', data.stock)
      if (data.available_until) {
        formData.append('available_until', data.available_until)
      }
      formData.append('is_active', data.is_active ? '1' : '0')
      formData.append('_method', 'PUT')

      if (data.image) {
        formData.append('image', data.image)
      }

      // 👇 enviar nivel
      if (data.level_required_id) {
        formData.append('level_required', String(data.level_required_id))
        formData.append('required_level_id', String(data.level_required_id)) // opcional
      } else {
        // si quieres "limpiar" nivel:
        formData.append('level_required', '')
        formData.append('required_level_id', '')
      }

      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
      const response = await fetch(`/admin/prizes/${prize.id}`, {
        method: 'POST',
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'X-CSRF-TOKEN': csrfToken,
          Accept: 'application/json'
        },
        body: formData
      })

      let responseData: any = {}
      try {
        responseData = await response.json()
      } catch {
        responseData = {}
      }

      if (!response.ok) {
        if (responseData.errors) {
          Object.values(responseData.errors)
            .flat()
            .forEach((errorMsg: any) => toast.error(String(errorMsg)))
          return
        }
        throw new Error(responseData.message || 'Error al actualizar el premio')
      }

      const prizeData = responseData.data ?? responseData.prize ?? responseData
      if (!prizeData) throw new Error('No se recibieron datos del premio actualizado')

      toast.success('Premio actualizado exitosamente')

      const updatedPrize: Prize = {
        id: prizeData.id || prize.id,
        name: prizeData.name || prize.name,
        description: prizeData.description || prize.description,
        points_cost: prizeData.points_cost ?? prize.points_cost,
        stock: prizeData.stock ?? prize.stock,
        available_until: prizeData.available_until ?? prize.available_until ?? null,
        is_active: prizeData.is_active ?? prize.is_active,
        image: prizeData.image || prize.image || '',
        created_at: prizeData.created_at || prize.created_at,
        updated_at: prizeData.updated_at || new Date().toISOString(),
        level_required: prizeData.level_required ?? prize.level_required ?? null,
        required_level: prizeData.required_level ?? prize.required_level ?? null
      }

      onSuccess(updatedPrize)
      onClose()
    } catch (error: any) {
      console.error('Error updating prize:', error)
      toast.error(error?.message || 'Error al actualizar el premio')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>Editar Premio</DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='name'>Nombre *</Label>
            <Input id='name' value={data.name} onChange={(e) => setData('name', e.target.value)} required />
            {errors.name && <p className='text-sm text-red-500'>{errors.name}</p>}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='description'>Descripción</Label>
            <Input id='description' value={data.description} onChange={(e) => setData('description', e.target.value)} />
            {errors.description && <p className='text-sm text-red-500'>{errors.description}</p>}
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='points_cost'>Costo en puntos *</Label>
              <Input
                id='points_cost'
                type='number'
                min='0'
                value={data.points_cost}
                onChange={(e) => setData('points_cost', e.target.value)}
                required
              />
              {errors.points_cost && <p className='text-sm text-red-500'>{errors.points_cost}</p>}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='stock'>Cantidad disponible *</Label>
              <Input id='stock' type='number' min='0' value={data.stock} onChange={(e) => setData('stock', e.target.value)} required />
              {errors.stock && <p className='text-sm text-red-500'>{errors.stock}</p>}
            </div>
          </div>

          {/* 👇 Level Required */}
          <div className='space-y-2'>
            <Label htmlFor='level_required_id'>Nivel requerido</Label>
            <select
              id='level_required_id'
              value={data.level_required_id ?? ''}
              onChange={(e) => setData('level_required_id', e.target.value ? parseInt(e.target.value) : null)}
              className='border-input bg-background ring-offset-background flex h-10 w-full rounded-md border px-3 py-2 text-sm'
            >
              {levels.map((level) => (
                <option key={level.id} value={level.id}>
                  Nivel {level.level} - {level.name}
                </option>
              ))}
            </select>
            {(errors as any).level_required && <p className='text-sm text-red-500'>{(errors as any).level_required}</p>}
          </div>

          <div className='space-y-2' style={{ display: 'none' }}>
            <Label htmlFor='available_until'>Disponible hasta</Label>
            <Input
              id='available_until'
              type='datetime-local'
              value={data.available_until}
              onChange={(e) => setData('available_until', e.target.value)}
            />
            {errors.available_until && <p className='text-sm text-red-500'>{errors.available_until}</p>}
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
