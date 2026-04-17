import DataTable from '@/components/organisms/data-table'
import FlashMessages from '@/components/organisms/flash-messages'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import AppLayout from '@/layouts/app-layout'
import { formatDateTime } from '@/lib/formats'
import { useTranslations } from '@/lib/translator'
import type { ApplicationFormResponse } from '@/types/application-form/form/response/application-form-response'
import { BreadcrumbItem } from '@/types/core'
import type { PaginatedResponse, ResourcePageProps } from '@/types/core/api-types'
import type { LearningSession } from '@/types/learning-session'
import { Head, Link, router } from '@inertiajs/react'
import { ColumnDef } from '@tanstack/react-table'
import { useState } from 'react'

type PageProps = Omit<ResourcePageProps<ApplicationFormResponse>, 'data'> & {
  application_form_responses: PaginatedResponse<ApplicationFormResponse>
  learning_session?: LearningSession | null
  filters: {
    search?: string
    learning_session_id?: number
    sort_field?: string
    sort_direction?: 'asc' | 'desc'
  }
}

export default function ApplicationFormResponse({ application_form_responses, learning_session, filters = {} }: PageProps) {
  const { t } = useTranslations()
  const [localFilters, setLocalFilters] = useState(filters)

  const handleSearch = () => {
    router.get(route('teacher.application-form-responses.index'), localFilters, {
      preserveState: true,
      preserveScroll: true,
      replace: true
    })
  }

  // Etiqueta de estado
  const StatusBadge = ({ status }: { status: string }) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      pending: { label: 'Pendiente', className: 'bg-yellow-100 text-yellow-800' },
      'in progress': { label: 'En progreso', className: 'bg-blue-100 text-blue-800' },
      submitted: { label: 'Enviado', className: 'bg-green-100 text-green-800' },
      'in review': { label: 'En revisión', className: 'bg-purple-100 text-purple-800' },
      graded: { label: 'Calificado', className: 'bg-indigo-100 text-indigo-800' },
      finalized: { label: 'Finalizado', className: 'bg-gray-100 text-gray-800' }
    }

    const statusInfo = statusMap[status] || { label: status, className: 'bg-gray-100 text-gray-800' }

    return <span className={`inline-flex rounded-full px-2 text-xs leading-5 font-semibold ${statusInfo.className}`}>{statusInfo.label}</span>
  }

  const columns: ColumnDef<ApplicationFormResponse>[] = [
    {
      accessorKey: 'student',
      header: 'Estudiante',
      cell: ({ row }) => {
        const response = row.original
        return (
          <div className='font-medium'>
            {response.student?.user?.profile?.first_name +
              ' ' +
              response.student?.user?.profile?.last_name +
              ' ' +
              response.student?.user?.profile?.second_last_name || 'Estudiante no encontrado'}
          </div>
        )
      }
    },
    {
      accessorKey: 'status',
      header: 'Estado',
      cell: ({ row }) => <StatusBadge status={row.original.status} />
    },
    {
      accessorKey: 'score',
      header: 'Puntaje',
      cell: ({ row }) => {
        const score = row.original.score
        return <div className='text-sm text-gray-900'>{score !== null ? `${score}` : 'N/A'}</div>
      }
    },
    {
      accessorKey: 'submitted_at',
      header: 'Enviado',
      cell: ({ row }) => {
        const submittedAt = row.original.submitted_at
        return <div className='text-sm text-gray-500'>{submittedAt ? formatDateTime(submittedAt) : 'No enviado'}</div>
      }
    },
    {
      accessorKey: 'id',
      header: 'Acciones',
      cell: ({ row }) => {
        const { status, id, submitted_at } = row.original
        const maxTimeToEdit = 24 * 7 * 60 * 60 * 1000 // 1 week in milliseconds
        const currentTime = new Date().getTime()
        const timeSinceSubmission = currentTime - new Date(submitted_at || '').getTime()
        const canEdit = timeSinceSubmission < maxTimeToEdit

        const actionMap = {
          submitted: [{ label: 'Revisar', route: 'edit', color: 'indigo' }],
          'in review': [{ label: 'Calificar', route: 'edit', color: 'indigo' }],
          graded: [{ label: 'Ver', route: 'show', color: 'indigo' }, ...(canEdit ? [{ label: 'Editar', route: 'edit', color: 'gray' }] : [])]
        }

        const action = actionMap[status as keyof typeof actionMap]

        return action ? (
          <div className='flex space-x-2'>
            {action.map((a) => (
              <Link
                key={a.route}
                href={route(`teacher.application-form-responses.${a.route}`, id)}
                className={`text-${a.color}-600 hover:text-${a.color}-900`}
              >
                {a.label}
              </Link>
            ))}
          </div>
        ) : null
      }
    }
  ]

  const breadcrumbs: BreadcrumbItem[] = [
    { title: t('Dashboard'), href: '/teacher/dashboard' },
    { title: t('Application Form Responses'), href: '/teacher/application-form-responses' }
  ]

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('Application Form Responses')} />
      <FlashMessages />

      <div className='flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4'>
        {learning_session && (
          <div className='space-y-4'>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              {/* Sesion de aprendizaje */}
              <div>
                <Label>Sesión de aprendizaje</Label>
                <div className='mt-1 rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm'>{learning_session.name}</div>
              </div>
              {/* Ficha de aplicacion */}
              <div>
                <Label>Ficha de aplicación</Label>
                <div className='mt-1 rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm'>
                  {learning_session.application_form?.name || 'No asignada'}
                </div>
              </div>
            </div>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
              {/* Competencia */}
              <div>
                <Label>Competencia</Label>
                <div className='mt-1 rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm'>
                  {learning_session?.competency?.name || 'No asignada'}
                </div>
              </div>
              {/* Capacidad */}
              <div>
                <Label>Capacidad(es)</Label>
                <div className='mt-1 rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm'>
                  {learning_session?.capabilities?.map((capacity) => capacity.name).join(', ') || 'No asignada'}
                </div>
              </div>
              {/* Aula, area curricular */}
              <div>
                <Label>Aula, área curricular</Label>
                <div className='mt-1 rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm'>
                  {t(learning_session.teacher_classroom_curricular_area_cycle?.classroom?.level)}{' '}
                  {t(learning_session.teacher_classroom_curricular_area_cycle?.classroom?.grade)}{' '}
                  {learning_session.teacher_classroom_curricular_area_cycle?.classroom?.section} -{' '}
                  {learning_session.teacher_classroom_curricular_area_cycle?.curricular_area_cycle?.curricular_area?.name}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* FILTROS */}
        <div className='grid grid-cols-1 items-center gap-4 md:grid-cols-2'>
          {/* CAMPO STUDENT NAME */}
          <div>
            <Label className='mb-1 block text-sm font-medium text-gray-700'>Nombre del Estudiante</Label>
            <Input
              type='text'
              placeholder='Buscar por nombre'
              value={localFilters.search || ''}
              onChange={(e) => setLocalFilters((prev) => ({ ...prev, search: e.target.value }))}
            />
          </div>

          {/* BUTTONS */}
          <div className='flex justify-end space-x-2'>
            <Button
              type='button'
              onClick={() =>
                setLocalFilters((prev) => ({
                  ...prev,
                  search: undefined,
                  learning_session_id: filters.learning_session_id
                }))
              }
              variant='outline'
            >
              Limpiar
            </Button>
            <Button type='button' onClick={handleSearch}>
              Buscar
            </Button>
          </div>
        </div>

        {/* TABLA */}
        <DataTable columns={columns} data={application_form_responses} />
      </div>
    </AppLayout>
  )
}
