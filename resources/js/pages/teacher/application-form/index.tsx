import DataTable from '@/components/organisms/data-table'
import FlashMessages from '@/components/organisms/flash-messages'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import AppLayout from '@/layouts/app-layout'
import { tStatus } from '@/lib/status-translation'
import { useTranslations } from '@/lib/translator'
import { getBadgeColor } from '@/lib/ui/variants'
import { cn } from '@/lib/utils'
import { Competency, CurricularArea } from '@/types/academic'
import { ApplicationForm } from '@/types/application-form'
import { BreadcrumbItem, TypedColumnDef } from '@/types/core'
import { PaginatedResponse, ResourcePageProps } from '@/types/core/api-types'
import { Head, Link, router, usePage } from '@inertiajs/react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import React, { useState } from 'react'
import { toast } from 'sonner'

type PageProps = Omit<ResourcePageProps<ApplicationForm>, 'data'> & {
  applicationForms: PaginatedResponse<ApplicationForm>
  filters?: {
    search?: string
    status?: string
    registration_status?: string
    curricular_area_id?: string
    competency_id?: string
    start_date?: string
    end_date?: string
  }
  curricularAreas: CurricularArea[]
  competencies: Competency[]
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Inicio',
    href: '/teacher/dashboard'
  },
  {
    title: 'Fichas de Aplicación',
    href: '/teacher/application-forms'
  }
]

export default function ApplicationForms({ applicationForms, filters: initialFilters = {}, curricularAreas, competencies }: PageProps) {
  const { t } = useTranslations()
  const { url } = usePage()
  const [filters, setFilters] = useState({
    search: initialFilters?.search || '',
    status: initialFilters?.status || '',
    registration_status: initialFilters?.registration_status || 'active',
    curricular_area_id: initialFilters?.curricular_area_id || '',
    competency_id: initialFilters?.competency_id || '',
    start_date: initialFilters?.start_date ? new Date(initialFilters.start_date) : null,
    end_date: initialFilters?.end_date ? new Date(initialFilters.end_date) : null
  })

  const [competenciesByCurricularArea, setCompetenciesByCurricularArea] = useState<Record<string, Competency[]>>({})

  // Agrupar competencias por área curricular para filtrado en el select
  React.useEffect(() => {
    // Obtener IDs únicos de áreas curriculares usando la relación curricular_area_cycle
    const grouped = competencies.reduce<Record<string, Competency[]>>((acc, competency) => {
      const areaId = competency.curricular_area_cycle?.curricular_area?.id?.toString() || 'other'
      if (!acc[areaId]) acc[areaId] = []
      acc[areaId].push(competency)
      return acc
    }, {})
    setCompetenciesByCurricularArea(grouped)
  }, [competencies])

  const handleFilterChange = (name: string, value: any) => {
    setFilters((prev: typeof filters) => ({ ...prev, [name]: value }))
    // Limpia la competencia seleccionada cuando cambia el área curricular
    if (name === 'curricular_area_id') {
      setFilters((prev) => ({ ...prev, competency_id: '' }))
    }
  }

  const applyFilters = (e: React.FormEvent) => {
    e.preventDefault()
    const params: Record<string, string> = {}

    if (filters.search) params.search = filters.search
    if (filters.status) params.status = filters.status
    if (filters.registration_status) params.registration_status = filters.registration_status
    if (filters.curricular_area_id) params.curricular_area_id = filters.curricular_area_id
    if (filters.competency_id) params.competency_id = filters.competency_id
    if (filters.start_date) params.start_date = format(filters.start_date, 'yyyy-MM-dd')
    if (filters.end_date) params.end_date = format(filters.end_date, 'yyyy-MM-dd')

    router.get(url.split('?')[0], params, {
      preserveState: true,
      preserveScroll: true
    })
  }

  const resetFilters = () => {
    setFilters({
      search: '',
      status: '',
      registration_status: 'active',
      curricular_area_id: '',
      competency_id: '',
      start_date: null,
      end_date: null
    })
    router.get(
      url.split('?')[0],
      { registration_status: 'active' },
      {
        preserveState: true,
        preserveScroll: true
      }
    )
  }

  const handleRegistrationStatusChange = (id: number, registrationStatus: string) => {
    router.put(
      `/teacher/application-forms/${id}/change-registration-status`,
      { registration_status: registrationStatus },
      {
        onSuccess: () => {
          toast.success('Estado de registro actualizado correctamente')
          router.reload()
        },
        onError: () => toast.error('Error al actualizar el estado de registro')
      }
    )
  }

  const getAvailableRegistrationStatuses = (currentStatus: string, currentRegistrationStatus: string, learningSession: any) => {
    const options: string[] = []

    // Solo permitir desactivar (inactive) si el estado es "scheduled"
    if (currentStatus === 'scheduled' && currentRegistrationStatus !== 'inactive') {
      options.push('inactive')
    }

    // Permitir reactivar (active) si NO es "canceled" o si es "canceled" pero está dentro del rango de fechas
    if (currentRegistrationStatus !== 'active') {
      if (currentStatus !== 'canceled') {
        options.push('active')
      } else {
        // Si es canceled, verificar si está dentro del rango de fechas del LearningSession
        if (learningSession) {
          const now = new Date()
          const start = new Date(learningSession.start_date)
          const end = new Date(learningSession.end_date)

          if (now >= start && now <= end) {
            options.push('active')
          }
        }
      }
    }

    return options
  }

  const canEditApplicationForm = (status: string, learningSession: any) => {
    // Siempre editable si es scheduled o active
    if (status === 'scheduled' || status === 'active') {
      return true
    }

    // Editable si es canceled y está antes de la fecha de inicio (usando fechas del LearningSession)
    if (status === 'canceled' && learningSession) {
      const now = new Date()
      const start = new Date(learningSession.start_date)
      return now < start
    }

    // No editable para finished
    return false
  }

  const columns: TypedColumnDef<ApplicationForm>[] = [
    {
      header: 'ID',
      accessorKey: 'id'
    },
    {
      header: 'Nombre',
      accessorKey: 'name'
    },
    {
      header: 'Fecha de inicio',
      accessorKey: 'start_date',
      cell: (row) => format(new Date(row.getValue() as string), 'dd/MM/yyyy HH:mm', { locale: es })
    },
    {
      header: 'Fecha de fin',
      accessorKey: 'end_date',
      cell: (row) => format(new Date(row.getValue() as string), 'dd/MM/yyyy HH:mm', { locale: es })
    },
    {
      header: 'Estado de Registro',
      accessorKey: 'registration_status',
      cell: (row) => {
        const statusValue = row.getValue() as string
        const status = t(statusValue, '')
        const applicationForm = row.row.original
        const availableStatuses = getAvailableRegistrationStatuses(
          applicationForm.status,
          applicationForm.registration_status,
          applicationForm.learning_session
        )

        // No mostrar DropdownMenu si no hay opciones disponibles
        if (availableStatuses.length === 0) {
          return <span>{status}</span>
        }

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <span className='cursor-pointer hover:opacity-80'>{status}</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {availableStatuses.map((statusOption) => (
                <DropdownMenuItem key={statusOption} onClick={() => handleRegistrationStatusChange(applicationForm.id, statusOption)}>
                  {t(statusOption)}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )
      }
    },
    {
      header: 'Estado',
      accessorKey: 'status',
      cell: (row) => {
        const statusValue = row.getValue() as string
        const status = tStatus(statusValue)
        return <Badge variant={getBadgeColor(statusValue)}>{status}</Badge>
      }
    },
    {
      header: 'Acciones',
      accessorKey: 'id',
      accessorFn: (row) => row.id,
      cell: (row) => {
        const applicationForm = row.row.original
        return (
          <div className='flex space-x-2'>
            {canEditApplicationForm(applicationForm.status, applicationForm.learning_session) && (
              <Link href={`/teacher/application-forms/${row.getValue()}/edit`}>
                <Button variant='outline' size='sm'>
                  Editar
                </Button>
              </Link>
            )}
            <Link href={`/teacher/application-forms/${row.getValue()}`}>
              <Button variant='outline' size='sm'>
                Ver
              </Button>
            </Link>
            {applicationForm.status === 'scheduled' && (
              <Button
                variant='destructive'
                size='sm'
                onClick={() => {
                  if (
                    confirm(
                      '¿Estás seguro de anular esta ficha de aplicación? Esta acción desvinculará la ficha de la sesión y no se puede deshacer.'
                    )
                  ) {
                    router.put(route('teacher.application-forms.cancel', applicationForm.id))
                  }
                }}
              >
                Anular
              </Button>
            )}
          </div>
        )
      }
    }
  ]

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('Application Forms')} />
      <FlashMessages />

      <div className='flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4'>
        {/* Filtros */}
        <form onSubmit={applyFilters} className='space-y-4'>
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
            <div>
              <Input placeholder='Buscar...' value={filters.search} onChange={(e) => handleFilterChange('search', e.target.value)} />
            </div>
            <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='Estado' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='scheduled'>Programada</SelectItem>
                <SelectItem value='active'>Vigente</SelectItem>
                <SelectItem value='finished'>Finalizada</SelectItem>
                <SelectItem value='canceled'>Cancelada</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filters.registration_status} onValueChange={(value) => handleFilterChange('registration_status', value)}>
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='Estado de Registro' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='active'>Vigente</SelectItem>
                <SelectItem value='inactive'>Inactivo</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filters.curricular_area_id} onValueChange={(value) => handleFilterChange('curricular_area_id', value)}>
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='Área Curricular' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>Todos</SelectItem>
                {curricularAreas.map((area) => (
                  <SelectItem key={area.id} value={area.id.toString()}>
                    {area.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
            <Select
              value={filters.competency_id}
              onValueChange={(value) => handleFilterChange('competency_id', value)}
              disabled={!filters.curricular_area_id}
            >
              <SelectTrigger className='w-full'>
                <SelectValue placeholder={!filters.curricular_area_id ? 'Seleccione área primero' : 'Competencia'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>Todos</SelectItem>
                {filters.curricular_area_id &&
                  competenciesByCurricularArea[filters.curricular_area_id]?.map((competency) => (
                    <SelectItem key={competency.id} value={competency.id.toString()}>
                      {competency.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant='outline'
                  className={cn('w-full justify-start text-left font-normal', !filters.start_date && 'text-muted-foreground')}
                >
                  <CalendarIcon className='mr-2 h-4 w-4' />
                  {filters.start_date ? format(filters.start_date, 'PPP', { locale: es }) : <span>Fecha de inicio</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-auto p-0' align='start'>
                <Calendar
                  mode='single'
                  selected={filters.start_date || undefined}
                  onSelect={(date) => {
                    if (date) {
                      const startOfDay = new Date(date)
                      startOfDay.setHours(0, 0, 0, 0)
                      handleFilterChange('start_date', startOfDay)
                    }
                  }}
                  autoFocus
                  locale={es}
                />
              </PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant='outline' className={cn('w-full justify-start text-left font-normal', !filters.end_date && 'text-muted-foreground')}>
                  <CalendarIcon className='mr-2 h-4 w-4' />
                  {filters.end_date ? format(filters.end_date, 'PPP', { locale: es }) : <span>Fecha de fin</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-auto p-0' align='start'>
                <Calendar
                  mode='single'
                  selected={filters.end_date || undefined}
                  onSelect={(date) => {
                    if (date) {
                      const endOfDay = new Date(date)
                      endOfDay.setHours(23, 59, 59, 999)
                      handleFilterChange('end_date', endOfDay)
                    }
                  }}
                  autoFocus
                  locale={es}
                />
              </PopoverContent>
            </Popover>
            <div className='flex gap-2'>
              <Button type='submit' className='flex-1'>
                Aplicar filtros
              </Button>
              <Button type='button' variant='outline' onClick={resetFilters} className='flex-1'>
                Limpiar filtros
              </Button>
            </div>
          </div>
        </form>

        {/* DATATABLE */}
        <DataTable columns={columns} data={applicationForms} />
      </div>
    </AppLayout>
  )
}
