import DataTable from '@/components/organisms/data-table'
import AppLayout from '@/layouts/app-layout'
import { Profile } from '@/types/auth'
import { BreadcrumbItem, PaginatedResponse, ResourcePageProps } from '@/types/core'
import { User } from '@/types/user'
import { Head } from '@inertiajs/react'
import { ColumnDef } from '@tanstack/react-table'
import { CreateTeacherDialog } from './components/form-create'
import { useState } from 'react'

type PageProps = Omit<ResourcePageProps<User>, 'data'> & {
  users: PaginatedResponse<User>
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Docentes',
    href: 'admin/teachers'
  }
]

export default function Teachers({ users }: PageProps) {
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
    }
  ]

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title='Docentes' />
      <CreateTeacherDialog isOpen={isCreateModalOpen} onOpenChange={setIsCreateModalOpen} />

      <div className='flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4'>
        <DataTable columns={columns} data={users} />
      </div>
    </AppLayout>
  )
}
