import AppLayout from '@/Layouts/app-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Avatar as AvatarType, PageProps } from '@/types'
import { Head, useForm } from '@inertiajs/react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

interface Props extends PageProps {
  avatar: AvatarType
}

export default function EditAvatar({ auth, avatar: serverAvatar }: Props) {
  const { data, setData, put, processing, errors } = useForm({
    name: serverAvatar.name,
    price: serverAvatar.price.toString(),
    is_active: serverAvatar.is_active,
    image: null as File | null
  })

  const [preview, setPreview] = useState<string | null>(serverAvatar.image_url || null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setData('image', file)
      setPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    put(route('teacher.avatars.update', serverAvatar.id), {
      onSuccess: () => {
        toast.success('Avatar actualizado exitosamente')
      },
      onError: () => {
        toast.error('Error al actualizar el avatar')
      },
      forceFormData: true
    })
  }

  // Update form data when serverAvatar changes
  useEffect(() => {
    setData({
      name: serverAvatar.name,
      price: serverAvatar.price.toString(),
      is_active: serverAvatar.is_active,
      image: null
    })
    setPreview(serverAvatar.image_url || null)
  }, [serverAvatar])

  return (
    <AppLayout user={auth.user}>
      <Head title={`Editar Avatar: ${serverAvatar.name}`} />

      <div className='container mx-auto py-6'>
        <div className='mb-6 flex items-center justify-between'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Editar Avatar</h2>
            <p className='text-muted-foreground'>{serverAvatar.name}</p>
          </div>
        </div>

        <Card className='mx-auto max-w-2xl'>
          <CardHeader>
            <CardTitle>Información del Avatar</CardTitle>
            <CardDescription>Actualiza los detalles del avatar.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className='space-y-6'>
              <div className='space-y-2'>
                <Label htmlFor='name'>Nombre del Avatar</Label>
                <Input id='name' value={data.name} onChange={(e) => setData('name', e.target.value)} placeholder='Ej: Estudiante Ejemplar' />
                {errors.name && <p className='text-sm text-red-500'>{errors.name}</p>}
              </div>

              <div className='space-y-2'>
                <Label htmlFor='price'>Precio en puntos</Label>
                <Input
                  id='price'
                  type='number'
                  min='0'
                  step='0.01'
                  value={data.price}
                  onChange={(e) => setData('price', e.target.value)}
                  placeholder='Ej: 100.00'
                />
                {errors.price && <p className='text-sm text-red-500'>{errors.price}</p>}
              </div>

              <div className='flex items-center space-x-2'>
                <Switch id='is_active' checked={data.is_active} onCheckedChange={(checked) => setData('is_active', checked)} />
                <Label htmlFor='is_active'>Activo</Label>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='image'>Imagen del Avatar</Label>
                <Input id='image' type='file' accept='image/*' onChange={handleImageChange} className='cursor-pointer' />
                {errors.image && <p className='text-sm text-red-500'>{errors.image}</p>}
                {(preview || serverAvatar.image_url) && (
                  <div className='mt-4'>
                    <p className='mb-2 text-sm font-medium'>{data.image ? 'Nueva vista previa:' : 'Vista previa actual:'}</p>
                    <div className='h-32 w-32 overflow-hidden rounded-md border'>
                      <img src={preview || serverAvatar.image_url} alt='Vista previa' className='h-full w-full object-cover' />
                    </div>
                  </div>
                )}
              </div>

              <div className='flex justify-end space-x-4 pt-4'>
                <Button type='button' variant='outline' onClick={() => window.history.back()} disabled={processing}>
                  Cancelar
                </Button>
                <Button type='submit' disabled={processing}>
                  {processing ? 'Actualizando...' : 'Actualizar Avatar'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
