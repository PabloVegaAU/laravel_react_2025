import DataTable from '@/components/organisms/data-table'
import FlashMessages from '@/components/organisms/flash-messages'
import { Button } from '@/components/ui/button'
import AppLayout from '@/layouts/app-layout'
import { Profile } from '@/types/auth'
import { BreadcrumbItem, PaginatedResponse, ResourcePageProps } from '@/types/core'
import { Student } from '@/types/user'
import { Head } from '@inertiajs/react'
import { ColumnDef } from '@tanstack/react-table'
import { PencilIcon } from 'lucide-react'
import { useCallback, useState } from 'react'
import { CreateStudentDialog } from './components/form-create'
import { EditStudentDialog } from './components/form-edit'

type PageProps = Omit<ResourcePageProps<Student>, 'data'> & {
  students: PaginatedResponse<Student>
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Estudiantes',
    href: 'admin/students'
  }
]

export default function Students({ students }: PageProps) {
  console.log(students)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingStudentId, setEditingStudentId] = useState<number | null>(null)

  // Memoizar la función de edición
  const handleEditClick = useCallback((studentId: number) => {
    setEditingStudentId(studentId)
  }, [])

  // Resetear el estado cuando se cierra el diálogo
  const handleDialogOpenChange = useCallback((open: boolean) => {
    if (!open) {
      setEditingStudentId(null)
    }
  }, [])

  const columns: ColumnDef<Student>[] = [
    {
      header: 'ID',
      accessorKey: 'user_id'
    },
    {
      header: 'Usuario',
      accessorKey: 'user.name'
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
      accessorKey: 'user_id',
      cell(row) {
        const userId = row.cell.getValue() as number
        const isEditingThisStudent = editingStudentId === userId

        return (
          <div className='flex gap-2'>
            <Button variant={isEditingThisStudent ? 'info' : 'outline-info'} onClick={() => handleEditClick(userId)}>
              <PencilIcon className='size-4' />
            </Button>
          </div>
        )
      }
    }
  ]

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title='Docentes' />
      <FlashMessages />
      <div className='flex flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4'>
        <CreateStudentDialog isOpen={isCreateModalOpen} onOpenChange={setIsCreateModalOpen} />

        <DataTable columns={columns} data={students} />
      </div>
      {editingStudentId && <EditStudentDialog isOpen={!!editingStudentId} onOpenChange={handleDialogOpenChange} studentId={editingStudentId} />}{' '}
    </AppLayout>
  )
}
