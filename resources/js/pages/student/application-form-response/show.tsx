import FlashMessages from '@/components/organisms/flash-messages'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Image from '@/components/ui/image'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import AppLayout from '@/layouts/app-layout'
import { useTranslations } from '@/lib/translator'
import type { ApplicationFormResponse } from '@/types/application-form/form/response/application-form-response'
import { getQuestionTypeBadge } from '@/types/application-form/question/question-type-c'
import { BreadcrumbItem } from '@/types/core'
import { Head } from '@inertiajs/react'
import { ArrowRight } from 'lucide-react'

type PageProps = {
  application_form_response: ApplicationFormResponse
}

export default function ApplicationFormResponseShow({ application_form_response }: PageProps) {
  const { t } = useTranslations()

  const hasValidQuestionData = (responseQuestion: any) => {
    return responseQuestion?.question
  }

  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Inicio', href: '/student/dashboard' },
    { title: 'Sesiones de aprendizaje', href: '/student/learning-sessions' },
    { title: 'Ficha de aplicación respuesta', href: '/student/application-form-response/' + application_form_response.id }
  ]

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('session_learning.title', 'Sesiones de Aprendizaje')} />
      <FlashMessages />

      <div className='relative flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4'>
        <div className='space-y-6 py-6'>
          <div className='flex items-center justify-between'>
            <div className='space-y-2 rounded-xl bg-white p-4'>
              <h1 className='text-2xl font-bold tracking-tight'>Resultados de la evaluación</h1>
              <p className='text-muted-foreground'>Revisa tus respuestas y calificaciones</p>
            </div>

            <div className='flex items-center gap-4'>
              <Badge variant='secondary' className='text-base'>
                {t('Score')}:
                <span className='font-semibold'>
                  {application_form_response.application_form?.score_max || 0} / {application_form_response.score || 0}
                </span>
              </Badge>
            </div>
          </div>

          <div className='space-y-6'>
            {application_form_response.response_questions?.map((responseQuestion: any, index: number) => {
              if (!hasValidQuestionData(responseQuestion)) return null

              const question = responseQuestion.question
              const questionTypeId = question?.question_type?.id
              const selectedOptions = responseQuestion.selected_options || []

              return (
                <Card key={responseQuestion.id} className='overflow-hidden'>
                  <CardHeader className='p-4'>
                    <div className='mb-2 flex items-center gap-2'>
                      <span className='text-muted-foreground text-sm font-medium'>Pregunta {index + 1}</span>
                      {getQuestionTypeBadge(question)}
                    </div>
                    <CardTitle className='text-lg'>{question?.name}</CardTitle>
                    {question?.description && <p className='text-muted-foreground mt-2 text-sm'>{question.description}</p>}
                  </CardHeader>

                  <CardContent className='flex flex-col-reverse gap-4 md:flex-row md:items-center'>
                    <div className='flex-1 space-y-4'>
                      {/* Explicación */}
                      {responseQuestion.application_form_question.question.explanation_required && (
                        <div className='space-y-2'>
                          <Label>{t('Your') + ' ' + t('Explanation')}: </Label>
                          <Input
                            type='text'
                            name={`responses.${responseQuestion.application_form_question_id}.explanation`}
                            defaultValue={responseQuestion.explanation || ''}
                            className='w-full'
                            readOnly
                          />
                        </div>
                      )}

                      {/* Opciones */}
                      {selectedOptions.length > 0 ? (
                        <div className='space-y-2'>
                          <Label>{t('Your') + ' ' + t('Answer')}: </Label>
                          <div className='space-y-3'>
                            {questionTypeId === 3 ? (
                              // Preguntas de emparejamiento - Mejorado para móvil
                              <div className='space-y-3'>
                                {selectedOptions.map((selectedOption: any) => {
                                  const leftOption = question.options?.find((opt: any) => opt.id === selectedOption.question_option_id)
                                  const rightOption = question.options?.find((opt: any) => opt.id === selectedOption.paired_with_option_id)

                                  return (
                                    <div
                                      key={selectedOption.id}
                                      className='group relative overflow-hidden rounded-lg border p-3 transition-all duration-200 ease-in-out hover:shadow-sm'
                                    >
                                      <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4'>
                                        <div className='min-w-0 flex-1'>
                                          <span className='text-foreground/90 font-medium break-words'>
                                            {leftOption?.value || 'Opción no encontrada'}
                                          </span>
                                        </div>
                                        <div className='flex items-center justify-center sm:flex-shrink-0'>
                                          <ArrowRight className='text-muted-foreground h-4 w-4 rotate-90 sm:rotate-0' />
                                        </div>
                                        <div className='bg-background/50 min-w-0 flex-1 rounded p-2'>
                                          <span className='text-foreground/80 break-words'>{rightOption?.value || 'No seleccionado'}</span>
                                        </div>
                                      </div>
                                    </div>
                                  )
                                })}
                              </div>
                            ) : questionTypeId === 2 ? (
                              // Preguntas de ordenamiento - Mejorado para móvil
                              <div className='space-y-3'>
                                {selectedOptions
                                  .sort((a: any, b: any) => a.order - b.order)
                                  .map((option: any, index: number) => {
                                    return (
                                      <div
                                        key={option.id}
                                        className='group relative overflow-hidden rounded-lg border p-4 transition-all duration-200 ease-in-out hover:shadow-sm'
                                      >
                                        <div className='flex items-start gap-3'>
                                          <div className='bg-primary/10 text-primary flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-sm font-medium'>
                                            {index + 1}
                                          </div>
                                          <div className='min-w-0 flex-1'>
                                            <p className='text-foreground text-sm break-words'>{option.question_option?.value}</p>
                                          </div>
                                        </div>
                                      </div>
                                    )
                                  })}
                              </div>
                            ) : (
                              // Opciones normales para otros tipos de preguntas
                              <div className='space-y-3'>
                                {selectedOptions.map((option: any) => (
                                  <div key={option.id} className='rounded-lg border p-3 transition-shadow hover:shadow-sm'>
                                    <div className='flex items-start gap-2'>
                                      <div className='min-w-0 flex-1'>
                                        <p className='text-sm break-words'>{option.question_option?.value}</p>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        responseQuestion.application_form_question.question.question_type_id !== 5 && (
                          <p className='text-muted-foreground text-sm'>No se proporcionó respuesta</p>
                        )
                      )}
                    </div>

                    {question.image && (
                      <div className='w-full flex-1 md:w-auto'>
                        <Image src={question.image} alt={question.name} />
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
