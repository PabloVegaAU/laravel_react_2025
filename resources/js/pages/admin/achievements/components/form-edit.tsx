import InputError from '@/components/input-error'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { UpdateAchievementData } from '@/types/achievement'
import { useForm } from '@inertiajs/react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Pencil } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

interface EditAchievementDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  achievementId: number
  onSuccess?: () => void
}

export function EditAchievementDialog({ isOpen, onOpenChange, achievementId, onSuccess }: EditAchievementDialogProps) {
  // 1. Hooks de estado
  const queryClient = useQueryClient()
  const [preview, setPreview] = useState<string | null>(null)

  // 2. Hooks de datos
  const { data: achievement, isFetching } = useQuery({
    queryKey: ['achievement', achievementId],
    queryFn: async () => await fetch(route('admin.achievements.edit', achievementId)).then((res) => res.json()),
    enabled: isOpen && !!achievementId,
    staleTime: 1000 * 60 * 5, // 5 minutos
    refetchOnWindowFocus: false
  })

  // 3. Valores iniciales del formulario
  const initialValues: UpdateAchievementData = useMemo(
    () => ({
      name: achievement?.name,
      description: achievement?.description,
      image: achievement?.image,
      activo: achievement?.activo,
      _method: 'PUT'
    }),
    []
  )

  // 4. Hook de formulario
  const { data, setData, post, processing, errors, reset } = useForm<UpdateAchievementData>(initialValues)

  // 5. Efectos secundarios
  // Efecto para inicializar el formulario cuando se carga la pregunta
  useEffect(() => {
    if (isOpen && achievement) {
      const formData: UpdateAchievementData = {
        name: achievement.name,
        description: achievement.description,
        image: achievement.image,
        activo: achievement.activo,
        _method: 'PUT'
      }

      setData(formData)
      setPreview(achievement.image)
    }
  }, [isOpen, achievement, setData])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setData('image', file) // ✅ aquí se guarda el archivo real para enviar al backend
      setPreview(URL.createObjectURL(file)) // ✅ aquí solo guardas la URL temporal para mostrar preview
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    post(route('admin.achievements.update', achievementId), {
      forceFormData: true,
      preserveScroll: true,
      preserveState: true,
      only: ['achievements', 'flash', 'errors'],
      onSuccess: () => {
        onOpenChange(false)
        onSuccess?.()
        reset()
        queryClient.invalidateQueries({ queryKey: ['achievement', achievementId] })
      }
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant='ghost' size='icon' className='h-8 w-8 p-0'>
          <Pencil className='h-4 w-4' />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Logro</DialogTitle>
        </DialogHeader>

        {isFetching ? (
          <div className='flex justify-center py-8'>
            <div className='border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent' />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='name'>Nombre</Label>
              <Input id='name' value={data.name} onChange={(e) => setData('name', e.target.value)} placeholder='Nombre del logro' />
              <InputError message={errors.name} />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='description'>Descripción</Label>
              <Input
                id='description'
                value={data.description}
                onChange={(e) => setData('description', e.target.value)}
                placeholder='Descripción del logro'
              />
              <InputError message={errors.description} />
            </div>

            <div className='space-y-2'>
              <div className='flex items-center gap-6'>
                <div>
                  <Label htmlFor='image'>Imagen</Label>
                  <Input id='image' type='file' accept='image/*' onChange={handleFileChange} className='cursor-pointer' />
                </div>
                <div className='flex items-center gap-2'>
                  <Checkbox id='activo' checked={data.activo ?? false} onCheckedChange={(checked) => setData('activo', Boolean(checked))} />
                  <Label htmlFor='activo'>Activo</Label>
                </div>
              </div>
              {preview && (
                <div className='mt-2 flex items-center justify-center'>
                  <img src={preview} alt='Vista previa' className='h-32 w-32 rounded-md object-cover' />
                </div>
              )}
              <InputError message={errors.image} />
            </div>

            <div className='flex justify-end space-x-2 pt-4'>
              <Button type='button' variant='outline' onClick={() => onOpenChange(false)} disabled={processing}>
                Cancelar
              </Button>
              <Button type='submit' disabled={processing}>
                {processing ? 'Guardando...' : 'Guardar cambios'}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
