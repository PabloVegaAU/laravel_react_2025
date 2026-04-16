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
import { formatDate } from '@/lib/formats'
import { useTranslations } from '@/lib/translator'
import { getBadgeColor } from '@/lib/ui/variants'
import { cn } from '@/lib/utils'
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
    area?: string
    competency?: string
    start_date?: string
    end_date?: string
  }
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Inicio', href: '/teacher/dashboard' },
  {
    title: 'Sesiones de Aprendizaje',
    href: 'teacher/learning-session'
  }
]

export default function LearningSessionIndex({ learningSessions, filters: initialFilters = {} }: PageProps) {
  const { t } = useTranslations()
  const { url } = usePage()
  const [filters, setFilters] = useState({
    search: initialFilters?.search || '',
    status: initialFilters?.status || '',
    registration_status: initialFilters?.registration_status || '',
    area: initialFilters?.area || '',
    competency: initialFilters?.competency || '',
    start_date: initialFilters?.start_date ? new Date(initialFilters.start_date) : undefined,
    end_date: initialFilters?.end_date ? new Date(initialFilters.end_date) : undefined
  })

  const handleFilterChange = (name: string, value: string | Date | null | undefined) => {
    setFilters((prev: typeof filters) => ({ ...prev, [name]: value }))
  }

  const applyFilters = (e: React.FormEvent) => {
    e.preventDefault()
    const params: Record<string, string> = {}

    if (filters.search) params.search = filters.search
    if (filters.status) params.status = filters.status
    if (filters.registration_status) params.registration_status = filters.registration_status
    if (filters.area) params.area = filters.area
    if (filters.competency) params.competency = filters.competency
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
      registration_status: '',
      area: '',
      competency: '',
      start_date: undefined,
      end_date: undefined
    })
    router.get(
      url.split('?')[0],
      {},
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

  const getAvailableStatuses = (currentStatus: string, currentRegistrationStatus: string) => {
    const allStatuses = ['scheduled', 'active', 'finished', 'canceled']

    // No permitir cambiar de estado una vez cancelado
    if (currentStatus === 'canceled') {
      return [] // No mostrar ninguna opción
    }

    // No permitir retroceder de active a scheduled
    if (currentStatus === 'active') {
      return allStatuses.filter((s) => s !== 'scheduled')
    }

    // No permitir reactivar desde finished
    if (currentStatus === 'finished') {
      return allStatuses.filter((s) => s !== 'active')
    }

    // No permitir reactivar si registration_status es inactive
    if (currentRegistrationStatus === 'inactive') {
      return allStatuses.filter((s) => s !== 'active' && s !== 'scheduled')
    }

    return allStatuses
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
      cell: (row) => formatDate(row.getValue() as string)
    },
    {
      header: 'Estado de Registro',
      accessorKey: 'registration_status',
      cell: (row) => {
        const statusValue = row.getValue() as string
        const status = t(statusValue, '')
        const learningSessionId = row.row.original.id
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Badge variant={getBadgeColor(statusValue)} className='cursor-pointer hover:opacity-80'>
                {status}
              </Badge>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleRegistrationStatusChange(learningSessionId, 'active')}>{t('active')}</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleRegistrationStatusChange(learningSessionId, 'inactive')}>{t('inactive')}</DropdownMenuItem>
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
        const status = t(statusValue, '')
        const learningSession = row.row.original
        const availableStatuses = getAvailableStatuses(learningSession.status, learningSession.registration_status)

        // No mostrar DropdownMenu si no hay opciones disponibles
        if (availableStatuses.length === 0) {
          return <Badge variant={getBadgeColor(statusValue)}>{status}</Badge>
        }

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Badge variant={getBadgeColor(statusValue)} className='cursor-pointer hover:opacity-80'>
                {status}
              </Badge>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {availableStatuses.map((statusOption) => (
                <DropdownMenuItem key={statusOption} onClick={() => handleStatusChange(learningSession.id, statusOption)}>
                  {t(statusOption)}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )
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
        onSuccess: () => toast.success('Estado actualizado correctamente'),
        onError: () => toast.error('Error al actualizar el estado'),
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
                  <SelectItem value='active'>Activo</SelectItem>
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
            <Input placeholder='Área curricular' value={filters.area} onChange={(e) => handleFilterChange('area', e.target.value)} />
          </div>
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
            <Input placeholder='Competencia' value={filters.competency} onChange={(e) => handleFilterChange('competency', e.target.value)} />
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
                <Calendar mode='single' selected={filters.start_date} onSelect={(date) => handleFilterChange('start_date', date)} initialFocus />
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
                <Calendar mode='single' selected={filters.end_date} onSelect={(date) => handleFilterChange('end_date', date)} initialFocus />
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
