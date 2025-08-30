import DataTable from '@/components/organisms/data-table'
import FlashMessages from '@/components/organisms/flash-messages'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import AppLayout from '@/layouts/app-layout'
import { Achievement } from '@/types/achievement'
import { BreadcrumbItem, PaginatedResponse, ResourcePageProps } from '@/types/core'
import { Head, router } from '@inertiajs/react'
import { ColumnDef } from '@tanstack/react-table'
import { Pencil } from 'lucide-react'
import { useState } from 'react'
import { CreateAchievementDialog } from './components/form-create'
import { EditAchievementDialog } from './components/form-edit'

type PageProps = Omit<ResourcePageProps<Achievement>, 'data'> & {
  achievements: PaginatedResponse<Achievement>
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Inicio',
    href: '/admin/dashboard'
  },
  {
    title: 'Logros',
    href: '/admin/achievements'
  }
]

export default function Achievements({ achievements, filters }: PageProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [localFilters, setLocalFilters] = useState(filters)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedAchievementId, setSelectedAchievementId] = useState<number | null>(null)

  const handleFilterChange = (name: string, value: string) => {
    const newFilters = {
      ...filters,
      [name]: value
    }

    setLocalFilters(newFilters)
  }

  const handleSearch = () => {
    router.get(route('admin.achievements.index'), localFilters, {
      preserveState: true,
      preserveScroll: true,
      replace: true
    })
  }

  const columns: ColumnDef<Achievement>[] = [
    {
      header: 'ID',
      accessorKey: 'id'
    },
    {
      header: 'Nombre',
      accessorKey: 'name'
    },
    {
      header: 'Descripción',
      accessorKey: 'description'
    },
    {
      header: 'Acciones',
      accessorKey: 'id',
      cell: (row) => {
        const achievementId = row.getValue() as number
        return (
          <div className='flex gap-2'>
            <Button
              variant='ghost'
              size='icon'
              onClick={() => {
                setSelectedAchievementId(achievementId)
                setIsEditModalOpen(true)
              }}
            >
              <Pencil className='h-4 w-4' />
            </Button>
          </div>
        )
      }
    }
  ]
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title='Logros' />
      <FlashMessages />

      <div className='relative flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4'>
        <div className='flex flex-col space-y-4'>
          <div className='flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between'>
            <h1 className='text-2xl font-semibold'>Logros</h1>
            <CreateAchievementDialog isOpen={isCreateModalOpen} onOpenChange={setIsCreateModalOpen} />
          </div>

          <div className='flex gap-2'>
            <div className='space-y-2'>
              <Label htmlFor='search'>Buscar</Label>
              <Input
                id='search'
                placeholder='Buscar logros...'
                value={localFilters.search || ''}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>

            <div>
              <Button className='mt-4' onClick={handleSearch}>
                Buscar
              </Button>
            </div>
          </div>

          <div className='rounded-lg border'>
            <DataTable columns={columns} data={achievements} />
          </div>
        </div>
      </div>

      {selectedAchievementId && (
        <EditAchievementDialog isOpen={isEditModalOpen} onOpenChange={setIsEditModalOpen} achievementId={selectedAchievementId} />
      )}
    </AppLayout>
  )
}
