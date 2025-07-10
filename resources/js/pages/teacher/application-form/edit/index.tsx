import InputError from '@/components/input-error'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import AppLayout from '@/layouts/app-layout'
import { cn } from '@/lib/utils'
import { Competency } from '@/types/academic'
import { TeacherClassroomCurricularAreaCycle } from '@/types/academic/teacher-classroom-area-cycle'
import { ApplicationFormStatus } from '@/types/application-form/application-form'
import { BreadcrumbItem } from '@/types/core'
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

interface ApplicationFormProps {
  applicationForm?: any
  teacherClassroomAreas: TeacherClassroomCurricularAreaCycle[]
  isEdit?: boolean
}

export default function EditApplicationForm({ applicationForm, teacherClassroomAreas, isEdit = false }: ApplicationFormProps) {
  const defaultStartDate = new Date()
  const defaultEndDate = new Date()
  defaultEndDate.setDate(defaultStartDate.getDate() + 7)

  const [learningSessionDate, setLearningSessionDate] = useState<Date>(() => {
    try {
      return applicationForm?.learning_session?.application_date ? new Date(applicationForm.learning_session.application_date) : new Date()
    } catch (e) {
      console.error('Error initializing learning session date:', e)
      return new Date()
    }
  })

  // Handle date selection safely
  const handleDateSelect = (date: Date | undefined, field: 'start_date' | 'end_date' | 'ls_application_date') => {
    if (date) {
      if (field === 'ls_application_date') {
        setLearningSessionDate(date)
        setData('ls_application_date', date.toISOString().split('T')[0])
      } else {
        setData(field, date)
      }
    }
  }
  const [competencies, setCompetencies] = useState<Competency[]>(applicationForm?.teacherClassroomCurricularArea?.curricularArea?.competencies || [])
  const dateLocale = es

  const { data, setData, put, post, processing, errors, reset } = useForm({
    teacher_classroom_curricular_area_id: applicationForm?.teacher_classroom_curricular_area_id || '',
    /* Campos Sesión de Aprendizaje */
    ls_name: applicationForm?.learning_session?.name || '',
    ls_purpose_learning: applicationForm?.learning_session?.purpose_learning || '',
    ls_application_date: learningSessionDate.toISOString().split('T')[0],
    ls_competency_id: applicationForm?.learning_session?.competency_id || '',
    /* Campos Ficha de Aplicación */
    name: applicationForm?.name || '',
    description: applicationForm?.description || '',
    start_date: applicationForm?.start_date ? new Date(applicationForm.start_date) : defaultStartDate,
    end_date: applicationForm?.end_date ? new Date(applicationForm.end_date) : defaultEndDate,
    status: (applicationForm?.status as ApplicationFormStatus) || 'draft',
    score_max: applicationForm?.score_max || 100,
    _method: isEdit ? 'put' : 'post'
  })

  useEffect(() => {
    setCompetencies(
      teacherClassroomAreas.find((area) => area.id === Number(data.teacher_classroom_curricular_area_id))?.curricular_area?.competencies || []
    )
    setData('ls_competency_id', '')
  }, [data.teacher_classroom_curricular_area_id])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Prepare form data with proper date formatting
    const formData = new FormData()

    // Add all form fields to FormData
    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value as string | Blob)
      }
    })

    // Handle date fields
    if (data.start_date) {
      formData.set('start_date', startOfDay(new Date(data.start_date)).toISOString())
    }
    if (data.end_date) {
      formData.set('end_date', endOfDay(new Date(data.end_date)).toISOString())
    }
    formData.set('ls_application_date', learningSessionDate.toISOString().split('T')[0])

    // Use the appropriate HTTP method based on the operation
    const submit = () =>
      isEdit
        ? put(route('teacher.application-forms.update', applicationForm.id), formData as any)
        : post(route('teacher.application-forms.store'), formData as any)

    submit()
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={isEdit ? 'Editar Ficha de Aplicación' : 'Crear Ficha de Aplicación'} />

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
                  {teacherClassroomAreas.map((area) => (
                    <SelectItem key={area.id} value={area.id.toString()}>
                      {area.curricular_area?.name} - {area.classroom?.level} {area.classroom?.grade} {area.classroom?.section}
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
                    onSelect={(date) => handleDateSelect(date, 'ls_application_date')}
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
                  <Button variant='outline' className={cn('w-full justify-start text-left font-normal', !data.start_date && 'text-muted-foreground')}>
                    <CalendarIcon className='mr-2 h-4 w-4' />
                    {data.start_date ? format(new Date(data.start_date), 'PPP', { locale: dateLocale }) : <span>Selecciona una fecha</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-auto p-0'>
                  <Calendar
                    mode='single'
                    selected={data.start_date ? new Date(data.start_date) : undefined}
                    onSelect={(date) => handleDateSelect(date, 'start_date')}
                    disabled={{ before: new Date() }}
                    fromMonth={new Date()}
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
                    {data.end_date ? format(new Date(data.end_date), 'PPP', { locale: dateLocale }) : <span>Selecciona una fecha</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-auto p-0'>
                  <Calendar
                    mode='single'
                    selected={data.end_date ? new Date(data.end_date) : undefined}
                    onSelect={(date) => handleDateSelect(date, 'end_date')}
                    disabled={{ before: data.start_date ? new Date(data.start_date) : new Date() }}
                    fromMonth={data.start_date ? new Date(data.start_date) : new Date()}
                  />
                </PopoverContent>
              </Popover>
              <InputError message={errors.end_date} className='mt-1' />
            </div>

            {/* Campo: Puntaje Máximo */}
            <div className='space-y-2'>
              <Label htmlFor='score_max'>Puntaje Máximo</Label>
              <Input id='score_max' type='number' min='0' value={data.score_max} onChange={(e) => setData('score_max', Number(e.target.value))} />
              <InputError message={errors.score_max} className='mt-1' />
            </div>

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

          {/* Botones de acción */}
          <div className='flex justify-end gap-4 pt-4'>
            <Button type='button' variant='outline' onClick={() => window.history.back()}>
              Cancelar
            </Button>
            <Button type='submit' disabled={processing}>
              {processing ? 'Guardando...' : isEdit ? 'Actualizar Ficha' : 'Crear Ficha'}
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  )
}
