import DataTable from '@/components/organisms/data-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import AppLayout from '@/layouts/app-layout'
import { formatDate } from '@/lib/formats'
import { useTranslations } from '@/lib/translator'
import { Classroom, Enrollment } from '@/types/academic'
import { Profile } from '@/types/auth'
import { BreadcrumbItem, PaginatedResponse, ResourcePageProps } from '@/types/core'
import { Head, router } from '@inertiajs/react'
import { ColumnDef } from '@tanstack/react-table'
import { useState } from 'react'

type PageProps = Omit<ResourcePageProps<Enrollment>, 'data'> & {
  enrollments: PaginatedResponse<Enrollment>
  filters: {
    year: number | null
    search: string | null
  }
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Matriculas',
    href: 'admin/enrollment'
  }
]

export default function Enrollments({ enrollments, filters }: PageProps) {
  const { t } = useTranslations()
  /*   const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)*/
  const [localFilters, setLocalFilters] = useState(filters)

  const handleFilterChange = (name: string, value: string) => {
    const newFilters = {
      ...filters,
      [name]: value
    }

    setLocalFilters(newFilters)
  }

  const handleSearch = () => {
    router.get(route('admin.enrollments.index'), localFilters, {
      preserveState: true,
      preserveScroll: true,
      replace: true
    })
  }

  const columns: ColumnDef<Enrollment>[] = [
    {
      header: 'ID',
      accessorKey: 'id'
    },
    {
      header: 'Estudiante',
      accessorKey: 'student.profile',
      cell: ({ cell }) => {
        const profile = cell.getValue() as Profile
        return (
          <div className='flex items-center gap-2'>
            <p>
              {profile.first_name} {profile.last_name} {profile.second_last_name}
            </p>
          </div>
        )
      }
    },
    {
      header: 'Clase',
      accessorKey: 'classroom',
      cell: ({ cell }) => {
        const classroom = cell.getValue() as Classroom
        return (
          <p>
            {t(classroom.grade)} {classroom.section} {t(classroom.level)}
          </p>
        )
      }
    },
    {
      header: 'Año',
      accessorKey: 'academic_year'
    },
    {
      header: 'Fecha de matricula',
      accessorKey: 'enrollment_date',
      cell({ cell }) {
        return <p>{formatDate(cell.getValue() as string)}</p>
      }
    }
  ]

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title='Matriculas' />

      <div className='flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4'>
        {/* <CreateEnrollmentDialog isOpen={isCreateModalOpen} onOpenChange={setIsCreateModalOpen} /> */}

        {/* Filter */}
        <div className='flex items-center gap-4'>
          <div>
            <Label>Año</Label>
            <Input
              type='number'
              placeholder='Año'
              value={localFilters.year?.toString()}
              onChange={(e) => handleFilterChange('year', e.target.value)}
            />
          </div>

          <div>
            <Label>Buscar</Label>
            <Input type='text' placeholder='Buscar' value={localFilters.search} onChange={(e) => handleFilterChange('search', e.target.value)} />
          </div>

          <Button variant='outline-info' onClick={() => handleFilterChange('search', '')}>
            Limpiar
          </Button>

          <Button variant='info' onClick={handleSearch}>
            Buscar
          </Button>
        </div>

        <DataTable columns={columns} data={enrollments} />
      </div>
    </AppLayout>
  )
}
