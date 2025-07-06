import FlashMessages from '@/components/organisms/flash-messages'
import Table from '@/components/organisms/table'
import { Button } from '@/components/ui/button'
import AppLayout from '@/layouts/app-layout'
import { ApplicationForm } from '@/types/application-form'
import { BreadcrumbItem } from '@/types/core'
import { PaginatedResponse, ResourcePageProps } from '@/types/core/api-types'
import { Column } from '@/types/core/ui-types'
import { Head, Link } from '@inertiajs/react'

type PageProps = Omit<ResourcePageProps<ApplicationForm>, 'data'> & {
  applicationForms: PaginatedResponse<ApplicationForm>
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Fichas de Aplicación',
    href: 'teacher/application-forms'
  }
]

export default function ApplicationsForm({ applicationForms }: PageProps) {
  const columns: Column<ApplicationForm>[] = [
    {
      header: 'ID',
      accessorKey: 'id'
    },
    {
      header: 'Acciones',
      accessorKey: 'actions',
      renderCell: () => <></>
    }
  ]

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title='Fichas de Aplicación' />
      <FlashMessages />

      <div className='flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4'>
        <Link href='/teacher/application-forms/create'>
          <Button>Crear Ficha de Aplicación</Button>
        </Link>
        <Table columns={columns} data={applicationForms} />
      </div>
    </AppLayout>
  )
}
