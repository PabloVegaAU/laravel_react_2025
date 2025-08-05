import DataTable from '@/components/organisms/data-table'
import FlashMessages from '@/components/organisms/flash-messages'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import AppLayout from '@/layouts/app-layout'
import { formatDate } from '@/lib/formats'
import { useTranslations } from '@/lib/translator'
import { cn } from '@/lib/utils'
import { BreadcrumbItem } from '@/types/core'
import { PaginatedResponse, ResourcePageProps } from '@/types/core/api-types'
import { LearningSession } from '@/types/learning-session'
import { Head, Link, router } from '@inertiajs/react'
import { ColumnDef } from '@tanstack/react-table'
import { FileText } from 'lucide-react'

type PageProps = Omit<ResourcePageProps<LearningSession>, 'data'> & {
  learningSessions: PaginatedResponse<LearningSession>
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Inicio', href: '/teacher/dashboard' },
  {
    title: 'Sesiones de Aprendizaje',
    href: 'teacher/learning-session'
  }
]

export default function LearningSessionIndex({ learningSessions }: PageProps) {
  const { t } = useTranslations()

  const columns: ColumnDef<LearningSession>[] = [
    {
      header: 'Tema',
      accessorKey: 'name'
    },
    {
      header: 'Competencia',
      accessorKey: 'competency.name',
      cell: (row) => row.getValue()
    },
    {
      header: 'Estado',
      accessorKey: 'status',
      cell: (row) => {
        const colorStatus = row.getValue() === 'active' ? 'default' : 'destructive'
        return <Badge variant={colorStatus}>{t(row.getValue() as string, '')}</Badge>
      }
    },
    {
      header: 'Fecha de Aplicación',
      accessorKey: 'application_date',
      cell: (row) => formatDate(row.getValue() as string)
    },
    {
      header: 'Acciones',
      id: 'actions',
      cell: ({ row }) => {
        const learningSession = row.original
        return (
          <div className='flex items-center space-x-2'>
            <Link href={`/teacher/application-form-responses?learning_session_id=${learningSession.id}`} title='Ver respuestas de esta sesión'>
              <Button variant='outline' size='sm' className='gap-2'>
                <FileText className='h-4 w-4' />
                <span>Revisar</span>
              </Button>
            </Link>
            <div className={cn('rounded-lg p-1 font-bold', learningSession.application_form ? 'bg-green-500' : 'bg-red-500')}>
              {learningSession.application_form ? 'Con ficha' : 'Sin ficha'}
            </div>
            <Link href={`/teacher/learning-sessions/${learningSession.id}/edit`}>
              <Button variant='info' size='sm'>
                Editar
              </Button>
            </Link>
            {/*  <Link href={`/teacher/learning-sessions/${learningSession.id}`}>
              <Button variant='outline' size='sm'>
                Ver
              </Button>
            </Link> */}
            {learningSession.status === 'active' ? (
              <Button variant='destructive' size='sm' onClick={() => handleStatusChange(learningSession.id, 'inactive')}>
                Desactivar
              </Button>
            ) : (
              <Button variant='default' size='sm' onClick={() => handleStatusChange(learningSession.id, 'active')}>
                Activar
              </Button>
            )}
          </div>
        )
      }
    }
  ]

  const handleStatusChange = (id: number, status: string) => {
    return router.put(
      `/teacher/learning-sessions/${id}/change-status`,
      {
        status
      },
      {
        preserveScroll: true,
        preserveState: true
      }
    )
  }

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
