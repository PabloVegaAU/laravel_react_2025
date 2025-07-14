import InputError from '@/components/input-error'
import FlashMessages from '@/components/organisms/flash-messages'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import AppLayout from '@/layouts/app-layout'
import { toUTCDateString } from '@/lib/date'
import { cn, getNestedError } from '@/lib/utils'
import { TeacherClassroomCurricularAreaCycle } from '@/types/academic/teacher-classroom-area-cycle'
import { Question, QuestionWithScore } from '@/types/application-form'
import { ApplicationFormStatus } from '@/types/application-form/application-form'
import { BreadcrumbItem } from '@/types/core'
import { LearningSession } from '@/types/learning-session'
import { Head, useForm } from '@inertiajs/react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Calendar as CalendarIcon } from 'lucide-react'
import { useEffect } from 'react'

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Fichas de Aplicación',
    href: '/teacher/application-forms'
  },
  {
    title: 'Crear Ficha',
    href: '/teacher/application-forms/create'
  }
]

interface CreateApplicationFormProps {
  learning_session: LearningSession
  teacher_classroom_curricular_area_cycle: TeacherClassroomCurricularAreaCycle
  questions: Question[]
}

export default function ApplicationsForm({ learning_session, teacher_classroom_curricular_area_cycle, questions }: CreateApplicationFormProps) {
  // Estados para manejar las fechas
  const today = new Date()
  const startDate = today
  const endDate = (() => {
    const inOneWeek = new Date(today)
    inOneWeek.setDate(inOneWeek.getDate() + 8)
    return inOneWeek
  })()

  // Función para formatear fechas de string a Date
  const parseDateString = (date: Date | string | undefined): Date => {
    if (!date) return new Date()
    if (date instanceof Date) return date
    if (typeof date === 'string') {
      try {
        // Handle ISO date strings
        if (date.includes('T')) {
          return new Date(date)
        }
        // Handle YYYY-MM-DD format
        const [year, month, day] = date.split('-').map(Number)
        return new Date(year, month - 1, day)
      } catch (error) {
        console.error('Error parsing date:', error)
      }
    }
    return new Date()
  }

  const dateLocale = es

  const { data, setData, post, processing, errors, reset } = useForm<{
    learning_session_id: number
    teacher_classroom_curricular_area_cycle_id: number
    competency_id: number

    name: string
    description: string
    start_date: string
    end_date: string
    status: string
    score_max: number
    questions: QuestionWithScore[]
  }>({
    learning_session_id: learning_session.id,
    teacher_classroom_curricular_area_cycle_id: teacher_classroom_curricular_area_cycle.id,
    competency_id: learning_session.competency_id,

    name: '',
    description: '',
    start_date: toUTCDateString(startDate),
    end_date: toUTCDateString(endDate),
    status: 'draft',
    score_max: 0,
    questions: []
  })

  useEffect(() => {
    const totalScore = data.questions.reduce((sum, q) => sum + (q.score || 0), 0)
    setData('score_max', totalScore)
  }, [data.questions])

  /** Manejo de cambios en fechas */
  const handleDateChange = (date: Date | undefined, field: 'start_date' | 'end_date') => {
    if (!date) return

    setData(field, toUTCDateString(date))

    // Si se cambia la fecha de inicio, actualizar la de fin si es necesario
    if (field === 'start_date' && date > endDate) {
      const newEndDate = new Date(date)
      newEndDate.setDate(newEndDate.getDate() + 7)
      setData('end_date', toUTCDateString(newEndDate))
    }
  }

  const handleQuestionToggle = (questionId: number, isChecked: boolean) => {
    // Obtener las preguntas actuales
    const currentQuestions = [...(data.questions || [])]

    if (isChecked) {
      // Buscar la pregunta en la lista de preguntas disponibles
      const question = questions.find((q) => q.id === questionId)
      if (!question) return

      // Verificar si la pregunta ya existe en el formulario
      const existingQuestionIndex = currentQuestions.findIndex((q) => q.id === questionId)

      if (existingQuestionIndex >= 0) {
        // Actualizar pregunta existente
        const updatedQuestions = [...currentQuestions]
        updatedQuestions[existingQuestionIndex] = {
          ...updatedQuestions[existingQuestionIndex],
          score: 1
        }
        setData('questions', updatedQuestions)
      } else {
        // Agregar nueva pregunta
        const newQuestion: QuestionWithScore = {
          id: questionId,
          name: question.name || 'Pregunta sin nombre',
          description: question.description || '',
          question_type_id: question.question_type_id || 1, // Valor por defecto para tipo de pregunta
          capability_id: question.capability_id,
          difficulty: question.difficulty || 'medium', // Valor por defecto
          level: question.level || 'primary', // Valor por defecto
          score: 1,
          points_store: 0,
          order: currentQuestions.length + 1,
          options:
            question.options?.map((opt) => ({
              id: opt.id,
              value: opt.value,
              is_correct: opt.is_correct
            })) || [] // Asegurar que siempre haya un array de opciones
        }
        setData('questions', [...currentQuestions, newQuestion])
      }
    } else {
      // Eliminar pregunta
      const filteredQuestions = currentQuestions.filter((q) => q.id !== questionId).map((q, index) => ({ ...q, order: index }))

      setData('questions', filteredQuestions)
    }
  }

  const handleOrderChange = (questionId: number, newOrder: number) => {
    if (isNaN(newOrder) || newOrder < 0) return

    const currentQuestions = [...(data.questions || [])]
    const questionIndex = currentQuestions.findIndex((q) => q.id === questionId)

    if (questionIndex === -1) return

    // Crear una copia de las preguntas actuales
    const reorderedQuestions = [...currentQuestions]
    const [movedQuestion] = reorderedQuestions.splice(questionIndex, 1)

    // Actualizar el orden de la pregunta movida
    movedQuestion.order = Math.max(0, newOrder)

    // Actualizar el orden de las demás preguntas
    reorderedQuestions.forEach((q) => {
      if (q.order >= newOrder && q.id !== questionId) {
        q.order++
      }
    })

    // Insertar la pregunta en su nueva posición
    reorderedQuestions.splice(newOrder, 0, movedQuestion)

    // Ordenar las preguntas por su orden
    reorderedQuestions.sort((a, b) => a.order - b.order)

    // Actualizar los órdenes para que sean secuenciales
    const orderedQuestions = reorderedQuestions.map((q, index) => ({
      ...q,
      order: index
    }))

    setData('questions', orderedQuestions)

    // Obtener la pregunta que se está editando
    const currentQuestion = data.questions.find((q) => q.id === questionId)
    if (!currentQuestion) return

    // Crear un array temporal sin la pregunta actual
    const otherQuestions = data.questions.filter((q) => q.id !== questionId)

    // Ordenar las demás preguntas por su orden actual
    const sortedQuestions = [...otherQuestions].sort((a, b) => a.order - b.order)

    // Encontrar la posición donde insertar la pregunta
    const insertIndex = Math.min(newOrder - 1, sortedQuestions.length)

    // Insertar la pregunta en la nueva posición con el orden correcto
    sortedQuestions.splice(insertIndex, 0, {
      ...currentQuestion,
      order: newOrder
    })

    // Reasignar órdenes secuenciales
    const updatedQuestions = sortedQuestions.map((q, index) => ({
      ...q,
      order: index + 1
    }))

    setData('questions', updatedQuestions)
  }

  const handleScoreChange = (question: Question, value: string) => {
    const scoreValue = parseFloat(value) || 0
    const multiplier =
      {
        easy: 0.5,
        medium: 1,
        hard: 1.5
      }[question.difficulty] || 0

    const pointsStoreValue = scoreValue * multiplier

    setData(
      'questions',
      data.questions.map((q) => (q.id === question.id ? { ...q, score: scoreValue, points_store: pointsStoreValue } : q))
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    post(route('teacher.application-forms.store'), {
      onSuccess: () => {
        reset()
      }
    })
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title='Crear Ficha de Aplicación' />
      <FlashMessages />

      <div className='flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-6'>
        <form onSubmit={handleSubmit} className='space-y-6'>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            {/* Campo: Área Curricular */}
            <div className='space-y-2'>
              <Label htmlFor='teacher_classroom_curricular_area_id'>Área Curricular</Label>
              <Input
                defaultValue={
                  teacher_classroom_curricular_area_cycle.classroom?.level +
                  ' ' +
                  teacher_classroom_curricular_area_cycle.classroom?.grade +
                  ' ' +
                  teacher_classroom_curricular_area_cycle.classroom?.section +
                  ' - ' +
                  teacher_classroom_curricular_area_cycle.curricular_area_cycle?.curricular_area?.name
                }
                readOnly
              />
            </div>

            {/* Campo: Competencia */}
            <div className='space-y-2'>
              <Label htmlFor='competency_id'>Competencia</Label>
              <Input defaultValue={learning_session?.competency?.name} readOnly />
              <InputError message={errors.competency_id} className='mt-1' />
            </div>
          </div>

          {/* Campos Ficha de Aplicación */}
          <h2 className='text-xl font-bold'>Ficha de Aplicación</h2>

          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            {/* Campo: Título */}
            <div className='col-span-2 space-y-2'>
              <Label htmlFor='name'>Título</Label>
              <Input
                id='name'
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
                placeholder='Ej: Evaluación de Matemáticas - Unidad 1'
              />
              <InputError message={errors.name} className='mt-1' />
            </div>

            {/* Campo: Fecha de Inicio */}
            <div className='space-y-2'>
              <Label>Fecha de Inicio</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant='outline' className={cn('w-full justify-start text-left font-normal', !data.start_date && 'text-muted-foreground')}>
                    <CalendarIcon className='mr-2 h-4 w-4' />
                    {data.start_date ? (
                      format(parseDateString(data.start_date), 'PPP', { locale: dateLocale })
                    ) : (
                      <span>Selecciona una fecha de inicio</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-auto p-0' align='start'>
                  <Calendar
                    mode='single'
                    selected={data.start_date ? parseDateString(data.start_date) : undefined}
                    onSelect={(date) => handleDateChange(date, 'start_date')}
                    initialFocus
                    locale={dateLocale}
                    disabled={(date) => date < new Date() || date < new Date('1900-01-01')}
                  />
                </PopoverContent>
              </Popover>
              <InputError message={errors.start_date} className='mt-1' />
            </div>

            {/* Campo: Fecha de Fin */}
            <div className='space-y-2'>
              <Label>Fecha de Fin</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant='outline' className={cn('w-full justify-start text-left font-normal', !data.end_date && 'text-muted-foreground')}>
                    <CalendarIcon className='mr-2 h-4 w-4' />
                    {data.end_date ? format(parseDateString(data.end_date), 'PPP', { locale: dateLocale }) : <span>Selecciona una fecha de fin</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-auto p-0' align='start'>
                  <Calendar
                    mode='single'
                    selected={data.end_date ? parseDateString(data.end_date) : undefined}
                    onSelect={(date) => handleDateChange(date, 'end_date')}
                    initialFocus
                    locale={dateLocale}
                    disabled={(date) => {
                      const start = data.start_date ? parseDateString(data.start_date) : new Date()
                      return date < start || date < new Date('1900-01-01')
                    }}
                  />
                </PopoverContent>
              </Popover>
              <InputError message={errors.end_date} className='mt-1' />
            </div>

            {/* Campo: Puntaje Máximo */}
            <div className='space-y-2'>
              <Label htmlFor='score_max'>Puntaje Máximo</Label>
              <div className='border-input bg-background ring-offset-background flex h-10 w-full rounded-md border px-3 py-2 text-sm'>
                {data.score_max} puntos
              </div>
              <p className='text-muted-foreground text-sm'>Puntaje total basado en las preguntas seleccionadas</p>
            </div>

            {/* Campo: */}

            {/* Campo: Estado */}
            <div className='space-y-2'>
              <Label htmlFor='status'>Estado</Label>
              <Select value={data.status} onValueChange={(value: ApplicationFormStatus) => setData('status', value)}>
                <SelectTrigger>
                  <SelectValue placeholder='Selecciona un estado' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='draft'>Borrador</SelectItem>
                  <SelectItem value='scheduled'>Programado</SelectItem>
                  <SelectItem value='active'>Activo</SelectItem>
                  <SelectItem value='inactive'>Inactivo</SelectItem>
                  <SelectItem value='archived'>Archivado</SelectItem>
                </SelectContent>
              </Select>
              <InputError message={errors.status} className='mt-1' />
            </div>
          </div>

          {/* Campo: Descripción */}
          <div className='space-y-2'>
            <Label htmlFor='description'>Descripción</Label>
            <Textarea
              id='description'
              value={data.description}
              onChange={(e) => setData('description', e.target.value)}
              placeholder='Describe el propósito y contenido de esta ficha de aplicación...'
              className='min-h-[120px]'
            />
            <InputError message={errors.description} className='mt-1' />
          </div>

          {/* Campo: Preguntas */}
          <div className='space-y-4'>
            <h2 className='text-xl font-bold'>Preguntas</h2>
            <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
              {questions.map((question, index) => {
                const questionInForm = data.questions.find((q) => q.id === question.id)
                const isChecked = !!questionInForm

                return (
                  <div key={question.id} className='flex items-start gap-4 rounded-lg border p-4'>
                    <div className='flex-shrink-0 pt-1'>
                      <Checkbox
                        id={`question-${question.id}`}
                        checked={isChecked}
                        onCheckedChange={(checked) => handleQuestionToggle(question.id, checked as boolean)}
                      />
                    </div>
                    <div className='flex-1 space-y-2'>
                      <Label htmlFor={`question-${question.id}`} className='text-base'>
                        {question.name}
                      </Label>
                      <p className='text-muted-foreground text-sm'>{question.description}</p>

                      {isChecked && (
                        <div className='mt-2 grid grid-cols-1 gap-4 md:grid-cols-3'>
                          <div className='space-y-2'>
                            <Label htmlFor={`order-${question.id}`}>Orden</Label>
                            <Input
                              id={`order-${question.id}`}
                              type='number'
                              min='1'
                              value={questionInForm?.order || ''}
                              onChange={(e) => {
                                const newOrder = parseInt(e.target.value) || 1
                                handleOrderChange(question.id, newOrder)
                              }}
                              className='w-20'
                            />
                            <InputError message={getNestedError(errors, `questions.${index}.order`)} className='mt-1' />
                          </div>
                          <div className='space-y-2'>
                            <Label htmlFor={`score-${question.id}`}>Puntaje</Label>
                            <Input
                              id={`score-${question.id}`}
                              type='number'
                              min='0'
                              step='0.5'
                              value={questionInForm?.score || 1}
                              onChange={(e) => handleScoreChange(question, e.target.value)}
                              className='w-24'
                            />
                            <InputError message={getNestedError(errors, `questions.${index}.score`)} className='mt-1' />
                          </div>
                          <div className='space-y-2'>
                            <Label htmlFor={`points-${question.id}`}>P. tienda</Label>
                            <Input
                              id={`points-${question.id}`}
                              type='number'
                              min='0'
                              step='0.5'
                              value={questionInForm?.points_store || 0}
                              className='w-24'
                            />
                            <InputError message={getNestedError(errors, `questions.${index}.points_store`)} className='mt-1' />{' '}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Botones de acción */}
          <div className='flex items-center justify-between'>
            <div className='text-muted-foreground text-sm'>
              Puntaje total: {data.questions.reduce((sum, q) => sum + (q.score || 0), 0).toFixed(2)} / {data.score_max}
            </div>
            <Button type='submit' disabled={processing}>
              {processing ? 'Guardando...' : 'Guardar Ficha de Aplicación'}
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  )
}
