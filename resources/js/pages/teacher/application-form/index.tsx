import DataTable from '@/components/organisms/data-table'
import FlashMessages from '@/components/organisms/flash-messages'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
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

type PageProps = Omit<ResourcePageProps<ApplicationForm>, 'data'> & {
  applicationForms: PaginatedResponse<ApplicationForm>
  filters?: {
    search?: string
    status?: string
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
      accessorKey: 'id',
      accessorFn: (row) => row.id,
      cell: (row) => (
        <div className='flex space-x-2'>
          <Link href={`/teacher/application-forms/${row.getValue()}/edit`}>
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
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
            <div>
              <Input placeholder='Buscar...' value={filters.search} onChange={(e) => handleFilterChange('search', e.target.value)} />
            </div>
            <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
              <SelectTrigger>
                <SelectValue placeholder='Estado' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='draft'>Borrador</SelectItem>
                <SelectItem value='active'>Activo</SelectItem>
                <SelectItem value='inactive'>Inactivo</SelectItem>
                <SelectItem value='archived'>Archivado</SelectItem>
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
          </div>
          <div className='flex space-x-2'>
            <Button type='submit' variant='default'>
              Aplicar filtros
            </Button>
            <Button type='button' variant='outline' onClick={resetFilters}>
              Limpiar filtros
            </Button>
          </div>
        </form>

        {/* DATATABLE */}
        <DataTable columns={columns} data={applicationForms} />
      </div>
    </AppLayout>
  )
}
