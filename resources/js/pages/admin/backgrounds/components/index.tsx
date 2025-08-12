import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import AppLayout from '@/layouts/app-layout'
import { Head } from '@inertiajs/react'
import { Edit, Plus, Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import { CreateBackgroundModal } from './create-background-modal'
import { EditBackgroundModal } from './edit-background-modal'

type Background = {
  id: number
  name: string
  image: string
  activo: boolean
  level_required: number
  points_store: number
  level_required_name?: string
}

export default function BackgroundsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedBackground, setSelectedBackground] = useState<Background | null>(null)
  const [backgrounds, setBackgrounds] = useState<Background[]>([])

  // Fetch backgrounds
  useEffect(() => {
    fetchBackgrounds()
  }, [])

  const fetchBackgrounds = async () => {
    try {
      const response = await fetch('/api/backgroundslist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
        }
      })
      const data = await response.json()
      if (data.success) {
        setBackgrounds(data.data)
      } else {
        console.error('Error en datos:', data.message)
      }
    } catch (error) {
      console.error('Error al obtener fondos:', error)
    }
  }


  const filteredBackgrounds = backgrounds.filter(
    (background) =>
      background.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      background.level_required_name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  /* const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro de que deseas eliminar este fondo?')) {
      try {
        await router.delete(`/admin/backgrounds/${id}`, {
          onSuccess: () => {
            setBackgrounds(backgrounds.filter((bg) => bg.id !== id))
          }
        })
      } catch (error) {
        console.error('Error deleting background:', error)
      }
    }
  } */

  return (
    <AppLayout>
      <div className='container mx-auto p-6'>
        <Head title='Gestión de Fondos' />

        <div className='mb-6 flex items-center justify-between'>
          <h1 className='text-2xl font-bold text-gray-900 dark:text-gray-100'>Gestión de Fondos</h1>
          <div className='flex items-center space-x-4'>
            <div className='relative w-64'>
              <Search className='absolute top-2.5 left-2.5 h-4 w-4 text-gray-500 dark:text-gray-400' />
              <Input
                type='search'
                placeholder='Buscar fondo...'
                className='pl-8'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className='mr-2 h-4 w-4' />
              Crear Fondo
            </Button>
          </div>
        </div>

        <div className='dark:border-sidebar-border dark:bg-sidebar rounded-lg border border-gray-200 bg-white'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>N°</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Nivel Requerido</TableHead>
                <TableHead>Costo</TableHead>
                <TableHead className='text-center'>Acción</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBackgrounds.map((background, index) => (
                <TableRow key={background.id}>
                  <TableCell className='dark:text-sidebar-foreground/70 text-gray-700'>{index + 1}</TableCell>
                  <TableCell className='font-medium'>{background.name}</TableCell>
                  <TableCell>
                    <span className='rounded-full bg-green-100 px-2 py-1 text-xs text-green-800 dark:bg-green-900/30 dark:text-green-400'>
                      Activo
                    </span>
                  </TableCell>
                  <TableCell className='dark:text-sidebar-foreground/70 text-gray-700'>Nivel {background.level_required}</TableCell>
                  <TableCell className='dark:text-sidebar-foreground/70 text-gray-700'>{background.points_store} pts</TableCell>
                  <TableCell className='flex justify-center space-x-2'>
                    <Button
                      variant='ghost'
                      size='icon'
                      onClick={() => {
                        setSelectedBackground(background)
                        setIsEditModalOpen(true)
                      }}
                    >
                      <Edit className='h-4 w-4' />
                    </Button>
                    {/* <Button
                      variant='ghost'
                      size='icon'
                      className='text-destructive hover:text-destructive'
                      onClick={() => handleDelete(background.id)}
                    >
                      <Trash2 className='h-4 w-4' />
                    </Button> */}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <CreateBackgroundModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={(newBackground) => {
          fetchBackgrounds()
          setIsCreateModalOpen(false)
        }}
      />

      {selectedBackground && (
        <EditBackgroundModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false)
            setSelectedBackground(null)
          }}
          background={{
            ...selectedBackground,
            level_name: `Nivel ${selectedBackground.level_required}`, // Add level_name
            level_required: {
              id: selectedBackground.level_required,
              level: selectedBackground.level_required,
              name: `Nivel ${selectedBackground.level_required}`
            }
          }}
          onSuccess={(updatedBackground) => {
            setBackgrounds((prev) =>
              prev.map((bg) =>
                bg.id === updatedBackground.id
                  ? {
                      ...updatedBackground,
                      activo: updatedBackground.activo,
                      level_required: (() => {
                        const level = updatedBackground.level_required
                        return typeof level === 'object' && level !== null ? (level as { level: number }).level : (level as number)
                      })(),
                      points_store: Number(updatedBackground.points_store)
                    }
                  : bg
              )
            )
            fetchBackgrounds()
            setIsEditModalOpen(false)
            setSelectedBackground(null)
          }}
        />
      )}
    </AppLayout>
  )
}
