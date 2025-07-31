import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import AppLayout from '@/layouts/app-layout'
import { useTranslations } from '@/lib/translator'
import { getContainerColorVariant } from '@/lib/ui/variants'
import { cn } from '@/lib/utils'
import { useUserStore } from '@/store/useUserStore'
import { TeacherClassroomCurricularAreaCycle } from '@/types/academic'
import { BreadcrumbItem } from '@/types/core'
import { Head } from '@inertiajs/react'
import { useEffect } from 'react'

interface Props {
  teacher_classroom_curricular_area_cycles: TeacherClassroomCurricularAreaCycle[]
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: 'teacher/dashboard'
  }
]

export default function Dashboard({ teacher_classroom_curricular_area_cycles }: Props) {
  const { t } = useTranslations()
  const { setCurrentDashboardRole } = useUserStore()

  useEffect(() => {
    setCurrentDashboardRole('/teacher/dashboard')
  }, [])

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title='Dashboard' />
      <div className='flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4'>
        <div className='flex flex-col gap-4'>
          <h2 className='text-2xl font-bold tracking-tight'>Áreas Currículares</h2>
          <div className='grid auto-rows-min gap-4 md:grid-cols-3'>
            {teacher_classroom_curricular_area_cycles.map((item) => {
              const color = item.curricular_area_cycle?.curricular_area?.color || 'gray'
              const variant = getContainerColorVariant(color)

              return (
                <div key={item.id} className={cn('flex items-center justify-center rounded-xl border p-4', variant)}>
                  <h2 className='text-lg font-semibold tracking-tight'>{item.curricular_area_cycle?.curricular_area?.name}</h2>
                </div>
              )
            })}
          </div>
        </div>

        <div className='flex flex-col gap-4'>
          <h2 className='text-2xl font-bold tracking-tight'>Aulas</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>N°</TableHead>
                <TableHead>Grado</TableHead>
                <TableHead>Sección</TableHead>
                <TableHead>Nivel</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teacher_classroom_curricular_area_cycles.map((item, index) => {
                return (
                  <TableRow key={item.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{t(item?.classroom?.grade)}</TableCell>
                    <TableCell>{item?.classroom?.section}</TableCell>
                    <TableCell>{t(item?.classroom?.level)}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </AppLayout>
  )
}
