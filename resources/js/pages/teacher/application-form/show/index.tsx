import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Image from '@/components/ui/image'
import AppLayout from '@/layouts/app-layout'
import { useTranslations } from '@/lib/translator'
import { cn } from '@/lib/utils'
import { ApplicationForm, ApplicationFormStatus } from '@/types/application-form'
import { getQuestionTypeBadge, QUESTION_TYPES } from '@/types/application-form/question/question-type-c'
import { BreadcrumbItem } from '@/types/core'
import { Head, Link } from '@inertiajs/react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { CheckCircle, Link as LinkIcon, XCircle } from 'lucide-react'
import { statusColors } from '../../questions/components/question-types'

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Fichas de Aplicación',
    href: '/teacher/application-forms'
  },
  {
    title: 'Detalles de Ficha',
    href: ''
  }
]

interface ApplicationFormShowProps {
  application_form: ApplicationForm
}

// Componente para mostrar diferentes tipos de preguntas
function QuestionDisplay({
  question,
  index
}: {
  question: NonNullable<ApplicationFormShowProps['application_form']['questions']>[0]
  index: number
}) {
  const { t } = useTranslations()

  const q = question?.question
  if (!q) return null

  const questionType = q.question_type?.id
  const options = q.options || []

  const renderOptions = () => {
    switch (questionType) {
      case QUESTION_TYPES.SINGLE_CHOICE:
        return (
          <div className='mt-3 space-y-2'>
            <div className='text-muted-foreground text-sm font-medium'>{t('Options')}:</div>
            <ul className='space-y-1'>
              {options.map((option) => (
                <li
                  key={option.id}
                  className={`flex items-center gap-2 text-sm ${option.is_correct ? 'font-medium text-green-600' : 'text-foreground'}`}
                >
                  {option.is_correct ? <CheckCircle className='h-4 w-4 text-green-500' /> : <div className='h-4 w-4' />}
                  <span>{option.value ?? t('No value')}</span>
                </li>
              ))}
            </ul>
          </div>
        )

      case QUESTION_TYPES.ORDERING:
        const orderedOptions = [...options].sort(
          (a, b) => (a.correct_order ?? Number.MAX_SAFE_INTEGER) - (b.correct_order ?? Number.MAX_SAFE_INTEGER)
        )
        return (
          <div className='mt-3 space-y-2'>
            <div className='text-muted-foreground text-sm font-medium'>{t('Correct order')}:</div>
            <ol className='list-decimal space-y-1 pl-5'>
              {orderedOptions.map((option) => (
                <li key={option.id} className='text-sm'>
                  {option.value ?? 'Sin valor'}
                </li>
              ))}
            </ol>
          </div>
        )

      case QUESTION_TYPES.MATCHING:
        const leftItems = options.filter((opt) => opt.pair_side === 'left')
        const rightItems = options.filter((opt) => opt.pair_side === 'right')

        return (
          <div className='mt-3 space-y-3'>
            <div className='text-muted-foreground text-sm font-medium'>{t('Correct pairs')}:</div>
            <div className='space-y-2'>
              {leftItems.map((left) => {
                const rightMatch = rightItems.find((r) => r.pair_key === left.pair_key)
                return (
                  <div key={left.id} className='flex items-center gap-2 text-sm'>
                    <span className='font-medium'>{left.value ?? t('No value')}</span>
                    <LinkIcon className='text-muted-foreground h-4 w-4 flex-shrink-0' />
                    <span className='truncate'>{rightMatch?.value ?? t('No match')}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )

      case QUESTION_TYPES.TRUE_FALSE: {
        const trueOption = options.find((opt) => ['verdadero', 'true'].includes((opt.value ?? '').toLowerCase()))
        const isTrueCorrect = trueOption?.is_correct ?? false

        return (
          <div className='mt-3 space-y-2'>
            <div className='text-muted-foreground text-sm font-medium'>{t('Correct answer')}:</div>
            <div className='flex items-center gap-2'>
              {isTrueCorrect ? (
                <div className='flex items-center gap-1 text-green-600'>
                  <CheckCircle className='h-4 w-4' />
                  <span>{t('True')}</span>
                </div>
              ) : (
                <div className='flex items-center gap-1 text-red-600'>
                  <XCircle className='h-4 w-4' />
                  <span>{t('False')}</span>
                </div>
              )}
            </div>
          </div>
        )
      }

      case QUESTION_TYPES.OPEN_ANSWER:
        return (
          <div className='mt-3 space-y-2'>
            <div className='text-muted-foreground text-sm font-medium'>{t('Explanation required')}</div>
          </div>
        )

      default:
        return (
          <div className='mt-3 text-sm text-amber-600'>
            {t('Unsupported question type')}: {questionType}
          </div>
        )
    }
  }

  const borderColor = q.capability?.color ? `border-s-${q.capability?.color}-500` : 'border-s-gray-500'
  const capabilityBgColor = q.capability?.color ? `bg-${q.capability?.color}-50` : 'bg-gray-50'
  const capabilityTextColor = q.capability?.color ? `text-${q.capability?.color}-500` : 'text-gray-500'

  return (
    <div className={cn('rounded-lg border border-s-4 p-4', borderColor)}>
      <div className='space-y-2'>
        <div className='flex items-start justify-between'>
          <h4 className='font-medium'>
            {index + 1}. {q.name || 'Pregunta sin nombre'}
          </h4>
          <div className='flex items-center gap-2'>{getQuestionTypeBadge(q)}</div>
        </div>

        {q.description && <p className='text-muted-foreground text-sm'>{q.description}</p>}

        <div className='flex flex-wrap items-center gap-2 pt-1'>
          {q.difficulty && (
            <span className='inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800'>
              {t(q.difficulty)}
            </span>
          )}
          {q.explanation_required && (
            <span className='inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800'>
              {t('Explanation required')}
            </span>
          )}
          <span className='text-muted-foreground text-sm'>{question.score ?? 0} puntos</span>
          {q?.capability?.name && (
            <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', capabilityBgColor, capabilityTextColor)}>
              {q.capability.name}
            </span>
          )}
        </div>

        <div className='flex flex-col-reverse flex-wrap items-center justify-between gap-2 pt-1 md:flex-row'>
          {renderOptions()}
          <Image src={q.image ?? ''} alt={q.name} className='w-64' />
        </div>
      </div>
    </div>
  )
}

export default function ApplicationFormShow({ application_form }: ApplicationFormShowProps) {
  const { t } = useTranslations()

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'PPP', { locale: es })
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Ficha: ${application_form.name}`} />
      <div className='flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-6'>
        <div className='space-y-6'>
          <div className='flex items-center justify-between'>
            <div>
              <h2 className='text-2xl font-bold tracking-tight'>{application_form.name}</h2>
              <p className='text-muted-foreground'>{application_form.description}</p>
            </div>
            <div className='flex items-center gap-2'>
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${statusColors[application_form.status as ApplicationFormStatus]}`}
              >
                {t(application_form.status)}
              </span>
              <Button asChild variant='outline' size='sm'>
                <Link href={route('teacher.application-forms.edit', application_form.id)}>{t('Edit form')}</Link>
              </Button>
            </div>
          </div>

          <div className='grid gap-6 md:grid-cols-2'>
            {/* Información General */}
            <Card>
              <CardHeader>
                <CardTitle>{t('General Information')}</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='space-y-2'>
                  <div className='text-muted-foreground text-sm font-medium'>{t('Curricular Area')}</div>
                  <div>
                    {application_form.learning_session?.teacher_classroom_curricular_area_cycle?.curricular_area_cycle?.curricular_area?.name ||
                      'No especificado'}
                  </div>
                </div>

                <div className='space-y-2'>
                  <div className='text-muted-foreground text-sm font-medium'>{t('Competency')}</div>
                  <div>{application_form.learning_session?.competency?.name || t('Not specified')}</div>
                </div>

                <div className='space-y-2'>
                  <div className='text-muted-foreground text-sm font-medium'>{t('Grade/Section')}</div>
                  <div>
                    {t(application_form.learning_session?.teacher_classroom_curricular_area_cycle?.classroom?.level) +
                      ' ' +
                      t(application_form.learning_session?.teacher_classroom_curricular_area_cycle?.classroom?.grade) +
                      ' ' +
                      application_form.learning_session?.teacher_classroom_curricular_area_cycle?.classroom?.section}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Fechas y Puntaje */}
            <Card>
              <CardHeader>
                <CardTitle>{t('Application Period')}</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='space-y-2'>
                  <div className='text-muted-foreground text-sm font-medium'>{t('Start Date')}</div>
                  <div className='flex items-center gap-2'>
                    <span>{formatDate(application_form.start_date)}</span>
                  </div>
                </div>

                <div className='space-y-2'>
                  <div className='text-muted-foreground text-sm font-medium'>{t('End Date')}</div>
                  <div className='flex items-center gap-2'>
                    <span>{formatDate(application_form.end_date)}</span>
                  </div>
                </div>

                <div className='space-y-2'>
                  <div className='text-muted-foreground text-sm font-medium'>{t('Total Score')}</div>
                  <div className='flex items-center gap-2'>
                    <span className='text-lg font-bold'>{application_form.score_max}</span>
                    <span className='text-muted-foreground text-sm'>{t('points')}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Capacidades */}
          {application_form.learning_session?.capabilities && application_form.learning_session.capabilities.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>{t('Capabilities')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='flex flex-wrap gap-2'>
                  {application_form.learning_session.capabilities.map((capability) => (
                    <div
                      key={capability.id}
                      className={`rounded-full px-3 py-1 text-sm ${capability.color ? `bg-${capability.color}-100 text-${capability.color}-800` : 'bg-gray-100 text-gray-800'}`}
                    >
                      {capability.name}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Preguntas */}
          <Card>
            <CardHeader>
              <CardTitle>{t('Questions')}</CardTitle>
              <p className='text-muted-foreground text-sm'>
                {application_form.questions?.length || 0} {t('questions in total')}
              </p>
            </CardHeader>
            <CardContent>
              {application_form.questions && application_form.questions.length > 0 ? (
                <div className='space-y-6'>
                  {application_form.questions.map((question, index) => (
                    <QuestionDisplay key={question.id} question={question} index={index} />
                  ))}
                </div>
              ) : (
                <div className='rounded-lg border-2 border-dashed p-8 text-center'>
                  <p className='text-muted-foreground'>{t('No questions in this form')}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className='flex justify-end'>
            <Button asChild variant='outline'>
              <Link href={route('teacher.application-forms.index')}>{t('Back to list')}</Link>
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
