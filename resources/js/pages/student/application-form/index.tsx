import FlashMessages from '@/components/organisms/flash-messages'
import Table from '@/components/organisms/table'
import { Button } from '@/components/ui/button'
import AppLayout from '@/layouts/app-layout'
import { useTranslations } from '@/lib/translator'
import { ApplicationForm } from '@/types/application-form'
import { BreadcrumbItem } from '@/types/core'
import { PaginatedResponse, ResourcePageProps } from '@/types/core/api-types'
import { Column } from '@/types/core/ui-types'
import { Head } from '@inertiajs/react'
import { format } from 'date-fns'

type PageProps = Omit<ResourcePageProps<ApplicationForm>, 'data'> & {
  applicationForms: PaginatedResponse<ApplicationForm>
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Fichas de Aplicación',
    href: 'student/application-forms'
  }
]

export default function ApplicationsForm({ applicationForms }: PageProps) {
  const { t } = useTranslations()

  const columns: Column<ApplicationForm>[] = [
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
      renderCell(row) {
        return format(row.start_date, 'dd/MM/yyyy')
      }
    },
    {
      header: 'Fecha de fin',
      accessorKey: 'end_date',
      renderCell(row) {
        return format(row.end_date, 'dd/MM/yyyy')
      }
    },
    {
      header: 'Estado',
      accessorKey: 'status',
      renderCell: (row) => {
        const status = String(row.status || '').toLowerCase()
        return t(status, 'status')
      }
    },
    {
      header: 'Acciones',
      accessorKey: 'actions',
      renderCell: () => <Button>Completar</Button>
    }
  ]

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title='Fichas de Aplicación' />
      <FlashMessages />

      <div className='flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4'>
        <Table columns={columns} data={applicationForms} />
      </div>
    </AppLayout>
  )
}
