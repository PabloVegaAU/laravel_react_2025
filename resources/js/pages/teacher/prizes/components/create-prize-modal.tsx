import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { CalendarIcon, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

interface CreatePrizeModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (prize: any) => void
}

export function CreatePrizeModal({ isOpen, onClose, onSubmit }: CreatePrizeModalProps) {
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    stock: '0',
    points_cost: '0',
    is_active: true,
    available_until: '',
    image: null as File | null
  })

  useEffect(() => {
    if (!isOpen) {
      // Reset form when modal is closed
      setFormData({
        name: '',
        description: '',
        stock: '0',
        points_cost: '0',
        is_active: true,
        available_until: '',
        image: null
      })
      setPreviewImage(null)
      setDate(undefined)
    }
  }, [isOpen])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/svg+xml']
    if (!validTypes.includes(file.type)) {
      toast.error('Formato de archivo no válido. Por favor, sube una imagen (JPEG, PNG, JPG, GIF o SVG).')
      e.target.value = '' // Reset the file input
      return
    }

    // Validate file size (e.g., 5MB max)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      toast.error('La imagen es demasiado grande. El tamaño máximo permitido es 5MB.')
      e.target.value = '' // Reset the file input
      return
    }

    setFormData((prev) => ({
      ...prev,
      image: file
    }))

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreviewImage(reader.result as string)
    }
    reader.onerror = () => {
      toast.error('Error al cargar la imagen. Por favor, inténtalo de nuevo.')
      e.target.value = '' // Reset the file input
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name) {
      toast.error('El nombre del premio es obligatorio')
      return
    }

    if (!formData.image) {
      toast.error('La imagen del premio es obligatoria')
      return
    }

    setIsLoading(true)

    try {
      const formDataToSend = new FormData()

      // Add all form fields
      formDataToSend.append('name', formData.name)
      formDataToSend.append('description', formData.description || '')
      formDataToSend.append('stock', formData.stock)
      formDataToSend.append('points_cost', formData.points_cost)
      formDataToSend.append('is_active', formData.is_active ? '1' : '0')

      if (date) {
        formDataToSend.append('available_until', date.toISOString().split('T')[0])
      }

      if (formData.image) {
        // Ensure we're sending the file with the correct field name and MIME type
        // Use the same field name as expected by the backend ('image')
        formDataToSend.append('image', formData.image, formData.image.name)

        // Log the file info for debugging
        console.log('File being sent:', {
          name: formData.image.name,
          type: formData.image.type,
          size: formData.image.size
        })
      }

      // Log the FormData entries for debugging
      console.log('FormData entries:')
      for (const pair of formDataToSend.entries()) {
        console.log(pair[0], pair[1])
      }

      try {
        const response = await fetch('/api/prizes', {
          method: 'POST',
          headers: {
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
            Accept: 'application/json'
            // Let the browser set the Content-Type with boundary
          },
          credentials: 'same-origin',
          body: formDataToSend
        })

        const data = await response.json()

        if (response.ok) {
          toast.success('Premio creado exitosamente')
          onSubmit(data.data)
          onClose()
        } else {
          console.error('Error response from server:', {
            status: response.status,
            statusText: response.statusText,
            data
          })
          const errorMessage = data.message || 'Error al crear el premio'
          const errors = data.errors ? Object.values(data.errors).flat().join('\n') : ''
          toast.error(`${errorMessage}${errors ? '\n' + errors : ''}`)
        }
      } catch (fetchError) {
        console.error('Fetch error:', fetchError)
        toast.error('Error de conexión. Por favor, inténtalo de nuevo.')
      }
    } catch (error) {
      console.error('Error creating prize:', error)
      toast.error('Error al conectar con el servidor')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className='max-h-[90vh] overflow-y-auto sm:max-w-[600px]'>
        <DialogHeader>
          <DialogTitle>Crear Nuevo Premio</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <div className='space-y-4'>
              <div>
                <Label htmlFor='name'>Nombre del Premio *</Label>
                <Input
                  id='name'
                  name='name'
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder='Ej: Auriculares inalámbricos'
                  disabled={isLoading}
                />
              </div>

              <div>
                <Label htmlFor='description'>Descripción</Label>
                <Textarea
                  id='description'
                  name='description'
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder='Descripción detallada del premio'
                  rows={3}
                  disabled={isLoading}
                />
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <Label htmlFor='stock'>Stock</Label>
                  <Input id='stock' name='stock' type='number' min='0' value={formData.stock} onChange={handleInputChange} disabled={isLoading} />
                </div>

                <div>
                  <Label htmlFor='points_cost'>Costo en Puntos</Label>
                  <Input
                    id='points_cost'
                    name='points_cost'
                    type='number'
                    min='0'
                    value={formData.points_cost}
                    onChange={handleInputChange}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className='flex items-center justify-between pt-2'>
                <Label htmlFor='is_active'>¿Premio activo?</Label>
                <Switch
                  id='is_active'
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, is_active: checked }))}
                  disabled={isLoading}
                />
              </div>

              <div>
                <Label>Disponible hasta</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant='outline'
                      className={cn('w-full justify-start text-left font-normal', !date && 'text-muted-foreground')}
                      disabled={isLoading}
                    >
                      <CalendarIcon className='mr-2 h-4 w-4' />
                      {date ? format(date, 'PPP', { locale: es }) : <span>Seleccionar fecha</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className='w-auto p-0' align='start'>
                    <Calendar mode='single' selected={date} onSelect={setDate} initialFocus locale={es} disabled={(date) => date < new Date()} />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className='space-y-4'>
              <div>
                <Label>Imagen del Premio *</Label>
                <div className='mt-1 flex justify-center rounded-lg border-2 border-dashed px-6 pt-5 pb-6'>
                  <div className='space-y-1 text-center'>
                    {previewImage ? (
                      <div className='relative'>
                        <img src={previewImage} alt='Vista previa' className='mx-auto h-40 w-auto rounded object-contain' />
                        <Button
                          type='button'
                          variant='ghost'
                          size='sm'
                          className='absolute -top-2 -right-2'
                          onClick={() => {
                            setPreviewImage(null)
                            setFormData((prev) => ({ ...prev, image: null }))
                          }}
                          disabled={isLoading}
                        >
                          <span className='sr-only'>Eliminar imagen</span>
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            width='16'
                            height='16'
                            viewBox='0 0 24 24'
                            fill='none'
                            stroke='currentColor'
                            strokeWidth='2'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                          >
                            <line x1='18' y1='6' x2='6' y2='18'></line>
                            <line x1='6' y1='6' x2='18' y2='18'></line>
                          </svg>
                        </Button>
                      </div>
                    ) : (
                      <>
                        <svg className='mx-auto h-12 w-12 text-gray-400' stroke='currentColor' fill='none' viewBox='0 0 48 48' aria-hidden='true'>
                          <path
                            d='M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02'
                            strokeWidth={2}
                            strokeLinecap='round'
                            strokeLinejoin='round'
                          />
                        </svg>
                        <div className='flex text-sm text-gray-600'>
                          <label
                            htmlFor='image-upload'
                            className='text-primary hover:text-primary/90 relative cursor-pointer rounded-md bg-white font-medium focus-within:outline-none'
                          >
                            <span>Subir una imagen</span>
                            <input
                              id='image-upload'
                              name='image-upload'
                              type='file'
                              className='sr-only'
                              accept='image/*'
                              onChange={handleFileChange}
                              disabled={isLoading}
                            />
                          </label>
                          <p className='pl-1'>o arrastrar y soltar</p>
                        </div>
                        <p className='text-xs text-gray-500'>PNG, JPG, GIF hasta 2MB</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className='mt-6'>
            <Button type='button' variant='outline' onClick={onClose} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type='submit' disabled={isLoading || !formData.name || !formData.image}>
              {isLoading ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Creando...
                </>
              ) : (
                'Crear Premio'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
