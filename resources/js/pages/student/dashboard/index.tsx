import { Label } from '@/components/ui/label'
import AppLayout from '@/layouts/app-layout'
import { useTranslations } from '@/lib/translator'
import { cn } from '@/lib/utils'
import { useUserStore } from '@/store/useUserStore'
import { Enrollment } from '@/types/academic'
import { ApplicationFormResponse } from '@/types/application-form'
import { BreadcrumbItem } from '@/types/core'
import { Head, Link } from '@inertiajs/react'
import { useEffect } from 'react'

type PageProps = {
  application_form_responses: ApplicationFormResponse[]
  enrollment: Enrollment
  avatar: string
  background: string
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: 'student/dashboard'
  }
]

export default function Dashboard({ application_form_responses, enrollment, avatar, background }: PageProps) {
  const { t } = useTranslations()
  const { setCurrentDashboardRole, setAvatar, setBackground, setUser } = useUserStore()

  useEffect(() => {
    setCurrentDashboardRole('/student/dashboard')
    setAvatar(avatar)
    setBackground(background)
  }, [])

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title='Dashboard' />
      <div className='relative flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4 pb-96'>
        {/* Application Forms| */}
        <div className='flex flex-col gap-4'>
          <div className='dark:bg-sidebar rounded-xl bg-white p-2'>
            <h2 className='text-xl font-semibold'>{t('Pending Application Forms')}</h2>
          </div>

          <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
            {application_form_responses.map((application_form_response) => (
              <Link
                key={application_form_response.id}
                className={cn(
                  'border-sidebar-border/70 dark:border-sidebar-border',
                  'overflow-hidden rounded-xl border p-2',
                  'dark:bg-sidebar bg-white',
                  'hover:bg-sidebar-border dark:hover:bg-sidebar-border'
                )}
                href={`/student/application-form-responses/${application_form_response.id}/edit`}
              >
                <h3 className='flex flex-col gap-1'>
                  <span className='truncate font-semibold'>{application_form_response.application_form.name}</span>
                  <span className='text-sm text-gray-500 dark:text-gray-400'>
                    {
                      application_form_response.application_form.learning_session?.teacher_classroom_curricular_area_cycle?.curricular_area_cycle
                        ?.curricular_area?.name
                    }
                  </span>
                </h3>
              </Link>
            ))}
          </div>
        </div>

        {/* Enrollment */}
        <div className='fixed right-4 bottom-4'>
          <div className='border-sidebar-border/70 dark:border-sidebar-border dark:bg-sidebar flex flex-col gap-4 rounded-xl border bg-white p-4'>
            <div className='space-y-1'>
              <Label className='text-base'>{t('Level')}</Label>
              <p className='text-muted-foreground text-sm'>{t(enrollment?.classroom?.level)}</p>
            </div>
            <div className='space-y-1'>
              <Label className='text-base'>{t('Grade')}</Label>
              <p className='text-muted-foreground text-sm'>{t(enrollment?.classroom?.grade)}</p>
            </div>
            <div className='space-y-1'>
              <Label className='text-base'>{t('Section')}</Label>
              <p className='text-muted-foreground text-sm'>{enrollment?.classroom?.section}</p>
            </div>
            <div className='space-y-1'>
              <Label className='text-base'>{t('School Year')}</Label>
              <p className='text-muted-foreground text-sm'>{enrollment.academic_year}</p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
