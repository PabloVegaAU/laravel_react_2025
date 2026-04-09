import DataTable from '@/components/organisms/data-table'
import FlashMessages from '@/components/organisms/flash-messages'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import AppLayout from '@/layouts/app-layout'
import { formatDate } from '@/lib/formats'
import { useTranslations } from '@/lib/translator'
import { getBadgeColor } from '@/lib/ui/variants'
import { cn } from '@/lib/utils'
import { BreadcrumbItem } from '@/types/core'
import { PaginatedResponse, ResourcePageProps } from '@/types/core/api-types'
import { LearningSession } from '@/types/learning-session'
import { Head, Link, router } from '@inertiajs/react'
import { ColumnDef } from '@tanstack/react-table'
import { MoreHorizontalIcon } from 'lucide-react'

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
      header: 'ID',
      accessorKey: 'id'
    },
    {
      header: 'Area Curricular',
      accessorKey: 'teacher_classroom_curricular_area_cycle.curricular_area_cycle.curricular_area.name'
    },
    {
      header: 'Competencia',
      accessorKey: 'competency.name',
      cell: (row) => row.getValue()
    },
    {
      header: 'Tema',
      accessorKey: 'name'
    },
    {
      header: 'Fecha de Aplicación',
      accessorKey: 'application_date',
      cell: (row) => formatDate(row.getValue() as string)
    },
    {
      header: 'Estado',
      accessorKey: 'status',
      cell: (row) => {
        const statusValue = row.getValue() as string
        const status = t(statusValue, '')
        return <Badge variant={getBadgeColor(statusValue)}>{status}</Badge>
      }
    },
    {
      header: 'Acciones',
      id: 'actions',
      cell: ({ row }) => {
        const learningSession = row.original
        const statusVariant = learningSession.status === 'active' ? 'destructive' : 'default'
        const statusText = learningSession.status === 'active' ? 'Desactivar' : 'Activar'
        const statusAction = learningSession.status === 'active' ? 'inactive' : 'active'

        return (
          <div className='flex items-center space-x-2'>
            <Button className={cn('rounded-lg p-1 font-bold', learningSession.application_form ? 'bg-green-500' : 'bg-red-500')}>
              {learningSession.application_form ? 'Con ficha' : 'Sin ficha'}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='outline' size='icon' aria-label='More Options'>
                  <MoreHorizontalIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end' className='w-40'>
                <DropdownMenuGroup>
                  <Link href={`/teacher/learning-sessions/${learningSession.id}`}>
                    <DropdownMenuItem>Ver</DropdownMenuItem>
                  </Link>
                  <Link href={`/teacher/learning-sessions/${learningSession.id}/table-calification`}>
                    <DropdownMenuItem>Ver tabla de puntuaciones</DropdownMenuItem>
                  </Link>
                  <Link href={`/teacher/learning-sessions/${learningSession.id}/edit`}>
                    <DropdownMenuItem>Editar</DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem variant={statusVariant} onClick={() => handleStatusChange(learningSession.id, statusAction)}>
                    {statusText}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link
                      href={`/teacher/application-form-responses?learning_session_id=${learningSession.id}`}
                      title='Ver respuestas de esta sesión'
                    >
                      Revisar Ficha
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
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
