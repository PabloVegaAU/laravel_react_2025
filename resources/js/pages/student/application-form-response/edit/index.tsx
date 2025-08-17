import InputError from '@/components/input-error'
import FlashMessages from '@/components/organisms/flash-messages'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Image from '@/components/ui/image'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import AppLayout from '@/layouts/app-layout'
import { useTranslations } from '@/lib/translator'
import { getNestedError } from '@/lib/utils'
import { ApplicationFormResponse, ResponseAnswer } from '@/types/application-form'
import { getQuestionTypeBadge } from '@/types/application-form/question/question-type-c'
import { BreadcrumbItem } from '@/types/core'
import { Head, useForm } from '@inertiajs/react'
import * as React from 'react'
import { QuestionResponse } from '../components/QuestionResponse'

type PageProps = {
  application_form_response: ApplicationFormResponse
}

// La estructura de datos para el formulario, usando un diccionario para las respuestas.
type TFormData = {
  responses: Record<number, ResponseAnswer> // Usamos number como clave para acceder por questionId
  [key: string]: any
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Fichas de aplicación respuesta',
    href: 'student/dashboard'
  }
]

export default function ApplicationFormResponseEdit({ application_form_response }: PageProps) {
  const { t } = useTranslations()

  // Transformar los datos de la respuesta inicial en una estructura de diccionario plana.
  const initialResponses = application_form_response.response_questions.reduce(
    (acc, responseQuestion) => {
      const { application_form_question, id, explanation } = responseQuestion
      const selectedOptions = responseQuestion.selected_options || []
      const questionType = application_form_question.question.question_type.id

      // Asegurarse de que siempre haya un array de selected_options
      const selectedOptionIds = selectedOptions.map((opt) => opt.question_option_id).filter(Boolean)

      const response: ResponseAnswer = {
        id,
        application_form_question_id: application_form_question.id,
        question_id: application_form_question.question_id,
        explanation: explanation || '',
        selected_options: selectedOptionIds,
        order: [],
        pairs: {}
      }

      if (questionType === 2) {
        // Ordenamiento
        // Para ordenamiento, usamos el orden guardado o el orden natural si no hay orden guardado
        const hasOrder = selectedOptions.some((opt) => opt.selected_order !== null)
        let orderedOptions: any[] = []

        if (hasOrder) {
          // Si hay un orden guardado, usarlo
          orderedOptions = [...selectedOptions].sort((a, b) => (a.selected_order ?? 0) - (b.selected_order ?? 0))
        } else {
          // Si no hay orden guardado, usar el orden natural de las opciones
          orderedOptions = [...selectedOptions].sort((a, b) => (a.id || 0) - (b.id || 0))
          // Si no hay orden guardado, inicializar el orden basado en el orden de las opciones
          if (orderedOptions.length > 0) {
            response.order = orderedOptions.map((opt) => opt.question_option_id)
            response.selected_options = [...response.order]
          }
        }
      } else if (questionType === 3) {
        // Emparejamiento
        // Para emparejamiento, construimos el objeto de pares
        const pairs: Record<number, number> = {}
        selectedOptions.forEach((opt) => {
          if (opt.paired_with_option_id) {
            pairs[opt.question_option_id] = opt.paired_with_option_id
            // Aseguramos que ambos lados del par estén en selected_options
            if (!response.selected_options.includes(opt.question_option_id)) {
              response.selected_options.push(opt.question_option_id)
            }
            if (!response.selected_options.includes(opt.paired_with_option_id)) {
              response.selected_options.push(opt.paired_with_option_id)
            }
          }
        })
        response.pairs = pairs
      }

      acc[responseQuestion.application_form_question_id] = response // Era: acc[application_form_question.id]
      return acc
    },
    {} as Record<string, ResponseAnswer>
  )

  // Asegurarnos de que el tipo de responses sea correcto
  const { data, setData, put, errors, processing } = useForm<TFormData>({
    responses: initialResponses
  })

  /**
   * Actualiza la respuesta de una pregunta específica.
   */
  const updateResponse = (questionId: number, newResponse: Partial<ResponseAnswer>) => {
    // Crear una copia segura de las respuestas actuales
    const currentResponses = data.responses || {}
    const currentResponse = (data.responses && data.responses[questionId as keyof typeof data.responses]) || {
      selected_options: [],
      pairs: {}
    }

    // Crear el objeto actualizado con tipos correctos
    const updatedResponses: Record<number, ResponseAnswer> = {
      ...currentResponses,
      [questionId]: {
        ...currentResponse,
        ...newResponse
      } as ResponseAnswer
    }

    setData('responses', updatedResponses)
  }

  /**
   * Maneja la selección de pares para preguntas de emparejamiento.
   * @param application_form_question_id ID de la pregunta de emparejamiento
   * @param leftId ID de la opción izquierda seleccionada
   * @param rightId ID de la opción derecha seleccionada (o null para desemparejar)
   */
  const handleMatchingPairSelect = (application_form_question_id: number, leftId: number, rightId: number | null) => {
    if (!data?.responses) return

    // Obtener la respuesta actual para esta pregunta
    const responseEntry = Object.entries(data.responses).find(([_, r]) => r.application_form_question_id === application_form_question_id) as
      | [string, ResponseAnswer]
      | undefined

    if (!responseEntry) return

    const [responseKey, currentResponse] = responseEntry

    // Crear una copia profunda de los pares actuales
    const currentPairs = currentResponse.pairs ? { ...currentResponse.pairs } : {}
    const updatedPairs = { ...currentPairs }

    if (rightId === null) {
      // Eliminar emparejamiento existente
      if (leftId in updatedPairs) {
        delete updatedPairs[leftId]
      }
    } else {
      // Actualizar o crear emparejamiento
      updatedPairs[leftId] = rightId
    }

    // Crear las opciones seleccionadas a partir de los pares
    const selectedOptions = Object.entries(updatedPairs).flatMap(([lId, rId]) => [Number(lId), rId])

    // Actualizar la respuesta
    updateResponse(application_form_question_id, {
      ...currentResponse, // Mantener el resto de la respuesta
      pairs: updatedPairs,
      selected_options: selectedOptions
    })
  }

  /**
   * Maneja el reordenamiento de opciones para preguntas de ordenamiento.
   */
  const handleReorder = (application_form_question_id: number, newOrder: number[]) => {
    // Obtener la pregunta actual
    const question = application_form_response.response_questions.find((q) => q.application_form_question_id === application_form_question_id)

    if (!question) {
      return
    }

    // Actualizar el estado con el nuevo orden
    updateResponse(application_form_question_id, {
      order: newOrder,
      selected_options: [...newOrder] // Mantener sincronizado con las opciones seleccionadas
    })
  }

  /**
   * Maneja la selección de una opción para preguntas de opción única o múltiple.
   */
  const handleOptionSelect = (application_form_question_id: number, optionId: number) => {
    const question = application_form_response.response_questions.find((q) => q.application_form_question_id === application_form_question_id)
      ?.application_form_question.question

    if (!question) return

    const questionTypeId = question.question_type.id
    const isSingle = [1, 4].includes(questionTypeId)
    const currentResponse = (data.responses && data.responses[application_form_question_id as keyof typeof data.responses]) || {
      selected_options: []
    }
    let newSelectedOptions: number[] = []

    if (isSingle) {
      // Para preguntas de selección única, reemplazar cualquier selección previa
      newSelectedOptions = [optionId]
    } else {
      // Para preguntas de selección múltiple, alternar la opción seleccionada
      const currentSelected = currentResponse.selected_options || []
      newSelectedOptions = currentSelected.includes(optionId) ? currentSelected.filter((id) => id !== optionId) : [...currentSelected, optionId]
    }

    // Actualizar el estado con las nuevas opciones seleccionadas
    updateResponse(application_form_question_id, {
      selected_options: newSelectedOptions,
      // Para preguntas de ordenamiento, actualizar el orden también
      ...(questionTypeId === 2 && { order: newSelectedOptions })
    })
  }

  /**
   * Maneja el cambio de la explicación para preguntas de respuesta abierta.
   */
  const handleExplanationChange = (application_form_question_id: number, explanation: string) => {
    updateResponse(application_form_question_id, {
      explanation
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShowSubmitDialog(true)
  }

  const handleConfirmSubmit = () => {
    setIsSubmitting(true)

    // Asegurar que todas las preguntas de ordenamiento tengan su array de orden correctamente establecido
    const updatedResponses = { ...data.responses }

    // Actualizar las respuestas para asegurar que las preguntas de ordenamiento tengan el orden correcto
    Object.entries(updatedResponses).forEach(([questionIdStr, response]) => {
      const questionId = Number(questionIdStr)
      const question = application_form_response.response_questions.find((q) => q.application_form_question_id === questionId)

      if (question?.application_form_question.question?.question_type.id === 2) {
        // Esta es una pregunta de ordenamiento
        if (!response.order || response.order.length === 0) {
          // Si el orden está vacío pero tenemos opciones seleccionadas, usamos esas como el orden
          if (response.selected_options && response.selected_options.length > 0) {
            updatedResponses[questionId] = {
              ...response,
              order: [...response.selected_options],
              selected_options: [...response.selected_options] // Aseguramos que esté definido
            } as ResponseAnswer
          }
        } else if (response.order.length !== response.selected_options?.length) {
          // Si el orden y selected_options están des sincronizados, los sincronizamos
          updatedResponses[questionId] = {
            ...response,
            selected_options: [...response.order]
          }
        }
      }
    })

    // Actualizar los datos del formulario con las respuestas transformadas
    setData('responses', updatedResponses)

    // Enviar el formulario
    put(route('student.application-form-responses.update', application_form_response.id), {
      preserveScroll: true,
      onFinish: () => {
        setIsSubmitting(false)
      }
    })
  }

  const [showSubmitDialog, setShowSubmitDialog] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const disabled = application_form_response.status !== 'in progress'
  const isGraded = application_form_response.status === 'graded'

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('Application Form Response')} />
      <FlashMessages />

      <div className='relative flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4'>
        <form onSubmit={handleSubmit}>
          <div className='space-y-6 py-6'>
            <div className='flex items-center justify-between'>
              <div className='space-y-2 rounded-xl bg-white p-4'>
                <h1 className='text-2xl font-bold tracking-tight'>Completa la ficha de aplicación</h1>
                <p className='text-muted-foreground'>Responde todas las preguntas y revisa tus respuestas antes de enviar</p>
              </div>
              <div className='flex items-center gap-4'>
                {isGraded && (
                  <Badge variant='secondary' className='text-base'>
                    {t('Score')}:{' '}
                    <span className='font-semibold'>
                      {application_form_response.application_form.score_max} / {application_form_response.score}
                    </span>
                  </Badge>
                )}
                {!disabled && (
                  <Button type='submit' disabled={processing}>
                    {processing ? t('Sending...') : t('Submit answers')}
                  </Button>
                )}
              </div>
            </div>

            {/* Alert Dialog for Submission Confirmation */}
            <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Estás seguro de enviar tus respuestas?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Una vez que envíes el formulario, no podrás realizar cambios. Asegúrate de haber revisado todas tus respuestas antes de continuar.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isSubmitting}>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={(e) => {
                      e.preventDefault()
                      handleConfirmSubmit()
                    }}
                    disabled={isSubmitting}
                    className='bg-primary hover:bg-primary/90'
                  >
                    {isSubmitting ? 'Enviando...' : 'Sí, enviar respuestas'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <div className='space-y-8'>
              {application_form_response.response_questions.map((responseQuestion, index) => {
                const questionTypeId = responseQuestion.application_form_question.question.question_type.id
                const canSelectOption = [1, 4].includes(questionTypeId)
                const image = responseQuestion.application_form_question.question?.image

                return (
                  <Card key={responseQuestion.id}>
                    <CardHeader className='p-4'>
                      <div className='mb-2 flex items-center gap-2'>
                        <span className='text-muted-foreground text-sm font-medium'>{t('Question') + ' ' + (index + 1)}</span>
                        {getQuestionTypeBadge(responseQuestion.application_form_question.question)}
                      </div>
                      <CardTitle className='text-lg'>{responseQuestion.application_form_question.question.name}</CardTitle>
                      {responseQuestion.application_form_question.question.description && (
                        <p className='text-muted-foreground mt-2 text-sm'>{responseQuestion.application_form_question.question.description}</p>
                      )}
                    </CardHeader>
                    <CardContent className='flex flex-col-reverse gap-4 md:flex-row md:items-center'>
                      <div className='flex-1 space-y-4'>
                        {/* Explicación */}
                        {responseQuestion.application_form_question.question.explanation_required && (
                          <div className='space-y-2'>
                            <Label>{t('Explanation')}</Label>
                            <Input
                              type='text'
                              name={`responses.${responseQuestion.application_form_question_id}.explanation`}
                              value={data.responses[responseQuestion.application_form_question_id].explanation || ''}
                              onChange={(e) => handleExplanationChange(responseQuestion.application_form_question_id, e.target.value)}
                              disabled={disabled}
                              required
                            />
                          </div>
                        )}

                        {/* Opciones */}
                        {responseQuestion.application_form_question.question.question_type_id !== 5 && (
                          <>
                            <div className='space-y-2'>
                              <Label>{t('Options')}</Label>
                              <QuestionResponse
                                question={responseQuestion}
                                response={data.responses[responseQuestion.application_form_question_id]}
                                onOptionSelect={
                                  canSelectOption
                                    ? (optionId: number) => handleOptionSelect(responseQuestion.application_form_question_id, optionId)
                                    : undefined
                                }
                                onReorder={(optionIds: number[]) => handleReorder(responseQuestion.application_form_question_id, optionIds)}
                                onMatchingPairSelect={(leftId: number, rightId: number | null) =>
                                  handleMatchingPairSelect(responseQuestion.application_form_question_id, leftId, rightId)
                                }
                                disabled={disabled}
                              />
                              <InputError
                                message={getNestedError(errors, `responses.${responseQuestion.application_form_question_id}.selected_options`)}
                                className='mt-2'
                              />
                            </div>
                          </>
                        )}
                      </div>
                      {image && (
                        <div className='w-full flex-1 md:w-auto'>
                          <Image src={image} alt={image} />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </form>
      </div>
    </AppLayout>
  )
}
