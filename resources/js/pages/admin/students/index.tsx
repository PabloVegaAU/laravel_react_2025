import DataTable from '@/components/organisms/data-table'
import FlashMessages from '@/components/organisms/flash-messages'
import AppLayout from '@/layouts/app-layout'
import { Profile } from '@/types/auth'
import { BreadcrumbItem, PaginatedResponse, ResourcePageProps } from '@/types/core'
import { User } from '@/types/user'
import { Head } from '@inertiajs/react'
import { ColumnDef } from '@tanstack/react-table'
import { useState } from 'react'
import { CreateStudentDialog } from './components/form-create'
import { EditStudentDialog } from './components/form-edit'

type PageProps = Omit<ResourcePageProps<User>, 'data'> & {
  users: PaginatedResponse<User>
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Estudiantes',
    href: 'admin/students'
  }
]

export default function Students({ users }: PageProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const columns: ColumnDef<User>[] = [
    {
      header: 'ID',
      accessorKey: 'id'
    },
    {
      header: 'Usuario',
      accessorKey: 'name'
    },
    {
      header: 'Nombres y apellidos',
      accessorKey: 'profile',
      cell(row) {
        const profile = row.cell.getValue() as Profile
        return profile.first_name + ' ' + profile.last_name + ' ' + profile.second_last_name
      }
    },
    {
      header: 'Acciones',
      accessorKey: 'id',
      cell(row) {
        const userId = row.cell.getValue() as number
        return (
          <div className='flex gap-2' id={userId.toString()}>
            <EditStudentDialog userId={userId} />
          </div>
        )
      }
    }
  ]

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title='Docentes' />
      <FlashMessages />

      <div className='flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4'>
        <CreateStudentDialog isOpen={isCreateModalOpen} onOpenChange={setIsCreateModalOpen} />

        <DataTable columns={columns} data={users} />
      </div>
    </AppLayout>
  )
}
