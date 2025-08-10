import DataTable from '@/components/organisms/data-table'
import FlashMessages from '@/components/organisms/flash-messages'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import AppLayout from '@/layouts/app-layout'
import { formatDate } from '@/lib/formats'
import { useTranslations } from '@/lib/translator'
import type { ApplicationFormResponse } from '@/types/application-form/form/response/application-form-response'
import { BreadcrumbItem } from '@/types/core'
import type { PaginatedResponse, ResourcePageProps } from '@/types/core/api-types'
import { Head, Link, router } from '@inertiajs/react'
import { ColumnDef } from '@tanstack/react-table'
import { useState } from 'react'

type PageProps = Omit<ResourcePageProps<ApplicationFormResponse>, 'data'> & {
  application_form_responses: PaginatedResponse<ApplicationFormResponse>
  filters: {
    search?: string
    learning_session_id?: number
    sort_field?: string
    sort_direction?: 'asc' | 'desc'
  }
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Inicio', href: '/teacher/dashboard' },
  { title: 'Respuestas de Formularios', href: '/teacher/application-form-responses' }
]

export default function ApplicationFormResponse({ application_form_responses, filters = {} }: PageProps) {
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
      returned: { label: 'Devuelto', className: 'bg-pink-100 text-pink-800' },
      late: { label: 'Tardío', className: 'bg-red-100 text-red-800' }
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
      accessorKey: 'learning_session',
      header: 'Sesión de Aprendizaje',
      cell: ({ row }) => {
        const response = row.original
        return response.application_form?.learning_session?.name || 'No asignada'
      }
    },
    {
      accessorKey: 'application_form',
      header: 'Ficha de aplicación',
      cell: ({ row }) => {
        const response = row.original
        return response.application_form?.name || 'Formulario no encontrado'
      }
    },

    {
      accessorKey: 'classroom',
      header: 'Aula',
      cell: ({ row }) => {
        const response = row.original
        const learningSession = response.application_form?.learning_session
        return (
          t(learningSession?.teacher_classroom_curricular_area_cycle?.classroom?.level) +
          ' ' +
          t(learningSession?.teacher_classroom_curricular_area_cycle?.classroom?.grade) +
          ' ' +
          learningSession?.teacher_classroom_curricular_area_cycle?.classroom?.section
        )
      }
    },
    {
      accessorKey: 'curricular_areas',
      header: 'Área Curricular',
      cell: ({ row }) => {
        const response = row.original
        const curricularArea =
          response.application_form?.learning_session?.teacher_classroom_curricular_area_cycle?.curricular_area_cycle?.curricular_area
        return curricularArea?.name || 'No asignada'
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
        return <div className='text-sm text-gray-500'>{submittedAt ? formatDate(submittedAt) : 'No enviado'}</div>
      }
    },
    {
      accessorKey: 'id',
      header: 'Acciones',
      cell: ({ row }) => {
        const { status, id } = row.original
        const actionMap = {
          submitted: { label: 'Revisar', route: 'edit' },
          'in review': { label: 'Calificar', route: 'edit' },
          graded: { label: 'Ver', route: 'show' }
        }

        const action = actionMap[status as keyof typeof actionMap]

        return action ? (
          <div className='flex space-x-2'>
            <Link href={route(`teacher.application-form-responses.${action.route}`, id)} className='text-indigo-600 hover:text-indigo-900'>
              {action.label}
            </Link>
          </div>
        ) : null
      }
    }
  ]

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title='Respuestas de Formularios' />
      <FlashMessages />

      <div className='flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4'>
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
