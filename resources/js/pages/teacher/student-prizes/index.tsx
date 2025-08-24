import DataTable from '@/components/organisms/data-table'
import FlashMessages from '@/components/organisms/flash-messages'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import AppLayout from '@/layouts/app-layout'
import { formatDateTime } from '@/lib/formats'
import { Profile } from '@/types/auth'
import { BreadcrumbItem } from '@/types/core'
import { PaginatedResponse, ResourcePageProps } from '@/types/core/api-types'
import { StudentPrize } from '@/types/user'
import { Head, router } from '@inertiajs/react'
import { ColumnDef } from '@tanstack/react-table'
import { useState } from 'react'

type PageProps = Omit<ResourcePageProps<StudentPrize>, 'data'> & {
  student_prizes: PaginatedResponse<StudentPrize>
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Inicio',
    href: '/teacher/dashboard'
  },
  {
    title: 'Premios',
    href: 'teacher/student-prizes'
  }
]

export default function StudentPrizes({ student_prizes, filters }: PageProps) {
  const [localFilters, setLocalFilters] = useState(filters)

  const handleSearch = () => {
    router.get(route('teacher.student-prizes.index'), localFilters, {
      preserveState: true,
      preserveScroll: true,
      replace: true
    })
  }

  const handleClaim = (id: number) => {
    router.post(route('teacher.student-prizes.claim', id), {
      preserveState: true,
      preserveScroll: true,
      replace: true
    })
  }

  const columns: ColumnDef<StudentPrize>[] = [
    {
      header: 'ID',
      accessorKey: 'id'
    },
    {
      header: 'Nombres y Apellidos',
      accessorKey: 'student.profile',
      cell: ({ cell }) => {
        const profile = cell.getValue() as Profile
        return profile.first_name + ' ' + profile.last_name + ' ' + profile.second_last_name
      }
    },
    {
      header: 'Premio',
      accessorKey: 'prize.name'
    },
    {
      header: 'Obtenido',
      accessorKey: 'exchange_date',
      cell: (row) => formatDateTime(row.getValue() as string)
    },
    {
      header: 'Acciones',
      accessorKey: 'actions',
      cell: ({ row }) => {
        const studentPrize = row.original as StudentPrize
        return (
          <div className='flex space-x-2' id={studentPrize.id.toString()}>
            <Button
              variant={studentPrize.claimed ? 'default' : 'outline'}
              onClick={() => handleClaim(studentPrize.id)}
              disabled={studentPrize.claimed}
            >
              {studentPrize.claimed ? 'Entregado' : 'Entregar'}
            </Button>
          </div>
        )
      }
    }
  ]

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title='Premios' />
      <FlashMessages />
      <div className='flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4'>
        <div className='flex items-center justify-between gap-4'>
          {/* Buscador */}
          <div className='flex items-center gap-4'>
            <div>
              <Label>Nombres y Apellidos</Label>
              <Input value={localFilters.search} onChange={(e) => setLocalFilters((prev) => ({ ...prev, search: e.target.value }))} />
            </div>

            <Button onClick={handleSearch}>Buscar</Button>
          </div>
        </div>

        <DataTable columns={columns} data={student_prizes} />
      </div>
    </AppLayout>
  )
}
