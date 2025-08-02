import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import AppLayout from '@/layouts/app-layout'
import { PageProps } from '@/types'
import type { Avatar } from '@/types/avatar'
import { Head } from '@inertiajs/react'
import { Edit, Plus, Search, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { CreateAvatarModal } from './create-avatar-modal'
import { EditAvatarModal } from './edit-avatar-modal'

type Props = {
  auth: PageProps['auth']
}

export default function AvatarsPage({ auth }: Props) {
  const [avatars, setAvatars] = useState<Avatar[]>([])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedAvatar, setSelectedAvatar] = useState<Avatar | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  // Function to fetch avatars from the API
  const fetchAvatars = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/teacher/avatars', {
        headers: {
          Accept: 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        }
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Error HTTP:', errorText)
        throw new Error(`Error HTTP! status: ${response.status}`)
      }

      const data = await response.json()

      // Handle different possible response structures
      if (data.avatars && data.avatars.data) {
        setAvatars(data.avatars.data)
      } else if (Array.isArray(data)) {
        setAvatars(data)
      } else if (data.data) {
        setAvatars(data.data)
      } else {
        console.warn('Unexpected API response structure:', data)
        setAvatars([])
      }
    } catch (error) {
      console.error('Error cargando avatars:', error)
      toast.error('Error cargando lista de avatars')
    } finally {
      setIsLoading(false)
    }
  }

  // Load avatars when component mounts
  useEffect(() => {
    fetchAvatars()
  }, [])

  // Filter avatars based on search term
  const filteredAvatars = avatars.filter(
    (avatar) =>
      avatar.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (avatar.price?.toString() || '').includes(searchTerm) ||
      (avatar.requiredLevel?.level?.toString() || '').includes(searchTerm)
  )

  // Handle avatar deletion
  const handleDelete = async (avatarId: number) => {
    if (!confirm('¿Estás seguro de eliminar este avatar?')) {
      return
    }

    try {
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
      const response = await fetch(`/teacher/avatars/${avatarId}`, {
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
  }

  return (
    <AppLayout user={auth.user}>
      <div className='container mx-auto p-6'>
        <Head title='Gestión de Avatar' />

        <div className='mb-6 flex items-center justify-between'>
          <h1 className='text-2xl font-bold text-gray-800'>Gestión de Avatar</h1>
          <div className='flex items-center space-x-4'>
            <div className='relative w-64'>
              <Search className='absolute top-2.5 left-2.5 h-4 w-4 text-gray-500' />
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

        <div className='rounded-lg border bg-white'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className='py-4 text-center'>
                    Cargando avatars...
                  </TableCell>
                </TableRow>
              ) : filteredAvatars.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className='py-4 text-center'>
                    No se encontraron avatares
                  </TableCell>
                </TableRow>
              ) : (
                filteredAvatars.map((avatar) => (
                  <TableRow key={avatar.id}>
                    <TableCell>
                      {avatar.image_url ? (
                        <img
                          src={avatar.image_url.startsWith('http') ? avatar.image_url : `/storage/${avatar.image_url}`}
                          alt={avatar.name}
                          className='h-10 w-10 rounded-full object-cover'
                        />
                      ) : (
                        <div className='flex h-10 w-10 items-center justify-center rounded-full bg-gray-200'>
                          <span className='text-xs text-gray-500'>No image</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className='font-medium'>{avatar.name}</TableCell>
                    <TableCell>{avatar.price}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          avatar.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {avatar.is_active ? 'Activo' : 'Inactivo'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className='flex space-x-2'>
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
                        <Button
                          variant='ghost'
                          size='icon'
                          onClick={() => handleDelete(avatar.id)}
                          className='text-red-600 hover:text-red-800'
                          title='Eliminar avatar'
                        >
                          <Trash2 className='h-4 w-4' />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <CreateAvatarModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={async () => {
          await fetchAvatars()
          setIsCreateModalOpen(false)
        }}
      />

      {selectedAvatar && (
        <EditAvatarModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false)
            setSelectedAvatar(null)
          }}
          avatar={selectedAvatar}
          onSuccess={async () => {
            await fetchAvatars()
            setIsEditModalOpen(false)
            setSelectedAvatar(null)
          }}
        />
      )}
    </AppLayout>
  )
}
