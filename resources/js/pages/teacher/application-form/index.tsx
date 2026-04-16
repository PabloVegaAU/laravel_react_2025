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
import { useTranslations } from '@/lib/translator'
import { getBadgeColor } from '@/lib/ui/variants'
import { cn } from '@/lib/utils'
import { ApplicationForm } from '@/types/application-form'
import { BreadcrumbItem, TypedColumnDef } from '@/types/core'
import { PaginatedResponse, ResourcePageProps } from '@/types/core/api-types'
import { Head, Link, router, usePage } from '@inertiajs/react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

type PageProps = Omit<ResourcePageProps<ApplicationForm>, 'data'> & {
  applicationForms: PaginatedResponse<ApplicationForm>
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
  {
    title: 'Inicio',
    href: '/teacher/dashboard'
  },
  {
    title: 'Fichas de Aplicación',
    href: '/teacher/application-forms'
  }
]

export default function ApplicationForms({ applicationForms, filters: initialFilters = {} }: PageProps) {
  const { t } = useTranslations()
  const { url } = usePage()
  const [filters, setFilters] = useState({
    search: initialFilters?.search || '',
    status: initialFilters?.status || '',
    registration_status: initialFilters?.registration_status || '',
    area: initialFilters?.area || '',
    competency: initialFilters?.competency || '',
    start_date: initialFilters?.start_date ? new Date(initialFilters.start_date) : null,
    end_date: initialFilters?.end_date ? new Date(initialFilters.end_date) : null
  })

  const handleFilterChange = (name: string, value: any) => {
    setFilters((prev) => ({ ...prev, [name]: value }))
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
      start_date: null,
      end_date: null
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

  const handleStatusChange = (id: number, status: string) => {
    router.put(
      `/teacher/application-forms/${id}/change-status`,
      { status },
      {
        onSuccess: () => toast.success('Estado actualizado correctamente'),
        onError: () => toast.error('Error al actualizar el estado')
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
      cell: (row) => format(new Date(row.getValue() as string), 'dd/MM/yyyy')
    },
    {
      header: 'Fecha de fin',
      accessorKey: 'end_date',
      cell: (row) => format(new Date(row.getValue() as string), 'dd/MM/yyyy')
    },
    {
      header: 'Estado de Registro',
      accessorKey: 'registration_status',
      cell: (row) => {
        const statusValue = row.getValue() as string
        const status = t(statusValue, '')
        const applicationFormId = row.row.original.id
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Badge variant={getBadgeColor(statusValue)} className='cursor-pointer hover:opacity-80'>
                {status}
              </Badge>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleRegistrationStatusChange(applicationFormId, 'active')}>{t('active')}</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleRegistrationStatusChange(applicationFormId, 'inactive')}>{t('inactive')}</DropdownMenuItem>
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
        const applicationForm = row.row.original
        const availableStatuses = getAvailableStatuses(applicationForm.status, applicationForm.registration_status)

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
                <DropdownMenuItem key={statusOption} onClick={() => handleStatusChange(applicationForm.id, statusOption)}>
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
      accessorKey: 'id',
      accessorFn: (row) => row.id,
      cell: (row) => (
        <div className='flex space-x-2'>
          <Link href={`/teacher/application-forms/${row.getValue()}/edit`} className={cn(row.row.original.status === 'canceled' && 'hidden')}>
            <Button variant='outline' size='sm'>
              Editar
            </Button>
          </Link>
          <Link href={`/teacher/application-forms/${row.getValue()}`}>
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
                <SelectItem value='active'>Activo</SelectItem>
                <SelectItem value='finished'>Finalizada</SelectItem>
                <SelectItem value='canceled'>Cancelada</SelectItem>
              </SelectContent>
            </Select>
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
