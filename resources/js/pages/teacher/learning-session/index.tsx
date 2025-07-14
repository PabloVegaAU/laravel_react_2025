import DataTable from '@/components/organisms/data-table'
import FlashMessages from '@/components/organisms/flash-messages'
import { Button } from '@/components/ui/button'
import AppLayout from '@/layouts/app-layout'
import { useTranslations } from '@/lib/translator'
import { BreadcrumbItem } from '@/types/core'
import { PaginatedResponse, ResourcePageProps } from '@/types/core/api-types'
import { type LearningSession } from '@/types/learning-session'
import { Head, Link } from '@inertiajs/react'
import { ColumnDef } from '@tanstack/react-table'

type PageProps = Omit<ResourcePageProps<LearningSession>, 'data'> & {
  learningSessions: PaginatedResponse<LearningSession>
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Sesiones de Aprendizaje',
    href: 'teacher/learning-session'
  }
]

export default function LearningSession({ learningSessions }: PageProps) {
  const { t } = useTranslations()

  const columns: ColumnDef<LearningSession>[] = [
    {
      header: 'ID',
      accessorKey: 'id'
    },
    {
      header: 'Nombre',
      accessorKey: 'name'
    },
    {
      header: 'Acciones',
      accessorKey: 'id',
      cell: (row) => (
        <div className='flex space-x-2'>
          <Link href={`/teacher/learning-sessions/${row.getValue()}/edit`}>
            <Button variant='info'>Editar</Button>
          </Link>
          <Link href={`/teacher/learning-sessions/${row.getValue()}`}>
            <Button variant='outline' size='sm'>
              Ver
            </Button>
          </Link>
        </div>
      )
    }
  ]

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('session_learning.title', 'Sesiones de Aprendizaje')} />
      <FlashMessages />

      <div className='flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4'>
        <Link href='/teacher/learning-sessions/create'>
          <Button>Crear Sesión de Aprendizaje</Button>
        </Link>

        <DataTable columns={columns} data={learningSessions} />
      </div>
    </AppLayout>
  )
}
