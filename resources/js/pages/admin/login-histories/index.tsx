import DataTable from '@/components/organisms/data-table'
import FlashMessages from '@/components/organisms/flash-messages'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import AppLayout from '@/layouts/app-layout'
import type { LoginHistoryFilters, LoginHistoryStatistics, UserLoginHistory } from '@/types/user/login-history'
import type { User } from '@/types/user/user'
import { Head, router } from '@inertiajs/react'
import { ColumnDef } from '@tanstack/react-table'
import { AlertTriangle, Eye, Filter, ShieldAlert, ShieldCheck } from 'lucide-react'
import { useState } from 'react'

type PageProps = {
  login_histories: {
    data: UserLoginHistory[]
    current_page: number
    last_page: number
    total: number
    per_page: number
    from: number | null
    to: number | null
    prev_page_url: string | null
    next_page_url: string | null
  }
  users: { id: number; name: string; full_name: string }[]
  risk_levels: { value: string; label: string }[]
  status_options: { value: string; label: string }[]
  statistics: LoginHistoryStatistics
  filters: LoginHistoryFilters
}

export default function LoginHistories({ login_histories, users, risk_levels, status_options, statistics, filters }: PageProps) {
  const [localFilters, setLocalFilters] = useState<LoginHistoryFilters>(filters)
  const [showFilters, setShowFilters] = useState(true)
  const [selectedDetail, setSelectedDetail] = useState<UserLoginHistory | null>(null)

  const handleFilterChange = (key: keyof LoginHistoryFilters, value: any) => {
    const newFilters = { ...localFilters, [key]: value }
    setLocalFilters(newFilters)

    router.get(route('admin.login-histories.index'), newFilters, {
      preserveState: true,
      preserveScroll: true,
      only: ['login_histories']
    })
  }

  const clearFilters = () => {
    setLocalFilters({})
    router.get(
      route('admin.login-histories.index'),
      {},
      {
        preserveState: true,
        preserveScroll: true
      }
    )
  }

  const getRiskBadge = (level: string | null) => {
    switch (level) {
      case 'critico':
        return (
          <Badge variant='destructive' className='flex items-center gap-1'>
            <ShieldAlert className='h-3 w-3' />
            Crítico
          </Badge>
        )
      case 'sospechoso':
        return (
          <Badge variant='warning' className='flex items-center gap-1 bg-yellow-500 text-white'>
            <AlertTriangle className='h-3 w-3' />
            Sospechoso
          </Badge>
        )
      case 'normal':
      default:
        return (
          <Badge variant='default' className='flex items-center gap-1 bg-green-500 text-white'>
            <ShieldCheck className='h-3 w-3' />
            Normal
          </Badge>
        )
    }
  }

  const getStatusBadge = (status: string) => {
    return status === 'success' ? (
      <Badge variant='outline' className='border-green-500 text-green-600'>
        Exitoso
      </Badge>
    ) : (
      <Badge variant='outline' className='border-red-500 text-red-600'>
        Fallido
      </Badge>
    )
  }

  const columns: ColumnDef<UserLoginHistory>[] = [
    {
      header: 'ID',
      accessorKey: 'id',
      cell: ({ row }) => <span className='text-muted-foreground text-xs'>#{row.original.id}</span>
    },
    {
      header: 'Usuario',
      accessorKey: 'user',
      cell: ({ row }) => {
        const user = row.original.user as User
        const profile = user?.profile
        const fullName = profile ? `${profile.first_name} ${profile.last_name}` : user?.name || 'N/A'
        return (
          <div>
            <div className='font-medium'>{fullName}</div>
            <div className='text-muted-foreground text-xs'>{user?.email}</div>
          </div>
        )
      }
    },
    {
      header: 'IP Address',
      accessorKey: 'ip_address',
      cell: ({ row }) => <code className='bg-muted rounded px-1 text-xs'>{row.original.ip_address}</code>
    },
    {
      header: 'Nivel de Riesgo',
      accessorKey: 'risk_level',
      cell: ({ row }) => (
        <div className='flex items-center gap-2'>
          {getRiskBadge(row.original.risk_level)}
          {row.original.risk_score !== null && <span className='text-muted-foreground text-xs'>({row.original.risk_score})</span>}
        </div>
      )
    },
    {
      header: 'Estado',
      accessorKey: 'status',
      cell: ({ row }) => getStatusBadge(row.original.status)
    },
    {
      header: 'Sospechoso',
      accessorKey: 'is_suspicious',
      cell: ({ row }) => (row.original.is_suspicious ? <Badge variant='destructive'>Sí</Badge> : <Badge variant='outline'>No</Badge>)
    },
    {
      header: 'Fecha/Hora',
      accessorKey: 'login_at',
      cell: ({ row }) => {
        const date = new Date(row.original.login_at)
        return (
          <div className='text-sm'>
            <div>{date.toLocaleDateString('es-ES')}</div>
            <div className='text-muted-foreground text-xs'>{date.toLocaleTimeString('es-ES')}</div>
          </div>
        )
      }
    },
    {
      header: 'Dispositivo',
      accessorKey: 'device_type',
      cell: ({ row }) => (
        <div className='text-sm'>
          <div>{row.original.device_type || 'N/A'}</div>
          <div className='text-muted-foreground text-xs'>{row.original.browser || 'N/A'}</div>
        </div>
      )
    },
    {
      header: 'Ubicación',
      accessorKey: 'city',
      cell: ({ row }) => (
        <div className='text-sm'>
          <div>{row.original.city || 'N/A'}</div>
          <div className='text-muted-foreground text-xs'>{row.original.country || 'N/A'}</div>
        </div>
      )
    },
    {
      header: 'GPS',
      accessorKey: 'latitude',
      cell: ({ row }) =>
        row.original.latitude && row.original.longitude ? (
          <code className='bg-muted rounded px-1 text-xs'>
            {row.original.latitude.toFixed(4)}, {row.original.longitude.toFixed(4)}
          </code>
        ) : (
          <span className='text-muted-foreground text-xs'>N/A</span>
        )
    },
    {
      header: 'Acciones',
      id: 'actions',
      cell: ({ row }) => (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant='outline' size='sm' onClick={() => setSelectedDetail(row.original)}>
              <Eye className='mr-1 h-4 w-4' />
              Ver
            </Button>
          </DialogTrigger>
          <DialogContent className='max-w-2xl'>
            <DialogHeader>
              <DialogTitle>Detalle de Login #{row.original.id}</DialogTitle>
              <DialogDescription>Información completa del registro de sesión</DialogDescription>
            </DialogHeader>
            <div className='mt-4 space-y-4'>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='text-muted-foreground text-xs'>Usuario</label>
                  <p className='font-medium'>
                    {row.original.user?.profile
                      ? `${row.original.user.profile.first_name} ${row.original.user.profile.last_name}`
                      : row.original.user?.name}
                  </p>
                </div>
                <div>
                  <label className='text-muted-foreground text-xs'>Email</label>
                  <p className='font-medium'>{row.original.user?.email}</p>
                </div>
                <div>
                  <label className='text-muted-foreground text-xs'>IP Address</label>
                  <p className='font-medium'>{row.original.ip_address}</p>
                </div>
                <div>
                  <label className='text-muted-foreground text-xs'>User Agent</label>
                  <p className='text-xs break-all'>{row.original.user_agent}</p>
                </div>
                <div>
                  <label className='text-muted-foreground text-xs'>Nivel de Riesgo</label>
                  <div className='mt-1'>{getRiskBadge(row.original.risk_level)}</div>
                </div>
                <div>
                  <label className='text-muted-foreground text-xs'>Score de Riesgo</label>
                  <p className='font-medium'>{row.original.risk_score ?? 'N/A'}</p>
                </div>
                <div>
                  <label className='text-muted-foreground text-xs'>Coordenadas GPS</label>
                  <p className='font-medium'>
                    {row.original.latitude && row.original.longitude ? `${row.original.latitude}, ${row.original.longitude}` : 'N/A'}
                  </p>
                </div>
                <div>
                  <label className='text-muted-foreground text-xs'>Ubicación</label>
                  <p className='font-medium'>
                    {row.original.city}, {row.original.country}
                  </p>
                </div>
              </div>

              {row.original.risk_factors && (
                <div>
                  <label className='text-muted-foreground text-xs'>Factores de Riesgo</label>
                  <pre className='bg-muted mt-1 max-h-48 overflow-auto rounded p-2 text-xs'>{JSON.stringify(row.original.risk_factors, null, 2)}</pre>
                </div>
              )}

              {row.original.failure_reason && (
                <div>
                  <label className='text-muted-foreground text-xs'>Razón de Fallo</label>
                  <p className='text-destructive font-medium'>{row.original.failure_reason}</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )
    }
  ]

  return (
    <AppLayout breadcrumbs={[{ title: 'Historial de Sesiones', href: '/admin/login-histories' }]}>
      <Head title='Auditoría de Sesiones' />
      <FlashMessages />

      <div className='flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4'>
        {/* Statistics Cards */}
        <div className='grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6'>
          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-muted-foreground text-xs'>Hoy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{statistics.total_today}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-destructive text-xs'>Sospechosos Hoy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold text-red-500'>{statistics.suspicious_today}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-xs text-orange-500'>Críticos Hoy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold text-orange-600'>{statistics.critical_risk_today}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-muted-foreground text-xs'>Esta Semana</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{statistics.total_week}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-muted-foreground text-xs'>Este Mes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{statistics.total_month}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-muted-foreground text-xs'>Distribución Riesgo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-xs'>
                <span className='text-green-600'>N: {statistics.risk_distribution.normal}</span>{' '}
                <span className='text-yellow-600'>S: {statistics.risk_distribution.sospechoso}</span>{' '}
                <span className='text-red-600'>C: {statistics.risk_distribution.critico}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className='flex items-center justify-between'>
          <Button variant='outline' onClick={() => setShowFilters(!showFilters)}>
            <Filter className='mr-2 h-4 w-4' />
            Filtros
          </Button>
          <Button variant='ghost' onClick={clearFilters}>
            Limpiar filtros
          </Button>
        </div>

        {showFilters && (
          <div className='bg-muted/50 grid grid-cols-1 gap-4 rounded-lg p-4 md:grid-cols-3 lg:grid-cols-4'>
            <div>
              <label className='mb-1 block text-sm font-medium'>Usuario</label>
              <Select
                value={localFilters.user_id || 'all'}
                onValueChange={(value) => handleFilterChange('user_id', value === 'all' ? undefined : value)}
              >
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='Todos los usuarios' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>Todos</SelectItem>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={String(user.id)}>
                      {user.full_name} ({user.name})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className='mb-1 block text-sm font-medium'>Nivel de Riesgo</label>
              <Select
                value={localFilters.risk_level || 'all'}
                onValueChange={(value) => handleFilterChange('risk_level', value === 'all' ? undefined : value)}
              >
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='Todos los niveles' />
                </SelectTrigger>
                <SelectContent>
                  {risk_levels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className='mb-1 block text-sm font-medium'>Estado</label>
              <Select
                value={localFilters.status || 'all'}
                onValueChange={(value) => handleFilterChange('status', value === 'all' ? undefined : value)}
              >
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='Todos los estados' />
                </SelectTrigger>
                <SelectContent>
                  {status_options.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className='mb-1 block text-sm font-medium'>IP Address</label>
              <Input
                className='w-full'
                placeholder='Buscar IP...'
                value={localFilters.ip_address || ''}
                onChange={(e) => handleFilterChange('ip_address', e.target.value)}
              />
            </div>

            <div className='flex items-end'>
              <label className='flex items-center gap-2'>
                <Checkbox
                  checked={localFilters.is_suspicious || false}
                  onCheckedChange={(checked) => handleFilterChange('is_suspicious', checked === true)}
                />
                <span className='text-sm'>Solo sospechosos</span>
              </label>
            </div>

            <div>
              <label className='mb-1 block text-sm font-medium'>Desde</label>
              <Input
                className='w-full'
                type='date'
                value={localFilters.date_from || ''}
                onChange={(e) => handleFilterChange('date_from', e.target.value)}
              />
            </div>

            <div>
              <label className='mb-1 block text-sm font-medium'>Hasta</label>
              <Input
                className='w-full'
                type='date'
                value={localFilters.date_to || ''}
                onChange={(e) => handleFilterChange('date_to', e.target.value)}
              />
            </div>
          </div>
        )}

        {/* DataTable */}
        <DataTable columns={columns} data={login_histories as any} />
      </div>
    </AppLayout>
  )
}
