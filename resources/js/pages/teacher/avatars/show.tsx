import AppLayout from '@/Layouts/app-layout'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'
import { PageProps } from '@/types'
import { Head, Link } from '@inertiajs/react'
import { ArrowLeft, Pencil } from 'lucide-react'

interface Props extends PageProps {
  avatar: {
    id: number
    name: string
    image_url: string
    price: number
    is_active: boolean
    created_at: string
    updated_at: string
  }
}

export default function ShowAvatar({ auth, avatar }: Props) {
  return (
    <AppLayout user={auth.user}>
      <Head title={`Avatar: ${avatar.name}`} />

      <div className='container mx-auto py-6'>
        <div className='mb-6 flex items-center justify-between'>
          <div className='flex items-center space-x-4'>
            <Button variant='outline' size='icon' asChild>
              <Link href={route('teacher.avatars.index')}>
                <ArrowLeft className='h-4 w-4' />
              </Link>
            </Button>
            <div>
              <h2 className='text-2xl font-bold tracking-tight'>{avatar.name}</h2>
              <p className='text-muted-foreground'>Detalles del avatar</p>
            </div>
          </div>
          <Button asChild>
            <Link href={route('teacher.avatars.edit', avatar.id)}>
              <Pencil className='mr-2 h-4 w-4' />
              Editar
            </Link>
          </Button>
        </div>

        <div className='grid gap-6 md:grid-cols-2'>
          <Card>
            <CardHeader>
              <CardTitle>Vista previa</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='flex flex-col items-center justify-center p-8'>
                <div className='border-primary/20 mb-6 h-64 w-64 overflow-hidden rounded-full border-4'>
                  <img src={avatar.image_url} alt={avatar.name} className='h-full w-full object-cover' />
                </div>
                <h3 className='text-xl font-semibold'>{avatar.name}</h3>
                <div className='mt-2'>
                  <Badge variant={avatar.is_active ? 'default' : 'outline'}>{avatar.is_active ? 'Activo' : 'Inactivo'}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className='space-y-6'>
            <Card>
              <CardHeader>
                <CardTitle>Información del Avatar</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div>
                  <p className='text-muted-foreground text-sm'>Nombre</p>
                  <p className='font-medium'>{avatar.name}</p>
                </div>
                <div>
                  <p className='text-muted-foreground text-sm'>Precio</p>
                  <p className='font-medium'>{formatCurrency(avatar.price)}</p>
                </div>
                <div>
                  <p className='text-muted-foreground text-sm'>Estado</p>
                  <p className='font-medium'>
                    <Badge variant={avatar.is_active ? 'default' : 'outline'}>{avatar.is_active ? 'Activo' : 'Inactivo'}</Badge>
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Más información</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div>
                  <p className='text-muted-foreground text-sm'>Creado el</p>
                  <p className='font-medium'>
                    {new Date(avatar.created_at).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <div>
                  <p className='text-muted-foreground text-sm'>Última actualización</p>
                  <p className='font-medium'>
                    {new Date(avatar.updated_at).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
