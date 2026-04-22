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
import { generateTimeOptions, getNextValidTime, getValidEndTime, isEndAfterStart, isEndDateValid, isValidTimeForDate } from '@/lib/time-utils'
import { useTranslations } from '@/lib/translator'
import { Capability, Classroom, Competency } from '@/types/academic'
import { CurricularAreaCycle } from '@/types/academic/curricular-area-cycle'
import { EducationalInstitution } from '@/types/academic/educational-institution'
import { TeacherClassroomCurricularAreaCycle } from '@/types/academic/teacher-classroom-curricular-area-cycle'
import { BreadcrumbItem, SharedData } from '@/types/core'
import { Head, useForm, usePage } from '@inertiajs/react'
import { format } from 'date-fns'
import { LoaderCircle } from 'lucide-react'
import { useEffect, useState } from 'react'

type PageProps = {
  educational_institution: EducationalInstitution
  teacher_classroom_curricular_area_cycles: TeacherClassroomCurricularAreaCycle[]
}

export default function LearningSessionCreate({ educational_institution, teacher_classroom_curricular_area_cycles }: PageProps) {
  const { auth } = usePage<SharedData>().props
  const { t } = useTranslations()

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: t('Learning Sessions'),
      href: 'teacher/learning-session'
    }
  ]

  const [classrooms, setClassrooms] = useState<Classroom[]>([])
  const [curricularAreas, setCurricularAreas] = useState<CurricularAreaCycle[]>([])
  const [competencies, setCompetencies] = useState<Competency[]>([])
  const [capabilities, setCapabilities] = useState<Capability[]>([])
  const [availableStartTimes, setAvailableStartTimes] = useState<string[]>([])
  const [availableEndTimes, setAvailableEndTimes] = useState<string[]>([])

  const minDate = format(new Date(), 'yyyy-MM-dd')

  const initialDate = format(new Date(), 'yyyy-MM-dd')
  const initialTime = getNextValidTime()

  const { data, setData, post, processing, errors, hasErrors, clearErrors } = useForm({
    redirect: true as boolean,
    educational_institution_id: educational_institution.id,
    status: 'scheduled',
    registration_status: 'active',
    name: '',
    start_date: initialDate,
    start_time: initialTime,
    end_date: initialDate,
    end_time: initialTime,
    teacher_classroom_curricular_area_cycle_id: '',
    classroom_id: '',
    curricular_area_cycle_id: '',
    competency_id: '',
    capability_ids: [] as string[],
    performances: '',
    purpose_learning: '',
    start_sequence: '',
    end_sequence: ''
  })

  // En el useEffect principal para la carga inicial
  useEffect(() => {
    const validClassrooms = (teacher_classroom_curricular_area_cycles || []).flatMap((area) => (area.classroom ? [area.classroom] : []))
    setClassrooms(validClassrooms)
  }, [teacher_classroom_curricular_area_cycles])

  // En el useEffect para cargar áreas curriculares
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

  // En el useEffect para cargar competencias
  useEffect(() => {
    setCompetencies(
      teacher_classroom_curricular_area_cycles.find((area) => area.curricular_area_cycle_id === Number(data.curricular_area_cycle_id))
        ?.curricular_area_cycle?.curricular_area?.competencies || []
    )

    setData('competency_id', '')
    setCapabilities([])
  }, [data.curricular_area_cycle_id])

  // En el useEffect para cargar capacidades
  useEffect(() => {
    setCapabilities(
      teacher_classroom_curricular_area_cycles
        .find((area) => area.curricular_area_cycle_id === Number(data.curricular_area_cycle_id))
        ?.curricular_area_cycle?.curricular_area?.competencies?.find((competency) => competency.id === Number(data.competency_id))?.capabilities || []
    )
    setData('capability_ids', [])
  }, [data.competency_id])

  // En el useEffect para cargar el área curricular y competencia
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

    // Validar fecha y hora completa
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

    // Use transform to modify data before sending
    post(route('teacher.learning-sessions.store'), formData as any)
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('Create Learning Session')} />
      <FlashMessages />

      <div className='flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4'>
        <form onSubmit={handleSubmit} className='space-y-6'>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
            <Label>UGEL: {educational_institution.ugel}</Label>
            <Label>I.E: {educational_institution.name}</Label>
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
                  min={minDate}
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
                  min={minDate}
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
              </div>
            </div>

            {/* Campo: Aula */}
            <div className='space-y-2'>
              <Label htmlFor='classroom_id'>{t('Classroom')}</Label>
              <Select
                value={data.classroom_id}
                onValueChange={(value) => {
                  setData('classroom_id', value)
                  clearErrors('classroom_id')
                }}
              >
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder={t('Select a Classroom')} />
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
              <Label htmlFor='curricular_area_cycle_id'>{t('Curricular Area')}</Label>
              <Select
                value={data.curricular_area_cycle_id}
                onValueChange={(value) => {
                  setData('curricular_area_cycle_id', value)
                  clearErrors('curricular_area_cycle_id')
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('Select a Curricular Area')} />
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
              <Label htmlFor='competency_id'>{t('Competency')}</Label>
              <Select
                value={data.competency_id}
                onValueChange={(value) => {
                  setData('competency_id', value)
                  clearErrors('competency_id')
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('Select a Competency')} />
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
              <Label>{t('Capabilities')}</Label>
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
                placeholder={t('Select one or more capabilities')}
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
              <Label htmlFor='performances'>{t('Performances')}</Label>
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
              <Label htmlFor='purpose_learning'>{t('Purpose of the Session')}</Label>
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
                <Label htmlFor='start_sequence'>{t('Initial Sequence')}</Label>
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

            {/* Campo: Secuencia de desarrollo (Formulario de aplicación) */}
            <div className='grid grid-cols-8 items-center gap-6'>
              <div className='col-span-2 flex size-full flex-col items-center justify-center gap-2 border-6 border-emerald-600 bg-emerald-500'>
                DESARROLLO
              </div>
              <div className='col-span-6 w-full space-y-2'>
                <Label htmlFor='application_form_ids'>{t('Application Form')}</Label>
                <div className='flex gap-6'>
                  <div className='flex items-center space-x-2'>
                    <Switch
                      id='redirect-to-form'
                      checked={data.redirect}
                      onCheckedChange={(checked) => {
                        setData('redirect', checked)
                        clearErrors('redirect')
                      }}
                    />
                    <Label htmlFor='redirect-to-form'>{t('Create Form after saving')}</Label>
                  </div>
                </div>
              </div>
            </div>

            {/* Campo: Secuencia de cierre */}
            <div className='grid grid-cols-8 items-center gap-6'>
              <div className='col-span-2 flex size-full flex-col items-center justify-center gap-2'>CIERRE</div>
              <div className='col-span-6 w-full space-y-2'>
                <Label htmlFor='end_sequence'>{t('Closing Sequence')}</Label>
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
