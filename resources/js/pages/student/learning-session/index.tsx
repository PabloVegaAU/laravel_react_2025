import DataTable from '@/components/organisms/data-table'
import FlashMessages from '@/components/organisms/flash-messages'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import AppLayout from '@/layouts/app-layout'
import { useTranslations } from '@/lib/translator'
import { CurricularArea } from '@/types/academic'
import { BreadcrumbItem } from '@/types/core'
import { PaginatedResponse, ResourcePageProps } from '@/types/core/api-types'
import { type LearningSession } from '@/types/learning-session'
import { Head, Link, router } from '@inertiajs/react'
import { CellContext, ColumnDef } from '@tanstack/react-table'
import { useState } from 'react'

type PageProps = Omit<ResourcePageProps<LearningSession>, 'data'> & {
  learning_sessions: PaginatedResponse<LearningSession>
  curricular_areas: CurricularArea[]
  filters: {
    curricular_area_id: string
    response_status: string
  }
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Sesiones de Aprendizaje',
    href: 'teacher/learning-session'
  }
]

export default function LearningSession({ learning_sessions, curricular_areas, filters }: PageProps) {
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
      header: 'Estado',
      accessorKey: 'application_form',
      cell: (cell: CellContext<LearningSession, any>) => {
        const applicationForms = cell.row.original.application_form
        const response = applicationForms?.responses?.[0]

        // Si no hay formulario de aplicación
        if (!applicationForms) return 'No disponible'

        // Si hay una respuesta, mostramos su estado
        if (response) {
          return t(
            `statuses.${response.status}`,
            {
              pending: 'Pendiente',
              'in progress': 'En progreso',
              submitted: 'Enviado',
              'in review': 'En revisión',
              graded: 'Calificado',
              returned: 'Devuelto',
              late: 'Tardío'
            }[response.status] || response.status
          )
        }
        return t(applicationForms?.status, '')
      }
    },
    {
      header: 'Nota',
      accessorKey: 'application_form',
      cell: (cell: CellContext<LearningSession, any>) => {
        const applicationForms = cell.row.original.application_form
        const response = applicationForms?.responses?.[0]
        return applicationForms?.score_max + ' / ' + (response?.score || 'N/A')
      }
    },
    {
      header: 'Acciones',
      accessorKey: 'id',
      cell: ({ row }: CellContext<LearningSession, unknown>) => {
        const applicationForm = row.original.application_form
        const response = applicationForm?.responses?.[0]
        const now = new Date()
        const startDate = new Date(applicationForm?.start_date || '')
        const endDate = new Date(applicationForm?.end_date || '')
        const isAvailable = (applicationForm?.responses?.length || 0) > 0
        const isOutDate = now > endDate
        const canTakeTest = (!response || response.status === 'pending' || response.status === 'in progress') && !isOutDate

        return (
          <div className='flex space-x-2'>
            {isAvailable &&
              (canTakeTest ? (
                <Link
                  href={`/student/application-form-responses/${applicationForm?.responses[0].id}/edit`}
                  className='inline-flex items-center rounded-md border border-transparent bg-blue-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none'
                >
                  {response ? 'Continuar prueba' : 'Comenzar prueba'}
                </Link>
              ) : (
                <Link
                  href={`/student/application-form-responses/${applicationForm?.responses[0].id}`}
                  className='inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none'
                >
                  Ver prueba
                </Link>
              ))}

            {response && startDate && (
              <Link
                href={`/student/learning-sessions/${applicationForm?.learning_session_id}`}
                className='inline-flex items-center rounded-md border border-transparent bg-blue-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none'
              >
                Calificaciones
              </Link>
            )}
          </div>
        )
      }
    }
  ]

  const [localFilters, setLocalFilters] = useState({
    curricular_area_id: filters.curricular_area_id || '0', // Default to '0' (Todos) if no filter is set
    response_status: filters.response_status || ''
  })

  const handleFilterChange = (name: string, value: string) => {
    const newFilters = {
      ...filters,
      [name]: value
    }

    setLocalFilters(newFilters)

    router.get(route('student.learning-sessions.index'), newFilters, {
      preserveState: true,
      preserveScroll: true,
      replace: true
    })
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('session_learning.title', 'Sesiones de Aprendizaje')} />
      <FlashMessages />

      <div className='flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4'>
        <div className='flex min-h-11 flex-col justify-end gap-4 sm:flex-row sm:items-center'>
          {/* MOSTRAR DOCENTE */}
          {localFilters.curricular_area_id !== '0' &&
            (() => {
              const selectedArea = curricular_areas.find((a) => a.id.toString() === localFilters.curricular_area_id)
              const teacher = selectedArea?.cycles?.[0]?.teacher_classroom_curricular_area_cycles?.[0]?.teacher

              return teacher?.user?.profile ? (
                <div className='dark:bg-sidebar min-w-0 flex-1 rounded-xl bg-white p-2 text-right sm:text-left'>
                  <p className='truncate text-lg text-gray-600'>
                    <span className='font-medium'>Docente:</span>{' '}
                    {[teacher.user.profile.first_name, teacher.user.profile.last_name].filter(Boolean).join(' ')}
                  </p>
                </div>
              ) : null
            })()}

          {/* SELECT DE AREAS CURRICULARES */}
          <div className='dark:bg-sidebar-border w-full rounded-lg bg-white sm:w-64'>
            <Select value={localFilters.curricular_area_id} onValueChange={(value) => handleFilterChange('curricular_area_id', value)}>
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='Seleccionar área curricular' />
              </SelectTrigger>
              <SelectContent>
                {curricular_areas.map((area) => {
                  const showColor = area.id.toString() !== '0' && area.color
                  return (
                    <SelectItem key={area.id} value={area.id.toString()}>
                      <div className='flex items-center gap-2'>
                        {showColor && <span className='h-3 w-3 rounded-full' style={{ backgroundColor: area.color }} aria-hidden='true' />}
                        <span className='truncate'>{area.name}</span>
                      </div>
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className='dark:bg-sidebar-border rounded-xl bg-white p-4'>
          <DataTable columns={columns} data={learning_sessions} />
        </div>
      </div>
    </AppLayout>
  )
}
