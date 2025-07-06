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
import { TeacherClassroomCurricularArea } from '@/types/academic/teacher-classroom-area'
import { BreadcrumbItem } from '@/types/core'
import { Head, useForm } from '@inertiajs/react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Calendar as CalendarIcon } from 'lucide-react'
import { useState } from 'react'

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
  teacherClassroomAreas: TeacherClassroomCurricularArea[]
}

export default function ApplicationsForm({ teacherClassroomAreas }: CreateApplicationFormProps) {
  const [startDate, setStartDate] = useState<Date | undefined>(new Date())
  const [endDate, setEndDate] = useState<Date | undefined>(() => {
    const date = new Date()
    date.setDate(date.getDate() + 7) // 7 días por defecto
    return date
  })
  const dateLocale = es

  const { data, setData, post, processing, errors, reset } = useForm({
    title: '',
    description: '',
    start_date: startDate?.toISOString().split('T')[0] || '',
    end_date: endDate?.toISOString().split('T')[0] || '',
    status: '',
    score_max: 100,
    teacher_classroom_curricular_area_id: ''
  })

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

      <div className='flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-6'>
        <h1 className='text-2xl font-bold'>Crear Nueva Ficha de Aplicación</h1>

        <form onSubmit={handleSubmit} className='space-y-6'>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            {/* Campo: Título */}
            <div className='space-y-2'>
              <Label htmlFor='title'>Título</Label>
              <Input
                id='title'
                value={data.title}
                onChange={(e) => setData('title', e.target.value)}
                placeholder='Ej: Evaluación de Matemáticas - Unidad 1'
              />
              <InputError message={errors.title} className='mt-1' />
            </div>

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
                    selected={startDate}
                    onSelect={(date) => {
                      setStartDate(date)
                      setData('start_date', date?.toISOString().split('T')[0] || '')
                    }}
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
                    selected={endDate}
                    onSelect={(date) => {
                      setEndDate(date)
                      setData('end_date', date?.toISOString().split('T')[0] || '')
                    }}
                    startMonth={startDate || new Date()}
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
              <Select value={data.status} onValueChange={(value) => setData('status', value)}>
                <SelectTrigger>
                  <SelectValue placeholder='Selecciona un estado' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='draft'>Borrador</SelectItem>
                  <SelectItem value='published'>Publicado</SelectItem>
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
              {processing ? 'Guardando...' : 'Guardar Ficha'}
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  )
}
