import DataTable from '@/components/organisms/data-table'
import FlashMessages from '@/components/organisms/flash-messages'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import AppLayout from '@/layouts/app-layout'
import { tStatus } from '@/lib/status-translation'
import { useTranslations } from '@/lib/translator'
import { getBadgeColor } from '@/lib/ui/variants'
import { cn } from '@/lib/utils'
import { Competency, CurricularArea } from '@/types/academic'
import { BreadcrumbItem } from '@/types/core'
import { PaginatedResponse, ResourcePageProps } from '@/types/core/api-types'
import { LearningSession } from '@/types/learning-session'
import { Head, Link, router, usePage } from '@inertiajs/react'
import { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { CalendarIcon, MoreHorizontalIcon } from 'lucide-react'
import React, { useState } from 'react'
import { toast } from 'sonner'

type PageProps = Omit<ResourcePageProps<LearningSession>, 'data'> & {
  learningSessions: PaginatedResponse<LearningSession>
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
  { title: 'Inicio', href: '/teacher/dashboard' },
  {
    title: 'Sesiones de Aprendizaje',
    href: 'teacher/learning-session'
  }
]

export default function LearningSessionIndex({ learningSessions, filters: initialFilters = {}, curricularAreas, competencies }: PageProps) {
  const { t } = useTranslations()
  const { url } = usePage()
  const [filters, setFilters] = useState({
    search: initialFilters?.search || '',
    status: initialFilters?.status || '',
    registration_status: initialFilters?.registration_status || 'active',
    curricular_area_id: initialFilters?.curricular_area_id || '',
    competency_id: initialFilters?.competency_id || '',
    start_date: initialFilters?.start_date ? new Date(initialFilters.start_date) : undefined,
    end_date: initialFilters?.end_date ? new Date(initialFilters.end_date) : undefined
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

  const handleFilterChange = (name: string, value: string | Date | null | undefined) => {
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
      start_date: undefined,
      end_date: undefined
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
      `/teacher/learning-sessions/${id}/change-registration-status`,
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

  const getAvailableRegistrationStatuses = (currentStatus: string, currentRegistrationStatus: string, startDate: string, endDate: string) => {
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
        // Si es canceled, verificar si está dentro del rango de fechas
        const now = new Date()
        const start = new Date(startDate)
        const end = new Date(endDate)

        if (now >= start && now <= end) {
          options.push('active')
        }
      }
    }

    return options
  }

  const canEditLearningSession = (status: string, startDate: string) => {
    // Siempre editable si es scheduled o active
    if (status === 'scheduled' || status === 'active') {
      return true
    }

    // Editable si es canceled y está antes de la fecha de inicio
    if (status === 'canceled') {
      const now = new Date()
      const start = new Date(startDate)
      return now < start
    }

    // No editable para finished
    return false
  }

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
      header: 'Fecha de Inicio',
      accessorKey: 'start_date',
      cell: (row) => format(new Date(row.getValue() as string), 'dd/MM/yyyy HH:mm', { locale: es })
    },
    {
      header: 'Fecha de Fin',
      accessorKey: 'end_date',
      cell: (row) => format(new Date(row.getValue() as string), 'dd/MM/yyyy HH:mm', { locale: es })
    },
    {
      header: 'Estado de Registro',
      accessorKey: 'registration_status',
      cell: (row) => {
        const statusValue = row.getValue() as string
        const status = t(statusValue, '')
        const learningSession = row.row.original
        const availableStatuses = getAvailableRegistrationStatuses(
          learningSession.status,
          learningSession.registration_status,
          learningSession.start_date,
          learningSession.end_date
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
                <DropdownMenuItem key={statusOption} onClick={() => handleRegistrationStatusChange(learningSession.id, statusOption)}>
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
      id: 'actions',
      cell: ({ row }) => {
        const learningSession = row.original
        const statusVariant = learningSession.status === 'active' ? 'destructive' : 'default'
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
                  {learningSession.status !== 'scheduled' && (
                    <>
                      <Link href={`/teacher/learning-sessions/${learningSession.id}/table-calification`}>
                        <DropdownMenuItem>Ver tabla de puntuaciones</DropdownMenuItem>
                      </Link>
                      <DropdownMenuItem>
                        <Link
                          href={`/teacher/application-form-responses?learning_session_id=${learningSession.id}`}
                          title='Ver respuestas de esta sesión'
                        >
                          Revisar Ficha
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  {canEditLearningSession(learningSession.status, learningSession.start_date) && learningSession.status !== 'finished' && (
                    <Link href={`/teacher/learning-sessions/${learningSession.id}/edit`}>
                      <DropdownMenuItem>Editar</DropdownMenuItem>
                    </Link>
                  )}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      }
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

        <form onSubmit={applyFilters} className='space-y-4'>
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
            <div>
              <Input placeholder='Buscar...' value={filters.search} onChange={(e) => handleFilterChange('search', e.target.value)} />
            </div>
            <div>
              <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='Estado de Sesión' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='scheduled'>Programada</SelectItem>
                  <SelectItem value='active'>Vigente</SelectItem>
                  <SelectItem value='finished'>Finalizada</SelectItem>
                  <SelectItem value='canceled'>Cancelada</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Select value={filters.registration_status} onValueChange={(value) => handleFilterChange('registration_status', value)}>
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='Estado de Registro' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='active'>Activo</SelectItem>
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
                <Calendar mode='single' selected={filters.start_date} onSelect={(date) => handleFilterChange('start_date', date)} />
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
                <Calendar mode='single' selected={filters.end_date} onSelect={(date) => handleFilterChange('end_date', date)} />
              </PopoverContent>
            </Popover>
            <div className='flex gap-2'>
              <Button type='submit' className='flex-1'>
                Filtrar
              </Button>
              <Button type='button' variant='outline' onClick={resetFilters} className='flex-1'>
                Limpiar
              </Button>
            </div>
          </div>
        </form>

        <DataTable columns={columns} data={learningSessions} />
      </div>
    </AppLayout>
  )
}
