import InputError from '@/components/input-error'
import FlashMessages from '@/components/organisms/flash-messages'
import { MultiSelect } from '@/components/organisms/multi-select'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import AppLayout from '@/layouts/app-layout'
import { useTranslations } from '@/lib/translator'
import { cn } from '@/lib/utils'
import { Capability, Classroom, Competency } from '@/types/academic'
import { CurricularAreaCycle } from '@/types/academic/curricular-area-cycle'
import { EducationalInstitution } from '@/types/academic/educational-institution'
import { TeacherClassroomCurricularAreaCycle } from '@/types/academic/teacher-classroom-curricular-area-cycle'
import { BreadcrumbItem, SharedData } from '@/types/core'
import { Head, useForm, usePage } from '@inertiajs/react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { CalendarIcon, LoaderCircle } from 'lucide-react'
import { useEffect, useState } from 'react'

type PageProps = {
  educational_institution: EducationalInstitution
  teacher_classroom_curricular_area_cycles: TeacherClassroomCurricularAreaCycle[]
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Sesiones de Aprendizaje',
    href: 'teacher/learning-session'
  }
]

export default function LearningSessionCreate({ educational_institution, teacher_classroom_curricular_area_cycles }: PageProps) {
  const { auth } = usePage<SharedData>().props
  const { t } = useTranslations()

  const [classrooms, setClassrooms] = useState<Classroom[]>([])
  const [curricularAreas, setCurricularAreas] = useState<CurricularAreaCycle[]>([])
  const [competencies, setCompetencies] = useState<Competency[]>([])
  const [capabilities, setCapabilities] = useState<Capability[]>([])

  const dateLocale = es

  const { data, setData, post, processing, errors } = useForm({
    redirect: true as boolean,
    educational_institution_id: educational_institution.id,
    status: 'draft',
    name: '',
    application_date: new Date(),
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

    setCurricularAreas([])
    setCompetencies([])
    setCapabilities([])
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    post(route('teacher.learning-sessions.store'), {
      preserveScroll: true,
      preserveState: true
    })
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('session_learning.title', 'Sesiones de Aprendizaje')} />
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
              <Label htmlFor='name'>Título</Label>
              <Input
                id='name'
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
                placeholder='Ej: Evaluación de Matemáticas - Unidad 1'
              />
              <InputError message={errors.name} className='mt-1' />
            </div>

            {/* Campo: Fecha de la sesión */}
            <div className='space-y-2'>
              <Label htmlFor='application_date'>Fecha de la sesión</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant='outline'
                    className={cn('w-full justify-start text-left font-normal', !data.application_date && 'text-muted-foreground')}
                  >
                    <CalendarIcon className='mr-2 h-4 w-4' />
                    {data.application_date ? format(data.application_date, 'PPP', { locale: dateLocale }) : <span>Selecciona una fecha</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-auto p-0'>
                  <Calendar
                    mode='single'
                    selected={data.application_date}
                    onSelect={(date) => {
                      setData('application_date', date || new Date())
                    }}
                    disabled={{ before: new Date() }}
                    startMonth={new Date()}
                  />
                </PopoverContent>
              </Popover>
              <InputError message={errors.application_date} className='mt-1' />
            </div>

            {/* Campo: Aula */}
            <div className='space-y-2'>
              <Label htmlFor='classroom_id'>Aula</Label>
              <Select value={data.classroom_id} onValueChange={(value) => setData('classroom_id', value)}>
                <SelectTrigger>
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
              <Select value={data.curricular_area_cycle_id} onValueChange={(value) => setData('curricular_area_cycle_id', value)}>
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
              <Select value={data.competency_id} onValueChange={(value) => setData('competency_id', value)}>
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
                onChange={(values) => setData('capability_ids', values)}
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
                onChange={(e) => setData('performances', e.target.value)}
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
                onChange={(e) => setData('purpose_learning', e.target.value)}
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
                  onChange={(e) => setData('start_sequence', e.target.value)}
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
                <Label htmlFor='application_form_ids'>Formularios de aplicación</Label>
                <div className='flex gap-6'>
                  <div className='flex items-center space-x-2'>
                    <Switch id='redirect-to-form' checked={data.redirect} onCheckedChange={(checked) => setData('redirect', checked)} />
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
                  onChange={(e) => setData('end_sequence', e.target.value)}
                  placeholder='Ej: Secuencia de cierre'
                />
                <InputError message={errors.end_sequence} className='mt-1' />
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className='flex items-center justify-center'>
            <Button type='submit' disabled={processing}>
              {processing && <LoaderCircle className='h-4 w-4 animate-spin' />}
              {processing ? 'Guardando...' : 'Guardar Ficha de Aplicación'}
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  )
}
