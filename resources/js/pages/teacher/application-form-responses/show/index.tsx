import FlashMessages from '@/components/organisms/flash-messages'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import AppLayout from '@/layouts/app-layout'
import { useTranslations } from '@/lib/translator'
import { ApplicationFormResponseQuestion } from '@/types/application-form'
import type { ApplicationFormResponse } from '@/types/application-form/form/response/application-form-response'
import { getQuestionTypeBadge } from '@/types/application-form/question/question-type-c'
import { BreadcrumbItem } from '@/types/core'
import { Head } from '@inertiajs/react'
import { ArrowRight } from 'lucide-react'

type PageProps = {
  application_form_response: ApplicationFormResponse
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Inicio', href: '/teacher/dashboard' },
  { title: 'Sesiones de aprendizaje', href: '/teacher/learning-sessions' },
  { title: 'Respuestas de ficha de aplicación', href: '/teacher/application-form-responses' }
]

export default function ApplicationFormResponseShow({ application_form_response }: PageProps) {
  const { t } = useTranslations()

  const hasValidQuestionData = (responseQuestion: ApplicationFormResponseQuestion) => {
    return responseQuestion?.question
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('session_learning.title', 'Sesiones de Aprendizaje')} />
      <FlashMessages />

      <div className='relative flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4'>
        <div className='space-y-6 py-6'>
          <div className='flex items-center justify-between'>
            <div>
              <h1 className='text-2xl font-bold tracking-tight'>Resultados de la evaluación</h1>
              <p className='text-muted-foreground'>Revisa respuestas y calificaciones</p>
            </div>

            <div className='space-x-2'>
              <Badge variant='outline'>
                Puntaje: {application_form_response.application_form?.score_max || 0} / {application_form_response.score || 0}
              </Badge>
            </div>
          </div>

          <div className='space-y-6'>
            {application_form_response.response_questions?.map((responseQuestion, index: number) => {
              if (!hasValidQuestionData(responseQuestion)) return null

              const question = responseQuestion.question
              const questionType = question?.question_type?.name || 'Desconocido'
              const questionTypeId = question?.question_type?.id
              const selectedOptions = responseQuestion.selected_options || []
              const isCorrect = responseQuestion.is_correct || false

              return (
                <Card key={responseQuestion.id} className='overflow-hidden'>
                  <CardHeader className='p-4'>
                    <div className='flex items-start justify-between'>
                      <div>
                        <div className='mb-2 flex items-center gap-2'>
                          <span className='text-muted-foreground text-sm font-medium'>Pregunta {index + 1}</span>
                          {getQuestionTypeBadge(question)}
                        </div>
                        <CardTitle className='text-lg'>{question?.name}</CardTitle>
                        {question?.description && <p className='text-muted-foreground mt-2 text-sm'>{question.description}</p>}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className='flex items-center gap-4'>
                    <div className='flex-1 space-y-4 p-6'>
                      <div className='space-y-4'>
                        {/* Explicación de la respuesta */}
                        <div>
                          <p className='text-muted-foreground mt-2 text-sm'>{responseQuestion?.explanation}</p>
                        </div>
                        {/* Respuesta del estudiante */}
                        {questionTypeId !== 5 && (
                          <div>
                            <h4 className='mb-2 font-medium'>Respuesta:</h4>
                            {selectedOptions.length > 0 ? (
                              <div className='space-y-2'>
                                {questionTypeId === 3 ? (
                                  // Mejor visualización para preguntas de emparejamiento
                                  <div className='space-y-3'>
                                    {selectedOptions.map((selectedOption) => {
                                      const leftOption = question?.options?.find((opt) => opt.id === selectedOption.question_option_id)
                                      const rightOption = question?.options?.find((opt) => opt.id === selectedOption.paired_with_option_id)

                                      return (
                                        <div
                                          key={selectedOption.id}
                                          className='group relative overflow-hidden rounded-lg border p-3 transition-all duration-200 ease-in-out'
                                        >
                                          <div className='flex flex-col gap-2 sm:flex-row sm:items-center'>
                                            <div className='flex items-center gap-2'>
                                              <span className='text-foreground/90 font-medium'>{leftOption?.value || 'Opción no encontrada'}</span>
                                            </div>
                                            <ArrowRight className='text-muted-foreground mx-2 hidden h-4 w-4 flex-shrink-0 sm:block' />
                                            <div className='bg-background/50 flex-1 rounded p-2'>
                                              <div className='flex items-center gap-2'>
                                                <span className='text-foreground/80'>{rightOption?.value || 'No seleccionado'}</span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      )
                                    })}
                                  </div>
                                ) : // Mejor visualización para preguntas de ordenamiento
                                questionTypeId === 2 ? (
                                  <div className='space-y-3'>
                                    {selectedOptions
                                      .sort((a, b) => (a.selected_order || 0) - (b.selected_order || 0))
                                      .map((option, index) => {
                                        return (
                                          <div
                                            key={option.id}
                                            className='group relative overflow-hidden rounded-lg border p-4 transition-all duration-200 ease-in-out'
                                          >
                                            <div className='flex items-start gap-3'>
                                              <div className='flex flex-shrink-0 flex-col items-center'>
                                                <div className='flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium'>
                                                  {index + 1}
                                                </div>
                                              </div>
                                              <div className='flex-1'>
                                                <p className='text-foreground text-sm'>{option.question_option?.value}</p>
                                              </div>
                                            </div>
                                          </div>
                                        )
                                      })}
                                  </div>
                                ) : (
                                  // Mostrar opciones normales para otros tipos de preguntas
                                  selectedOptions.map((option) => (
                                    <div key={option.id} className='rounded border p-3'>
                                      <div className='flex items-start gap-2'>
                                        <div>
                                          <p className='text-sm'>{option.question_option?.value}</p>
                                        </div>
                                      </div>
                                    </div>
                                  ))
                                )}
                              </div>
                            ) : (
                              <p className='text-muted-foreground text-sm'>No se proporcionó respuesta</p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    {/* Campo is_correct */}
                    <div>
                      <Checkbox
                        id={`is_correct_${responseQuestion.id}`}
                        checked={isCorrect}
                        className='size-5 data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-red-500 md:size-10 lg:size-20'
                      />
                    </div>
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
