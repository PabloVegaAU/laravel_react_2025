import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Question } from '@/types/application-form/question'
import { EyeIcon } from 'lucide-react'
import { MatchingOptions, OrderingOptions, SingleChoiceOptions, TrueFalseOptions } from './question-types'

import { useTranslations } from '@/lib/translator'
import { cn } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'

interface ViewQuestionDialogProps {
  isOpen: boolean
  id: number
  onOpenChange: (open: boolean) => void
}

export function ViewQuestionDialog({ isOpen, id, onOpenChange }: ViewQuestionDialogProps) {
  // Hook de traducciones
  const { t } = useTranslations()

  // Hook de datos para obtener la pregunta
  const { data: question } = useQuery({
    queryKey: ['question', id],
    queryFn: () => fetch(`/teacher/questions/${id}`).then((res) => res.json() as Promise<Question>),
    enabled: isOpen && !!id,
    staleTime: 1000 * 60 * 5, // 5 minutos
    refetchOnWindowFocus: false
  })

  const getCurricularAreaName = () => {
    const area = question?.capability.competency?.curricular_area_cycle?.curricular_area?.name
    return area || 'No especificada'
  }

  const getCompetencyName = () => {
    const competency = question?.capability.competency?.name
    return competency || 'No especificada'
  }

  const getCapabilityName = () => {
    const capability = question?.capability.name
    return capability || 'No especificada'
  }

  const getQuestionTypeName = () => {
    const type = question?.question_type.name
    return type || 'No especificado'
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <EyeIcon className='h-4 w-4 cursor-pointer' onClick={() => onOpenChange(true)} />
      </DialogTrigger>
      <DialogContent className='max-w-[100vw] md:max-w-[80vw]'>
        <DialogTitle>VISUALIZAR PREGUNTA N° {id}</DialogTitle>
        <DialogDescription>Visualice los detalles de la pregunta seleccionada.</DialogDescription>

        <div className='flex flex-col gap-6'>
          {question ? (
            <div
              className={cn(
                'grid grid-cols-1 gap-6',
                (question.image || question.help_message || question.options || question.options) && 'grid-cols-2'
              )}
            >
              {/* Columna Izquierda */}
              <div className='flex flex-col gap-6'>
                {/* Información Académica */}
                <div className='space-y-4'>
                  {/* Área Curricular */}
                  <div className='flex flex-col gap-1'>
                    <span className='text-sm font-medium text-gray-700'>Área Curricular:</span>
                    <span className='text-sm text-gray-900'>{getCurricularAreaName()}</span>
                  </div>

                  {/* Competencia */}
                  <div className='flex flex-col gap-1'>
                    <span className='text-sm font-medium text-gray-700'>Competencia:</span>
                    <span className='text-sm text-gray-900'>{getCompetencyName()}</span>
                  </div>

                  {/* Capacidad */}
                  <div className='flex flex-col gap-1'>
                    <span className='text-sm font-medium text-gray-700'>Capacidad:</span>
                    <span className='text-sm text-gray-900'>{getCapabilityName()}</span>
                  </div>
                </div>

                {/* Configuración de Pregunta */}
                <div className='space-y-4'>
                  <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                    {/* Tipo de pregunta */}
                    <div className='flex flex-col gap-1'>
                      <span className='text-sm font-medium text-gray-700'>Tipo de Pregunta:</span>
                      <span className='text-sm text-gray-900'>{getQuestionTypeName()}</span>
                    </div>

                    {/* Dificultad */}
                    <div className='flex flex-col gap-1'>
                      <span className='text-sm font-medium text-gray-700'>Dificultad:</span>
                      <span className='text-sm text-gray-900'>{t(question.difficulty || 'medium')}</span>
                    </div>
                  </div>

                  {/* Explicación requerida */}
                  <div className='flex items-center gap-2'>
                    <span className='text-sm font-medium text-gray-700'>Explicación requerida:</span>
                    <span className='text-sm text-gray-900'>{question.explanation_required ? 'Sí' : 'No'}</span>
                  </div>
                </div>

                {/* Contenido de la Pregunta */}
                <div className='space-y-4'>
                  {/* Título */}
                  <div className='flex flex-col gap-1'>
                    <span className='text-sm font-medium text-gray-700'>Título:</span>
                    <span className='text-sm text-gray-900'>{question.name}</span>
                  </div>

                  {/* Descripción */}
                  {question.description && (
                    <div className='flex flex-col gap-1'>
                      <span className='text-sm font-medium text-gray-700'>Descripción:</span>
                      <span className='text-sm whitespace-pre-wrap text-gray-900'>{question.description}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Columna Derecha */}
              <div className='flex flex-col gap-6'>
                {/* Recursos Adicionales */}
                <div className='space-y-4'>
                  {/* Imagen */}
                  {question.image && (
                    <div className='flex flex-col gap-2'>
                      <div className='flex justify-center'>
                        <div className='border-input relative h-48 w-full max-w-xs overflow-hidden rounded-lg border'>
                          <img src={question.image} alt='Imagen de la pregunta' className='h-full w-full object-contain p-2' />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Mensaje de ayuda */}
                  {question.help_message && (
                    <div className='flex flex-col gap-1'>
                      <span className='text-sm font-medium text-gray-700'>Mensaje de ayuda:</span>
                      <span className='text-sm whitespace-pre-wrap text-gray-900'>{question.help_message}</span>
                    </div>
                  )}
                </div>

                {/* Opciones */}
                {question.options?.length > 0 && (
                  <div className='space-y-4'>
                    <h3 className='text-sm font-medium text-gray-700'>Opciones</h3>

                    {question.question_type_id?.toString() === '1' && (
                      <SingleChoiceOptions options={Array.isArray(question.options) ? question.options : []} onChange={() => {}} disabled={true} />
                    )}

                    {question.question_type_id?.toString() === '2' && (
                      <OrderingOptions options={Array.isArray(question.options) ? question.options : []} onChange={() => {}} disabled={true} />
                    )}

                    {question.question_type_id?.toString() === '3' && (
                      <MatchingOptions options={Array.isArray(question.options) ? question.options : []} onChange={() => {}} disabled={true} />
                    )}

                    {question.question_type_id?.toString() === '4' && (
                      <TrueFalseOptions options={Array.isArray(question.options) ? question.options : []} onChange={() => {}} disabled={true} />
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className='flex justify-center py-8'>
              <span className='text-gray-500'>Cargando información de la pregunta...</span>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
