import InputError from '@/components/input-error'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import AppLayout from '@/layouts/app-layout'
import { cn, getNestedError } from '@/lib/utils'
import { Competency } from '@/types/academic'
import { TeacherClassroomCurricularAreaCycle } from '@/types/academic/teacher-classroom-area-cycle'
import { ApplicationFormStatus } from '@/types/application-form/application-form'
import { BreadcrumbItem } from '@/types/core'
import { Question } from '@/types/question'
import { Head, useForm } from '@inertiajs/react'
import { endOfDay, format, startOfDay } from 'date-fns'
import { es } from 'date-fns/locale'
import { Calendar as CalendarIcon } from 'lucide-react'
import { useEffect, useState } from 'react'

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
  teacherClassroomAreaCycles: TeacherClassroomCurricularAreaCycle[]
  questions: Question[]
}

type QuestionWithScore = {
  id: number
  score: number
  points_store: number
  order: number
}

export default function ApplicationsForm({ teacherClassroomAreaCycles, questions }: CreateApplicationFormProps) {
  const startDate = new Date()
  const endDate = new Date()
  endDate.setDate(startDate.getDate() + 7)

  const [learningSessionDate, setLearningSessionDate] = useState<Date | undefined>(new Date())
  const [competencies, setCompetencies] = useState<Competency[]>([])
  const [questionsByCompetency, setQuestionsByCompetency] = useState<Question[]>([])

  const dateLocale = es

  const { data, setData, post, processing, errors, reset } = useForm({
    teacher_classroom_curricular_area_id: '',
    /* Campos Sesión de Aprendizaje */
    ls_name: '',
    ls_purpose_learning: '',
    ls_application_date: learningSessionDate?.toISOString().split('T')[0] || '',
    ls_competency_id: '',
    /* Campos Ficha de Aplicación */
    name: '',
    description: '',
    start_date: startDate,
    end_date: endDate ? endOfDay(endDate) : undefined,
    status: 'draft',
    score_max: 0,
    questions: [] as QuestionWithScore[]
  })

  useEffect(() => {
    setCompetencies(
      teacherClassroomAreaCycles.find((area) => area.id === Number(data.teacher_classroom_curricular_area_id))?.curricular_area_cycle?.curricular_area
        ?.competencies || []
    )
    setData('ls_competency_id', '')
  }, [data.teacher_classroom_curricular_area_id])

  useEffect(() => {
    const competency = competencies.find((c) => c.id === Number(data.ls_competency_id))
    const questionsFiltered = questions.filter((q) => q.capability?.competency_id === Number(data.ls_competency_id))
    if (competency) {
      setQuestionsByCompetency(questionsFiltered)
    }
  }, [data.ls_competency_id])

  useEffect(() => {
    const totalScore = data.questions.reduce((sum, q) => sum + (q.score || 0), 0)
    setData('score_max', totalScore)
  }, [data.questions])

  const handleQuestionToggle = (questionId: number, isChecked: boolean) => {
    if (isChecked) {
      setData('questions', [
        ...data.questions,
        {
          id: questionId,
          score: 1,
          points_store: 0,
          order: data.questions.length
        }
      ])
    } else {
      const newQuestions = data.questions.filter((q: QuestionWithScore) => q.id !== questionId).map((q, index) => ({ ...q, order: index }))
      setData('questions', newQuestions)
    }
  }

  const handleOrderChange = (questionId: number, newOrder: number) => {
    // Asegurar que el orden sea un número positivo
    newOrder = Math.max(1, newOrder)

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

  const handleScoreChange = (questionId: number, value: string) => {
    const scoreValue = parseFloat(value) || 0
    setData(
      'questions',
      data.questions.map((q: QuestionWithScore) => (q.id === questionId ? { ...q, score: scoreValue } : q))
    )
  }

  const handlePointsStoreChange = (questionId: number, value: string) => {
    const pointsValue = parseFloat(value) || 0
    setData(
      'questions',
      data.questions.map((q: QuestionWithScore) => (q.id === questionId ? { ...q, points_store: pointsValue } : q))
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Calculate total score from all questions
    const totalScore = data.questions.reduce((sum, q) => sum + (q.score || 0), 0)

    post(route('teacher.application-forms.store'), {
      onBefore: () => {
        setData('start_date', startOfDay(startDate))
        setData('end_date', endOfDay(endDate))
        setData('score_max', totalScore)
      },
      onSuccess: () => {
        reset()
      }
    })
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title='Crear Ficha de Aplicación' />

      <div className='flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-6'>
        <form onSubmit={handleSubmit} className='space-y-6'>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            {/* Campo: Área Curricular */}
            <div className='space-y-2'>
              <Label htmlFor='teacher_classroom_curricular_area_id'>Área Curricular</Label>
              <Select
                value={data.teacher_classroom_curricular_area_id}
                onValueChange={(value) => setData('teacher_classroom_curricular_area_id', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder='Selecciona un área curricular' />
                </SelectTrigger>
                <SelectContent>
                  {teacherClassroomAreaCycles.map((area) => (
                    <SelectItem key={area.id} value={area.id.toString()}>
                      {area.curricular_area_cycle?.curricular_area?.name} - {area.classroom?.level} {area.classroom?.grade} {area.classroom?.section}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <InputError message={errors.teacher_classroom_curricular_area_id} className='mt-1' />
            </div>

            {/* Campo: Competencia */}
            <div className='space-y-2'>
              <Label htmlFor='ls_competency_id'>Competencia</Label>
              <Select value={data.ls_competency_id} onValueChange={(value) => setData('ls_competency_id', value)}>
                <SelectTrigger>
                  <SelectValue placeholder='Selecciona una competencia' />
                </SelectTrigger>
                <SelectContent>
                  {competencies.map((competency) => (
                    <SelectItem key={competency.id} value={competency.id.toString()}>
                      {competency.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <InputError message={errors.ls_competency_id} className='mt-1' />
            </div>
          </div>

          {/* Sesión de aprendizaje */}
          <h2 className='text-xl font-bold'>Sesión de Aprendizaje</h2>

          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            {/* Campo: Título */}
            <div className='space-y-2'>
              <Label htmlFor='ls_name'>Título</Label>
              <Input
                id='ls_name'
                value={data.ls_name}
                onChange={(e) => setData('ls_name', e.target.value)}
                placeholder='Ej: Evaluación de Matemáticas - Unidad 1'
              />
              <InputError message={errors.ls_name} className='mt-1' />
            </div>

            {/* Campo: Propósito de la sesión */}
            <div className='space-y-2'>
              <Label htmlFor='ls_purpose_learning'>Propósito de la sesión</Label>
              <Input
                id='ls_purpose_learning'
                value={data.ls_purpose_learning}
                onChange={(e) => setData('ls_purpose_learning', e.target.value)}
                placeholder='Ej: Evaluación de Matemáticas - Unidad 1'
              />
              <InputError message={errors.ls_purpose_learning} className='mt-1' />
            </div>

            {/* Campo: Fecha de la sesión */}
            <div className='space-y-2'>
              <Label htmlFor='ls_application_date'>Fecha de la sesión</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant='outline'
                    className={cn('w-full justify-start text-left font-normal', !learningSessionDate && 'text-muted-foreground')}
                  >
                    <CalendarIcon className='mr-2 h-4 w-4' />
                    {learningSessionDate ? format(learningSessionDate, 'PPP', { locale: dateLocale }) : <span>Selecciona una fecha</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-auto p-0'>
                  <Calendar
                    mode='single'
                    selected={learningSessionDate}
                    onSelect={(date) => {
                      setLearningSessionDate(date)
                      setData('ls_application_date', date?.toISOString().split('T')[0] || '')
                    }}
                    disabled={{ before: new Date() }}
                    startMonth={new Date()}
                  />
                </PopoverContent>
              </Popover>
              <InputError message={errors.ls_application_date} className='mt-1' />
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
                  <Button variant='outline' className={cn('w-full justify-start text-left font-normal', !startDate && 'text-muted-foreground')}>
                    <CalendarIcon className='mr-2 h-4 w-4' />
                    {startDate ? format(startDate, 'PPP', { locale: dateLocale }) : <span>Selecciona una fecha</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-auto p-0'>
                  <Calendar
                    mode='single'
                    selected={data.start_date}
                    onSelect={(date) => {
                      date && setData('start_date', date)
                    }}
                    disabled={{ before: new Date() }}
                    startMonth={new Date()}
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
                  <Button variant='outline' className={cn('w-full justify-start text-left font-normal', !endDate && 'text-muted-foreground')}>
                    <CalendarIcon className='mr-2 h-4 w-4' />
                    {endDate ? format(endDate, 'PPP', { locale: dateLocale }) : <span>Selecciona una fecha</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-auto p-0'>
                  <Calendar
                    mode='single'
                    selected={data.end_date}
                    onSelect={(date) => {
                      date && setData('end_date', date)
                    }}
                    disabled={{ before: startDate || new Date() }}
                    startMonth={startDate}
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
              {questionsByCompetency.map((question, index) => {
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
                              onChange={(e) => handleScoreChange(question.id, e.target.value)}
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
                              onChange={(e) => handlePointsStoreChange(question.id, e.target.value)}
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
