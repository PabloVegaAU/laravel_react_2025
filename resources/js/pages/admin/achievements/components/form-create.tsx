import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from '@/components/ui/use-toast'
import { CreateAchievementData } from '@/types/achievement'
import { useForm } from '@inertiajs/react'
import { Loader2 } from 'lucide-react'

interface CreateAchievementDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateAchievementDialog({ isOpen, onOpenChange }: CreateAchievementDialogProps) {
  const { data, setData, post, processing, errors, reset } = useForm<CreateAchievementData>({
    name: '',
    description: '',
    image: '',
    activo: true
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    post(route('admin.achievements.store'), {
      onSuccess: () => {
        toast({
          title: '¡Éxito!',
          description: 'El logro se ha creado correctamente'
        })
        onOpenChange(false)
        reset()
      },
      onError: (errors) => {
        toast({
          title: 'Error',
          description: 'Ha ocurrido un error al crear el logro',
          variant: 'destructive'
        })
        console.error('Error creating achievement:', errors)
      }
    })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setData('image', file)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant='default'>Nuevo Logro</Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Crear Nuevo Logro</DialogTitle>
          <DialogDescription>Completa los campos para crear un nuevo logro. Los campos marcados con * son obligatorios.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='name'>Nombre del logro *</Label>
            <Input
              id='name'
              value={data.name}
              onChange={(e) => setData('name', e.target.value)}
              placeholder='Ej: Mejor estudiante del mes'
              required
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && <p className='text-sm text-red-500'>{errors.name}</p>}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='description'>Descripción</Label>
            <Input
              id='description'
              value={data.description}
              onChange={(e) => setData('description', e.target.value)}
              placeholder='Describe el logro y cómo se obtiene'
              className={errors.description ? 'border-red-500' : ''}
            />
            {errors.description && <p className='text-sm text-red-500'>{errors.description}</p>}
          </div>

          <div>
            <Label htmlFor='image'>Imagen</Label>
            <Input id='image' type='file' accept='image/*' onChange={handleFileChange} className='mt-1 block w-full' />
            {errors.image && <p className='mt-1 text-sm text-red-500'>{errors.image}</p>}
          </div>

          <div className='flex items-center space-x-2'>
            <Checkbox id='activo' checked={data.activo} onCheckedChange={(checked) => setData('activo', Boolean(checked))} />
            <Label htmlFor='activo' className='text-sm leading-none font-medium'>
              Activo
            </Label>
          </div>

          <div className='flex justify-end space-x-2 pt-4'>
            <Button type='button' variant='outline' onClick={() => onOpenChange(false)} disabled={processing}>
              Cancelar
            </Button>
            <Button type='submit' disabled={processing}>
              {processing ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Guardando...
                </>
              ) : (
                'Guardar Logro'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
