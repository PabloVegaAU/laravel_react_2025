import DataTable from '@/components/organisms/data-table'
import FlashMessages from '@/components/organisms/flash-messages'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import AppLayout from '@/layouts/app-layout'
import type { Avatar } from '@/types/avatar'
import { Head, router } from '@inertiajs/react'
import { ColumnDef } from '@tanstack/react-table'
import { Edit, Plus, Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import { CreateAvatarModal } from './create-avatar-modal'
import { EditAvatarModal } from './edit-avatar-modal'

export default function AvatarsPage({ avatars: initialAvatars }: { avatars: any }) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedAvatar, setSelectedAvatar] = useState<Avatar | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [avatarsData, setAvatarsData] = useState(initialAvatars)

  // Handle search with debounce
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchTerm !== '') {
        setIsSearching(true)
        router.get(
          '/admin/avatars',
          { search: searchTerm },
          {
            preserveState: true,
            onSuccess: (page) => {
              setAvatarsData(page.props.avatars)
              setIsSearching(false)
            },
            onError: () => {
              setIsSearching(false)
            }
          }
        )
      } else {
        // If search is empty, reset to initial data
        setAvatarsData(initialAvatars)
      }
    }, 500) // 500ms debounce

    return () => clearTimeout(delayDebounce)
  }, [searchTerm])

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

  return (
    <AppLayout>
      <FlashMessages />
      <Head title='Gestión de Avatar' />

      <div className='relative flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4'>
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
                disabled={isSearching}
              />
              {isSearching && (
                <div className='absolute top-2 right-2'>
                  <div className='h-4 w-4 animate-spin rounded-full border-2 border-gray-400 border-t-transparent'></div>
                </div>
              )}
            </div>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className='mr-2 h-4 w-4' />
              Nuevo Avatar
            </Button>
          </div>
        </div>

        <DataTable columns={columns} data={avatarsData} />
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
