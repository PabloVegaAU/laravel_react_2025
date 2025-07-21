import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import AppLayout from '@/layouts/app-layout'
import { Avatar as AvatarType } from '@/types/avatar'
import { SharedData } from '@/types/core/shared'
import { Head, Link, router } from '@inertiajs/react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'

interface PageProps {
  auth: SharedData['auth']
  [key: string]: any
}

interface Props extends PageProps {
  avatars: AvatarType[]
}

export default function AvatarIndex({ auth, avatars }: Props) {
  const [isLoading, setIsLoading] = useState<Record<number, boolean>>({})

  const handleDelete = (id: number) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este avatar?')) {
      return
    }

    setIsLoading((prev) => ({ ...prev, [id]: true }))

    router.delete(route('teacher.avatars.destroy', id), {
      onFinish: () => {
        setIsLoading((prev) => {
          const newState = { ...prev }
          delete newState[id]
          return newState
        })
      }
    })
  }

  return (
    <AppLayout user={auth.user}>
      <div className='container mx-auto p-6'>
        <div className='mb-6 flex items-center justify-between'>
          <Head title='Gestión de Avatares' />

          <div className='container mx-auto py-6'>
            <div className='mb-6 flex items-center justify-between'>
              <h2 className='text-2xl font-bold tracking-tight'>Gestión de Avatares</h2>
              <Button asChild>
                <Link href={route('teacher.avatars.create')}>
                  <Plus className='mr-2 h-4 w-4' />
                  Nuevo Avatar
                </Link>
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Lista de Avatares</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Avatar</TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Precio</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className='text-right'>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {avatars.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className='py-4 text-center'>
                          No hay avatares registrados.
                        </TableCell>
                      </TableRow>
                    ) : (
                      avatars.map((avatar) => (
                        <TableRow key={avatar.id}>
                          <TableCell>
                            <Avatar className='h-12 w-12'>
                              <AvatarImage src={avatar.image} alt={avatar.name} />
                            </Avatar>
                          </TableCell>
                          <TableCell className='font-medium'>{avatar.name}</TableCell>
                          <TableCell>{avatar.points_store}</TableCell>
                          <TableCell>
                            <Badge variant='default'>{avatar.points_store} puntos</Badge>
                          </TableCell>
                          <TableCell className='text-right'>
                            <div className='flex justify-end space-x-2'>
                              <Button variant='outline' size='icon' asChild>
                                <Link href={route('teacher.avatars.edit', avatar.id)}>
                                  <Pencil className='h-4 w-4' />
                                </Link>
                              </Button>
                              <Button variant='outline' size='icon' onClick={() => handleDelete(avatar.id)} disabled={isLoading[avatar.id]}>
                                <Trash2 className='text-destructive h-4 w-4' />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
