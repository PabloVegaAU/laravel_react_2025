import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import AppLayout from '@/layouts/app-layout'
import { useTranslations } from '@/lib/translator'
import { cn } from '@/lib/utils'
import { useUserStore } from '@/store/useUserStore'
import { Enrollment } from '@/types/academic'
import { ApplicationFormResponse } from '@/types/application-form'
import { BreadcrumbItem } from '@/types/core'
import { Head, router } from '@inertiajs/react'
import { useEffect, useState } from 'react'

type PageProps = {
  application_form_responses: ApplicationFormResponse[]
  enrollment: Enrollment
  avatar: string
  background: string
}

export default function Dashboard({ application_form_responses, enrollment, avatar, background }: PageProps) {
  const { t } = useTranslations()
  const { setCurrentDashboardRole, setAvatar, setBackground, setUser } = useUserStore()
  const [declaracionDialog, setDeclaracionDialog] = useState<{ open: boolean; responseId: number | null }>({
    open: false,
    responseId: null
  })
  const [isChecked, setIsChecked] = useState(false)

  useEffect(() => {
    setCurrentDashboardRole('/student/dashboard')
    setAvatar(avatar)
    setBackground(background)
  }, [])

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: t('Dashboard'),
      href: '/student/dashboard'
    }
  ]

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('Dashboard')} />
      <div className='relative flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4 pb-96'>
        {/* Application Forms| */}
        <div className='flex flex-col gap-4'>
          <div className='dark:bg-sidebar rounded-xl bg-white p-2'>
            <h2 className='text-xl font-semibold'>{t('Pending Application Forms')}</h2>
          </div>

          <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
            {application_form_responses.map((application_form_response) => (
              <button
                key={application_form_response.id}
                className={cn(
                  'border-sidebar-border/70 dark:border-sidebar-border',
                  'overflow-hidden rounded-xl border p-2',
                  'dark:bg-sidebar bg-white',
                  'hover:bg-sidebar-border dark:hover:bg-sidebar-border',
                  'text-left'
                )}
                onClick={() => setDeclaracionDialog({ open: true, responseId: application_form_response.id })}
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
              </button>
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

      <Dialog
        open={declaracionDialog.open}
        onOpenChange={(open) => {
          setDeclaracionDialog({ open, responseId: null })
          setIsChecked(false)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Declaración de Autenticidad</DialogTitle>
            <DialogDescription className='text-base'>
              Declaro, bajo mi responsabilidad, que desarrollaré la presente evaluación de manera individual y autónoma, sin recibir ayuda de otras
              personas, sin copiar respuestas y sin utilizar materiales externos no autorizados. Asimismo, me comprometo a responder con honestidad,
              integridad y responsabilidad, garantizando que mis respuestas reflejan fielmente mis propios conocimientos y aprendizaje.
            </DialogDescription>
          </DialogHeader>
          <div className='flex items-start space-x-3 py-4'>
            <Checkbox
              id='declaracion-autenticidad'
              checked={isChecked}
              onCheckedChange={(checked) => setIsChecked(checked === true)}
              className='mt-0.5'
            />
            <label
              htmlFor='declaracion-autenticidad'
              className='text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
            >
              Acepto la declaración de autenticidad
            </label>
          </div>
          <DialogFooter>
            <button
              onClick={() => {
                setDeclaracionDialog({ open: false, responseId: null })
                setIsChecked(false)
              }}
              className='inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none'
            >
              Cancelar
            </button>
            <button
              disabled={!isChecked}
              onClick={() => {
                if (declaracionDialog.responseId) {
                  router.post(`/student/application-form-responses/${declaracionDialog.responseId}/start`)
                }
              }}
              className='inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50'
            >
              Iniciar evaluación
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  )
}
