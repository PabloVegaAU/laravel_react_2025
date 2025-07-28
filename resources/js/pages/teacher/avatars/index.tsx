import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import AppLayout from '@/layouts/app-layout'
import { Avatar } from '@/types/avatar'
import { Head } from '@inertiajs/react'
import { Edit, Plus, Search, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { CreateAvatarModal } from './components/create-avatar-modal'
import { EditAvatarModal } from './components/edit-avatar-modal'

export default function AvatarIndex({ auth, avatars: initialAvatars }: { auth: any; avatars: Avatar[] }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedAvatar, setSelectedAvatar] = useState<Avatar | null>(null)
  const [avatars, setAvatars] = useState<Avatar[]>(initialAvatars || [])

  // Fetch avatars when component mounts or auth changes
  useEffect(() => {
    const fetchAvatars = async () => {
      try {
        const response = await fetch('/api/avatars', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
          }
        })
        const data = await response.json()
        if (data.success) {
          setAvatars(data.data || [])
        } else {
          console.error('Error en datos:', data.message)
        }
      } catch (error) {
        console.error('Error al obtener avatares:', error)
      }
    }

    fetchAvatars()
  }, [auth])

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este avatar?')) {
      return
    }

    try {
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
      const response = await fetch(`/api/avatars/${id}`, {
        method: 'DELETE',
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'X-CSRF-TOKEN': csrfToken,
          'Content-Type': 'application/json'
        }
      })

      const result = await response.json()

      if (response.ok && result.success) {
        setAvatars((prev) => prev.filter((avatar) => avatar.id !== id))
        toast.success('Avatar eliminado correctamente')
      } else {
        toast.error(result.message || 'Error al eliminar el avatar')
      }
    } catch (error) {
      console.error('Error al eliminar avatar:', error)
      toast.error('Error del servidor al eliminar el avatar')
    }
  }

  const handleCreateSuccess = (newAvatar: any) => {
    setAvatars((prev) => [newAvatar, ...prev])
  }

  const handleUpdateSuccess = (updatedAvatar: any) => {
    setAvatars((prev) => prev.map((avatar) => (avatar.id === updatedAvatar.id ? updatedAvatar : avatar)))
  }

  const filteredAvatars = avatars.filter(
    (avatar) =>
      avatar.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (avatar.level_required_name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
  )

  return (
    <AppLayout user={auth.user}>
      <div className='container mx-auto p-6'>
        <Head title='Gestión de Avatares' />

        <div className='mb-6 flex items-center justify-between'>
          <h1 className='text-2xl font-bold'>Gestión de Avatares</h1>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className='mr-2 h-4 w-4' />
            Nuevo Avatar
          </Button>
        </div>

        <div className='mb-6'>
          <div className='relative'>
            <Search className='absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400' />
            <Input
              type='text'
              placeholder='Buscar avatares...'
              className='pl-10'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className='rounded-md border'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className='text-center'>Nombre</TableHead>
                <TableHead className='text-center'>Nivel Requerido</TableHead>
                <TableHead className='text-center'>Puntos</TableHead>
                <TableHead className='text-center'>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAvatars.length > 0 ? (
                filteredAvatars.map((avatar) => (
                  <TableRow key={avatar.id}>
                    <TableCell className='text-center font-medium'>{avatar.name}</TableCell>
                    <TableCell className='text-center'>Nivel {avatar.level_required_name || avatar.level_required}</TableCell>
                    <TableCell className='text-center'>{avatar.price} pts</TableCell>
                    <TableCell className='text-center'>
                      <div className='flex justify-center space-x-2'>
                        <Button
                          variant='ghost'
                          size='icon'
                          onClick={() => {
                            const handleEditClick = (avatar: Avatar) => {
                              console.log('Setting selected avatar:', avatar)
                              setSelectedAvatar(avatar)
                              setIsEditModalOpen(true)
                            }
                            handleEditClick(avatar)
                          }}
                        >
                          <Edit className='h-4 w-4' />
                          <span className='sr-only'>Editar</span>
                        </Button>
                        <Button variant='ghost' size='icon' onClick={() => handleDelete(avatar.id)}>
                          <Trash2 className='h-4 w-4 text-red-500' />
                          <span className='sr-only'>Eliminar</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className='h-24 text-center'>
                    {searchTerm ? 'No se encontraron avatares que coincidan con la búsqueda' : 'No hay avatares disponibles'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Create Avatar Modal */}
        <CreateAvatarModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} onSuccess={handleCreateSuccess} />

        {/* Edit Avatar Modal */}
        {selectedAvatar && (
          <>
            {console.log('Rendering EditAvatarModal with avatar:', selectedAvatar)}
            <EditAvatarModal
              key={`edit-modal-${selectedAvatar.id}`}
              isOpen={isEditModalOpen}
              onClose={() => {
                console.log('Closing edit modal')
                setIsEditModalOpen(false)
                setSelectedAvatar(null)
              }}
              avatar={selectedAvatar}
              onSuccess={handleUpdateSuccess}
            />
          </>
        )}
      </div>
    </AppLayout>
  )
}
