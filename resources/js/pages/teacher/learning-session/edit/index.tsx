import InputError from '@/components/input-error'
import FlashMessages from '@/components/organisms/flash-messages'
import { MultiSelect } from '@/components/organisms/multi-select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import AppLayout from '@/layouts/app-layout'
import { tStatus } from '@/lib/status-translation'
import { generateTimeOptions, getValidEndTime, isEndAfterStart, isEndDateValid, isValidTimeForDate } from '@/lib/time-utils'
import { useTranslations } from '@/lib/translator'
import { cn } from '@/lib/utils'
import { Capability, Classroom, Competency, TeacherClassroomCurricularAreaCycle } from '@/types/academic'
import { CurricularAreaCycle } from '@/types/academic/curricular-area-cycle'
import { BreadcrumbItem, SharedData } from '@/types/core'
import { LearningSession } from '@/types/learning-session'
import { Head, Link, useForm, usePage } from '@inertiajs/react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { LoaderCircle } from 'lucide-react'
import { useEffect, useState } from 'react'

type PageProps = {
  learning_session: LearningSession
  teacher_classroom_curricular_area_cycles: TeacherClassroomCurricularAreaCycle[]
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Sesiones de Aprendizaje',
    href: 'teacher/learning-session'
  }
]

export default function LearningSessionEdit({ learning_session, teacher_classroom_curricular_area_cycles }: PageProps) {
  const { educational_institution, teacher_classroom_curricular_area_cycle } = learning_session
  const { auth } = usePage<SharedData>().props
  const { t } = useTranslations()

  const [classrooms, setClassrooms] = useState<Classroom[]>([])
  const [curricularAreas, setCurricularAreas] = useState<CurricularAreaCycle[]>([])
  const [competencies, setCompetencies] = useState<Competency[]>([])
  const [capabilities, setCapabilities] = useState<Capability[]>([])
  const [availableStartTimes, setAvailableStartTimes] = useState<string[]>([])
  const [availableEndTimes, setAvailableEndTimes] = useState<string[]>([])

  const dateLocale = es

  const { data, setData, put, hasErrors, processing, errors, clearErrors } = useForm({
    redirect: (learning_session?.application_form ?? 0) === 0,
    educational_institution_id: educational_institution?.id,
    status: learning_session.status,
    registration_status: learning_session.registration_status || 'active',
    name: learning_session.name,
    start_date: learning_session.start_date ? format(new Date(learning_session.start_date), 'yyyy-MM-dd') : '',
    start_time: learning_session.start_date ? format(new Date(learning_session.start_date), 'HH:mm') : '',
    end_date: learning_session.end_date ? format(new Date(learning_session.end_date), 'yyyy-MM-dd') : '',
    end_time: learning_session.end_date ? format(new Date(learning_session.end_date), 'HH:mm') : '',
    teacher_classroom_curricular_area_cycle_id: learning_session.teacher_classroom_curricular_area_cycle_id.toString(),
    classroom_id: teacher_classroom_curricular_area_cycle?.classroom_id.toString(),
    curricular_area_cycle_id: teacher_classroom_curricular_area_cycle?.curricular_area_cycle_id.toString(),
    competency_id: learning_session.competency_id.toString(),
    capability_ids: learning_session.capabilities?.map((capability) => capability.id.toString()) || [],
    performances: learning_session.performances,
    purpose_learning: learning_session.purpose_learning,
    start_sequence: learning_session.start_sequence || '',
    application_form_id: learning_session?.application_form?.id.toString() || '',
    end_sequence: learning_session.end_sequence || ''
  })

  // UseEffect para cargar aulas disponibles
  useEffect(() => {
    const validClassrooms = (teacher_classroom_curricular_area_cycles || []).flatMap((area) => (area.classroom ? [area.classroom] : []))

    // Eliminar duplicados por ID
    const uniqueClassrooms = Array.from(new Map(validClassrooms.map((item) => [item.id, item])).values())

    setClassrooms(uniqueClassrooms)
  }, [teacher_classroom_curricular_area_cycles])

  // UseEffect para cargar áreas curriculares disponibles
  useEffect(() => {
    const validCurricularAreas = (teacher_classroom_curricular_area_cycles || [])
      .filter((area) => area.classroom_id === Number(data.classroom_id))
      .flatMap((area) => (area.curricular_area_cycle ? [area.curricular_area_cycle] : []))
      .filter((area) => area !== undefined)

    setCurricularAreas(validCurricularAreas)
    setData('curricular_area_cycle_id', '')
    setCompetencies([])
    setCapabilities([])
  }, [data.classroom_id])

  // UseEffect para cargar competencias disponibles
  useEffect(() => {
    setCompetencies(
      teacher_classroom_curricular_area_cycles.find((area) => area.curricular_area_cycle_id === Number(data.curricular_area_cycle_id))
        ?.curricular_area_cycle?.curricular_area?.competencies || []
    )

    setData('competency_id', '')
    setCapabilities([])
  }, [data.curricular_area_cycle_id])

  // UseEffect para cargar capacidades disponibles
  useEffect(() => {
    setCapabilities(
      teacher_classroom_curricular_area_cycles
        .find((area) => area.curricular_area_cycle_id === Number(data.curricular_area_cycle_id))
        ?.curricular_area_cycle?.curricular_area?.competencies?.find((competency) => competency.id === Number(data.competency_id))?.capabilities || []
    )
    setData('capability_ids', [])
  }, [data.competency_id])

  // UseEffect para cargar el ID del área curricular y la aula
  useEffect(() => {
    const teacherClassroomAreaCycle = teacher_classroom_curricular_area_cycles.find(
      (area) => area.curricular_area_cycle_id === Number(data.curricular_area_cycle_id) && area.classroom_id === Number(data.classroom_id)
    )

    if (!teacherClassroomAreaCycle) {
      return
    }

    setData('teacher_classroom_curricular_area_cycle_id', teacherClassroomAreaCycle.id.toString())
  }, [data.curricular_area_cycle_id, data.classroom_id])

  // Actualizar opciones de tiempo cuando cambia la fecha de inicio
  useEffect(() => {
    const times = generateTimeOptions(data.start_date)
    setAvailableStartTimes(times)

    // Si la hora actual no es válida para la nueva fecha, actualizar a la próxima válida
    if (!isValidTimeForDate(data.start_time, data.start_date) && times.length > 0) {
      setData('start_time', times[0])
    }

    // Validar fecha de fin: si end_date < start_date, actualizar end_date a start_date
    if (data.end_date && !isEndDateValid(data.start_date, data.end_date)) {
      setData('end_date', data.start_date)
    }

    validateDateTime()
  }, [data.start_date])

  // Validar cuando cambia la hora de inicio
  useEffect(() => {
    // Si las fechas son iguales y end_time <= start_time, actualizar end_time
    if (data.start_date === data.end_date && data.end_time && data.start_time) {
      if (!isEndAfterStart(data.start_date, data.start_time, data.end_date, data.end_time)) {
        const validEndTime = getValidEndTime(data.start_time)
        setData('end_time', validEndTime)
      }
    }
    validateDateTime()
  }, [data.start_time])

  // Actualizar opciones de tiempo cuando cambia la fecha de fin
  useEffect(() => {
    // Si las fechas son iguales, filtrar end time options basándose en start time
    const minTime = data.start_date === data.end_date ? data.start_time : undefined
    const times = generateTimeOptions(data.end_date, 'America/Lima', minTime)
    setAvailableEndTimes(times)

    // Si la hora actual no es válida para la nueva fecha, actualizar a la próxima válida
    if (!isValidTimeForDate(data.end_time, data.end_date) && times.length > 0) {
      setData('end_time', times[0])
    }

    validateDateTime()
  }, [data.end_date, data.start_date, data.start_time])

  // Validar cuando cambia la hora de fin
  useEffect(() => {
    validateDateTime()
  }, [data.end_time])

  // Inicializar opciones de tiempo al montar el componente
  useEffect(() => {
    setAvailableStartTimes(generateTimeOptions(data.start_date))
    setAvailableEndTimes(generateTimeOptions(data.end_date))
  }, [])

  // Función para validar y corregir fecha y hora de fin automáticamente
  const validateDateTime = () => {
    if (!data.start_date || !data.start_time || !data.end_date || !data.end_time) {
      return
    }

    // Si fecha de fin es menor a fecha de inicio, actualizar a fecha de inicio
    if (!isEndDateValid(data.start_date, data.end_date)) {
      setData('end_date', data.start_date)
    }

    // Si fechas son iguales y hora de fin <= hora de inicio, actualizar hora de fin
    if (data.start_date === data.end_date && !isEndAfterStart(data.start_date, data.start_time, data.end_date, data.end_time)) {
      const validEndTime = getValidEndTime(data.start_time)
      setData('end_time', validEndTime)
    }
  }

  // UseEffect para cargar datos iniciales
  useEffect(() => {
    if (learning_session) {
      // Setear datos principales
      setData({
        ...data,
        name: learning_session.name,
        status: learning_session.status,
        start_date: learning_session.start_date ? format(new Date(learning_session.start_date), 'yyyy-MM-dd') : '',
        start_time: learning_session.start_date ? format(new Date(learning_session.start_date), 'HH:mm') : '',
        end_date: learning_session.end_date ? format(new Date(learning_session.end_date), 'yyyy-MM-dd') : '',
        end_time: learning_session.end_date ? format(new Date(learning_session.end_date), 'HH:mm') : '',
        purpose_learning: learning_session.purpose_learning,
        performances: learning_session.performances,
        start_sequence: learning_session.start_sequence || '',
        end_sequence: learning_session.end_sequence || '',
        teacher_classroom_curricular_area_cycle_id: learning_session.teacher_classroom_curricular_area_cycle_id?.toString() || '',
        competency_id: learning_session.competency_id?.toString() || '',
        capability_ids: learning_session.capabilities?.map((c) => c.id.toString()) || [],
        application_form_id: learning_session.application_form?.id?.toString() || ''
      })

      // Setear el ID de la aula si está disponible
      if (learning_session.teacher_classroom_curricular_area_cycle?.classroom_id) {
        setData('classroom_id', learning_session.teacher_classroom_curricular_area_cycle.classroom_id.toString())
      }

      // Setear el ID de la área curricular si está disponible
      if (learning_session.teacher_classroom_curricular_area_cycle?.curricular_area_cycle_id) {
        setData('curricular_area_cycle_id', learning_session.teacher_classroom_curricular_area_cycle.curricular_area_cycle_id.toString())
      }

      // Cargar competencias y capacidades si están disponibles
      if (learning_session.competency) {
        setData('competency_id', learning_session.competency.id.toString())
        setData('capability_ids', learning_session.capabilities?.map((c) => c.id.toString()) || [])
      }
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validar y corregir antes de enviar
    validateDateTime()

    // Combine date and time into datetime strings
    const formData = {
      ...data,
      start_date: data.start_date && data.start_time ? `${data.start_date}T${data.start_time}` : data.start_date,
      end_date: data.end_date && data.end_time ? `${data.end_date}T${data.end_time}` : data.end_date
    }

    put(route('teacher.learning-sessions.update', learning_session.id), formData as any)
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('session_learning.title', 'Sesiones de Aprendizaje')} />
      <FlashMessages />

      <div className='flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4'>
        <form onSubmit={handleSubmit} className='space-y-6'>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
            <Label>UGEL: {educational_institution?.ugel}</Label>
            <Label>I.E: {educational_institution?.name}</Label>
            <Label>Docente: {auth.user.name}</Label>
          </div>

          <h2 className='text-xl font-bold'>I. DATOS GENERALES:</h2>

          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            {/* Campo: Título */}
            <div className='space-y-2'>
              <Label htmlFor='name'>{t('Learning Session Name')}</Label>
              <Input
                id='name'
                value={data.name}
                onChange={(e) => {
                  setData('name', e.target.value)
                  clearErrors('name')
                }}
                placeholder='Ej: Evaluación de Matemáticas - Unidad 1'
              />
              <InputError message={errors.name} className='mt-1' />
            </div>

            <div className='grid grid-cols-1 gap-6 space-y-2 md:grid-cols-2'>
              {/* Campo: Fecha de inicio */}
              <div>
                <Label htmlFor='start_date'>{t('Start Date')}</Label>
                <Input
                  id='start_date'
                  type='date'
                  value={data.start_date}
                  onChange={(e) => {
                    setData('start_date', e.target.value || '')
                    clearErrors('start_date')
                  }}
                />
                <InputError message={errors.start_date} className='mt-1' />
              </div>

              {/* Campo: Hora de inicio */}
              <div>
                <Label htmlFor='start_time'>{t('Start Time')}</Label>
                <Select value={data.start_time} onValueChange={(value) => setData('start_time', value)}>
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Selecciona hora' />
                  </SelectTrigger>
                  <SelectContent>
                    {availableStartTimes.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <InputError message={errors.start_time} className='mt-1' />
              </div>
            </div>

            <div className='grid grid-cols-1 gap-6 space-y-2 md:grid-cols-2'>
              {/* Campo: Fecha de fin */}
              <div>
                <Label htmlFor='end_date'>{t('End Date')}</Label>
                <Input
                  id='end_date'
                  type='date'
                  value={data.end_date}
                  onChange={(e) => {
                    setData('end_date', e.target.value || '')
                    clearErrors('end_date')
                  }}
                />
                <InputError message={errors.end_date} className='mt-1' />
              </div>

              {/* Campo: Hora de fin */}
              <div>
                <Label htmlFor='end_time'>{t('End Time')}</Label>
                <Select value={data.end_time} onValueChange={(value) => setData('end_time', value)}>
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Selecciona hora' />
                  </SelectTrigger>
                  <SelectContent>
                    {availableEndTimes.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <InputError message={errors.end_time} className='mt-1' />
              </div>
            </div>

            {/* Campo: Aula */}
            <div className='space-y-2'>
              <Label htmlFor='classroom_id'>Aula</Label>
              <Select value={data.classroom_id} disabled>
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='Selecciona un aula' />
                </SelectTrigger>
                <SelectContent>
                  {classrooms.map((classroom) => (
                    <SelectItem key={classroom.id} value={classroom.id.toString()}>
                      {t(classroom.level)} {t(classroom.grade)} {classroom.section}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <InputError message={errors.classroom_id} className='mt-1' />
            </div>
          </div>

          <h1 className='text-xl font-bold'>II. PROPÓSITOS Y EVIDENCIAS DE APRENDIZAJE</h1>

          <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
            {/* Campo: Área Curricular */}
            <div className='space-y-2'>
              <Label htmlFor='curricular_area_cycle_id'>Área Curricular</Label>
              <Select value={data.curricular_area_cycle_id} disabled>
                <SelectTrigger>
                  <SelectValue placeholder='Selecciona una área curricular' />
                </SelectTrigger>
                <SelectContent>
                  {curricularAreas.map((area) => (
                    <SelectItem key={area.id} value={area.id.toString()}>
                      {area?.curricular_area?.name} - CICLO {area?.cycle?.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <InputError message={errors.curricular_area_cycle_id} className='mt-1' />
            </div>

            {/* Campo: Competencia */}
            <div className='space-y-2'>
              <Label htmlFor='competency_id'>Competencia</Label>
              <Select value={data.competency_id} disabled>
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
              <InputError message={errors.competency_id} className='mt-1' />
            </div>

            {/* Campo: Capacidades */}
            <div className='space-y-2'>
              <Label>Capacidades</Label>
              <MultiSelect
                options={capabilities.map((capability) => ({
                  label: capability.name,
                  value: capability.id.toString()
                }))}
                value={data.capability_ids}
                onChange={(values) => {
                  setData('capability_ids', values)
                  clearErrors('capability_ids')
                }}
                placeholder='Selecciona una o más capacidades'
                id='capability_ids'
                name='capability_ids'
              />
              <InputError message={errors.capability_ids} className='mt-1' />
            </div>
          </div>

          <h2 className='text-lg font-bold'>DESEMPEÑOS (PRECIZADO)</h2>

          <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
            {/* Campo: Desempeños */}
            <div className='space-y-2'>
              <Label htmlFor='performances'>Desempeños</Label>
              <Textarea
                id='performances'
                value={data.performances}
                onChange={(e) => {
                  setData('performances', e.target.value)
                  clearErrors('performances')
                }}
                placeholder='Ej: Desempeños'
              />
              <InputError message={errors.performances} className='mt-1' />
            </div>

            {/* Campo: Propósito de la sesión */}
            <div className='space-y-2'>
              <Label htmlFor='purpose_learning'>Propósito de la sesión</Label>
              <Textarea
                id='purpose_learning'
                value={data.purpose_learning}
                onChange={(e) => {
                  setData('purpose_learning', e.target.value)
                  clearErrors('purpose_learning')
                }}
                placeholder='Ej: Evaluación de Matemáticas - Unidad 1'
              />
              <InputError message={errors.purpose_learning} className='mt-1' />
            </div>
          </div>

          <h2 className='text-lg font-bold'>III. SECUENCIA DIDÁCTICA</h2>

          <div className='grid grid-cols-1 gap-6'>
            {/* Campo: Secuencia de inicio */}
            <div className='grid grid-cols-8 items-center gap-6'>
              <div className='col-span-2 flex size-full flex-col items-center justify-center gap-2'>INICIO</div>
              <div className='col-span-6 w-full space-y-2'>
                <Label htmlFor='start_sequence'>Secuencia de inicio</Label>
                <Textarea
                  id='start_sequence'
                  value={data.start_sequence}
                  onChange={(e) => {
                    setData('start_sequence', e.target.value)
                    clearErrors('start_sequence')
                  }}
                  placeholder='Ej: Secuencia de inicio'
                />
                <InputError message={errors.start_sequence} className='mt-1' />
              </div>
            </div>

            {/* Campo: Secuencia de desarrollo */}
            <div className='grid grid-cols-8 items-center gap-6'>
              <div className='col-span-2 flex size-full flex-col items-center justify-center gap-2 border-6 border-emerald-600 bg-emerald-500'>
                DESARROLLO
              </div>
              <div className='col-span-6 w-full space-y-2'>
                <Label htmlFor='application_form_ids'>Formularios de aplicación</Label>

                <div>
                  {learning_session?.application_form && (
                    <div className='grid grid-cols-2 items-center gap-2 space-y-2'>
                      <div className='flex w-full flex-col gap-2'>
                        <div className='flex items-center space-x-2'>
                          <Label>NOMBRE:</Label>
                          <p>{learning_session.application_form.name}</p>
                        </div>
                        <div className='flex items-center space-x-2'>
                          <Label>FECHA INICIO:</Label>
                          <p>{format(learning_session.start_date, 'dd/MM/yyyy HH:mm')}</p>
                        </div>
                        <div className='flex items-center space-x-2'>
                          <Label>FECHA FIN:</Label>
                          <p>{format(learning_session.end_date, 'dd/MM/yyyy HH:mm')}</p>
                        </div>
                      </div>
                      <div className='flex w-full flex-col gap-2'>
                        <div className='flex items-center space-x-2'>
                          <Label>ESTADO:</Label>
                          <div>{tStatus(learning_session.status)}</div>
                        </div>

                        <div className='flex items-center space-x-2'>
                          <Label>ACCIONES:</Label>
                          <div className='flex gap-2'>
                            <Link href={`/teacher/application-forms/${learning_session.application_form.id}`}>
                              <Button variant='info' size='sm'>
                                Ver
                              </Button>
                            </Link>
                            {!learning_session.application_form.deactivated_at && (
                              <Link href={`/teacher/application-forms/${learning_session.application_form.id}/edit`}>
                                <Button variant='warning' size='sm'>
                                  Editar
                                </Button>
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className={cn('flex items-center space-x-2', data.application_form_id ? 'hidden' : '')}>
                    <Switch
                      id='redirect-to-form'
                      checked={data.redirect}
                      onCheckedChange={(checked) => {
                        setData('redirect', checked)
                        clearErrors('redirect')
                      }}
                    />
                    <Label htmlFor='redirect-to-form'>Crear Ficha luego de guardar</Label>
                  </div>
                </div>
              </div>
            </div>

            {/* Campo: Secuencia de cierre */}
            <div className='grid grid-cols-8 items-center gap-6'>
              <div className='col-span-2 flex size-full flex-col items-center justify-center gap-2'>CIERRE</div>
              <div className='col-span-6 w-full space-y-2'>
                <Label htmlFor='end_sequence'>Secuencia de cierre</Label>
                <Textarea
                  id='end_sequence'
                  value={data.end_sequence}
                  onChange={(e) => {
                    setData('end_sequence', e.target.value)
                    clearErrors('end_sequence')
                  }}
                  placeholder='Ej: Secuencia de cierre'
                />
                <InputError message={errors.end_sequence} className='mt-1' />
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className='flex items-center justify-center'>
            <Button type='submit' disabled={hasErrors || processing}>
              {processing && <LoaderCircle className='h-4 w-4 animate-spin' />}
              {processing ? 'Guardando...' : 'Guardar Ficha de Aplicación'}
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  )
}
