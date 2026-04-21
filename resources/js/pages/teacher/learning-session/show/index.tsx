import FlashMessages from '@/components/organisms/flash-messages'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import AppLayout from '@/layouts/app-layout'
import { tStatus } from '@/lib/status-translation'
import { useTranslations } from '@/lib/translator'
import { BreadcrumbItem, SharedData } from '@/types/core'
import { LearningSession } from '@/types/learning-session'
import { Head, Link, usePage } from '@inertiajs/react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

type PageProps = {
  learning_session: LearningSession
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Sesiones de Aprendizaje',
    href: 'teacher/learning-session'
  }
]

export default function LearningSessionShow({ learning_session }: PageProps) {
  const { educational_institution } = learning_session
  const { auth } = usePage<SharedData>().props
  const { t } = useTranslations()

  const dateLocale = es

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('session_learning.title', 'Sesiones de Aprendizaje')} />
      <FlashMessages />

      <div className='flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4'>
        <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
          <Label>UGEL: {educational_institution?.ugel}</Label>
          <Label>I.E: {educational_institution?.name}</Label>
          <Label>Docente: {auth.user.name}</Label>
        </div>

        <h2 className='text-xl font-bold'>I. DATOS GENERALES:</h2>

        <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
          {/* Campo: Título */}
          <div className='space-y-2'>
            <Label>
              {t('Learning Session Name')}: {learning_session.name}
            </Label>
          </div>

          {/* Campo: Fecha de la sesión */}
          <div className='space-y-2'>
            <Label>
              {t('Start Date')}: {format(learning_session.start_date, 'dd/MM/yyyy HH:mm', { locale: dateLocale })}
            </Label>
          </div>

          {/* Campo: Aula */}
          <div className='space-y-2'>
            <Label>
              Aula: {t(learning_session.teacher_classroom_curricular_area_cycle?.classroom?.level)}{' '}
              {t(learning_session.teacher_classroom_curricular_area_cycle?.classroom?.grade)}{' '}
              {t(learning_session.teacher_classroom_curricular_area_cycle?.classroom?.section)}
            </Label>
          </div>
        </div>

        <h1 className='text-xl font-bold'>II. PROPÓSITOS Y EVIDENCIAS DE APRENDIZAJE</h1>

        <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
          {/* Campo: Área Curricular */}
          <div className='space-y-2'>
            <Label>
              Área Curricular: {learning_session.teacher_classroom_curricular_area_cycle?.curricular_area_cycle?.curricular_area?.name} - CICLO{' '}
              {learning_session.teacher_classroom_curricular_area_cycle?.curricular_area_cycle?.cycle?.name}
            </Label>
          </div>

          {/* Campo: Competencia */}
          <div className='space-y-2'>
            <Label>Competencia: {learning_session.competency?.name}</Label>
          </div>

          {/* Campo: Capacidades */}
          <div className='space-y-2'>
            <Label>Capacidades: {learning_session.capabilities?.map((capability) => capability.name).join(', ')}</Label>
          </div>
        </div>

        <h2 className='text-lg font-bold'>DESEMPEÑOS (PRECIZADO)</h2>

        <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
          {/* Campo: Desempeños */}
          <div className='space-y-2'>
            <Label>Desempeños: {learning_session.performances}</Label>
          </div>

          {/* Campo: Propósito de la sesión */}
          <div className='space-y-2'>
            <Label>Propósito de la sesión: {learning_session.purpose_learning}</Label>
          </div>
        </div>

        <h2 className='text-lg font-bold'>III. SECUENCIA DIDÁCTICA</h2>

        <div className='grid grid-cols-1 gap-6'>
          {/* Campo: Secuencia de inicio */}
          <div className='grid grid-cols-8 items-center gap-6'>
            <div className='col-span-2 flex size-full flex-col items-center justify-center gap-2'>INICIO</div>
            <div className='col-span-6 w-full space-y-2'>
              <Label>Secuencia de inicio: {learning_session.start_sequence}</Label>
            </div>
          </div>

          {/* Campo: Secuencia de desarrollo */}
          <div className='grid grid-cols-8 items-center gap-6'>
            <div className='col-span-2 flex size-full flex-col items-center justify-center gap-2 border-6 border-emerald-600 bg-emerald-500'>
              DESARROLLO
            </div>
            <div className='col-span-6 w-full space-y-2'>
              <Label>Formularios de aplicación:</Label>
              {learning_session.application_form && (
                <div className='grid grid-cols-2 items-center gap-2 space-y-2'>
                  <div className='flex w-full flex-col gap-2'>
                    <div className='flex items-center space-x-2'>
                      <Label>NOMBRE:</Label>
                      <p>{learning_session.application_form.name}</p>
                    </div>
                    <div className='flex items-center space-x-2'>
                      <Label>FECHA INICIO:</Label>
                      <p>{format(learning_session.application_form.start_date, 'dd/MM/yyyy HH:mm')}</p>
                    </div>
                    <div className='flex items-center space-x-2'>
                      <Label>FECHA FIN:</Label>
                      <p>{format(learning_session.application_form.end_date, 'dd/MM/yyyy HH:mm')}</p>
                    </div>
                  </div>
                  <div className='flex w-full flex-col gap-2'>
                    <div className='flex items-center space-x-2'>
                      <Label>ESTADO:</Label>
                      <div>{tStatus(learning_session.application_form.status)}</div>
                    </div>

                    <div className='flex items-center space-x-2'>
                      <Label>ACCIONES:</Label>
                      <div className='flex gap-2'>
                        <Link href={`/teacher/application-forms/${learning_session.application_form.id}`}>
                          <Button variant='info' size='sm'>
                            Ver
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Campo: Secuencia de cierre */}
          <div className='grid grid-cols-8 items-center gap-6'>
            <div className='col-span-2 flex size-full flex-col items-center justify-center gap-2'>CIERRE</div>
            <div className='col-span-6 w-full space-y-2'>
              <Label>Secuencia de cierre: {learning_session.end_sequence}</Label>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
