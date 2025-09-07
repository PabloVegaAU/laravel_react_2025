import DataTable from '@/components/organisms/data-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import AppLayout from '@/layouts/app-layout'
import type { Avatar } from '@/types/avatar'
import { Head } from '@inertiajs/react'
import { ColumnDef } from '@tanstack/react-table'
import { Edit, Plus, Search } from 'lucide-react'
import { useState } from 'react'
import { CreateAvatarModal } from './create-avatar-modal'
import { EditAvatarModal } from './edit-avatar-modal'

export default function AvatarsPage({ avatars }: any) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedAvatar, setSelectedAvatar] = useState<Avatar | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const columns: ColumnDef<Avatar>[] = [
    {
      header: 'ID',
      accessorKey: 'id'
    },
    {
      header: 'Imagen',
      accessorKey: 'image_url',
      cell: ({ row }) => {
        const avatar = row.original
        return (
          <div className='flex items-center space-x-2'>
            <img src={avatar.image_url} alt={avatar.name} className='h-10 w-10 rounded-full' />
          </div>
        )
      }
    },
    {
      header: 'Nombre',
      accessorKey: 'name'
    },
    {
      header: 'Precio',
      accessorKey: 'price'
    },
    {
      header: 'Nivel Requerido',
      accessorKey: 'requiredLevel'
    },
    {
      header: 'Estado',
      accessorKey: 'is_active',
      cell: ({ row }) => {
        const avatar = row.original
        return (
          <div className='flex items-center space-x-2'>
            {avatar.is_active ? <Badge variant='default'>Activo</Badge> : <Badge variant='destructive'>Inactivo</Badge>}
          </div>
        )
      }
    },
    {
      header: 'Acciones',
      id: 'actions',
      cell: ({ row }) => {
        const avatar = row.original
        return (
          <div className='flex items-center space-x-2'>
            <Button
              variant='ghost'
              size='icon'
              onClick={() => {
                setSelectedAvatar(avatar)
                setIsEditModalOpen(true)
              }}
              title='Editar avatar'
            >
              <Edit className='h-4 w-4' />
            </Button>
          </div>
        )
      }
    }
  ]

  // Handle avatar deletion
  /* const handleDelete = async (avatarId: number) => {
    if (!confirm('¿Estás seguro de eliminar este avatar?')) {
      return
    }

    try {
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
      const response = await fetch(`/admin/avatars/${avatarId}`, {
        method: 'POST',
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'X-CSRF-TOKEN': csrfToken,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ _method: 'DELETE' })
      })

      if (!response.ok) {
        throw new Error('Error eliminando avatar')
      }

      // Reload the avatars list
      await fetchAvatars()
      toast.success('Avatar eliminado correctamente')
    } catch (error) {
      console.error('Error eliminando avatar:', error)
      toast.error(error instanceof Error ? error.message : 'Error eliminando avatar')
    }
  } */

  return (
    <AppLayout>
      <div className='container mx-auto p-6'>
        <Head title='Gestión de Avatar' />

        <div className='mb-6 flex items-center justify-between'>
          <h1 className='text-2xl font-bold text-gray-900 dark:text-gray-100'>Gestión de Avatar</h1>
          <div className='flex items-center space-x-4'>
            <div className='relative w-64'>
              <Search className='absolute top-2.5 left-2.5 h-4 w-4 text-gray-500 dark:text-gray-400' />
              <Input
                type='search'
                placeholder='Buscar avatar...'
                className='pl-8'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className='mr-2 h-4 w-4' />
              Crear Avatar
            </Button>
          </div>
        </div>

        <DataTable columns={columns} data={avatars} />
      </div>

      <CreateAvatarModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} onSuccess={async () => setIsCreateModalOpen(false)} />

      {selectedAvatar && (
        <EditAvatarModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false)
            setSelectedAvatar(null)
          }}
          avatar={selectedAvatar}
          onSuccess={async () => {
            setIsEditModalOpen(false)
            setSelectedAvatar(null)
          }}
        />
      )}
    </AppLayout>
  )
}
