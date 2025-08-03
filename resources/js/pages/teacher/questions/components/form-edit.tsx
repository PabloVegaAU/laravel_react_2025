import InputError from '@/components/input-error'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useTranslations } from '@/lib/translator'
import { Capability, Competency } from '@/types/academic'
import { CurricularArea } from '@/types/academic/curricular-area'
import { CreateQuestion, CreateQuestionOption, QuestionDifficulty, QuestionType } from '@/types/application-form/question'
import { useForm } from '@inertiajs/react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { LoaderCircle, PencilIcon, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { MatchingOptions, OrderingOptions, SingleChoiceOptions, TrueFalseOptions } from './question-types'

interface EditQuestionDialogProps {
  isOpen: boolean
  id: number
  curricularAreas: CurricularArea[]
  competencies: Competency[]
  capabilities: Capability[]
  difficulties: QuestionDifficulty[]
  questionTypes: QuestionType[]
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function EditQuestionDialog({
  isOpen,
  id,
  curricularAreas,
  competencies: allCompetencies,
  capabilities: allCapabilities,
  difficulties,
  questionTypes,
  onOpenChange,
  onSuccess
}: EditQuestionDialogProps) {
  // 1. Hooks de estado
  const { t } = useTranslations()
  const [initialized, setInitialized] = useState(false)
  const queryClient = useQueryClient()

  // 2. Hooks de datos
  const { data: question } = useQuery({
    queryKey: ['question', id],
    queryFn: () => fetch(`/teacher/questions/${id}/edit`).then((res) => res.json()),
    enabled: isOpen && !!id,
    staleTime: 1000 * 60 * 5, // 5 minutos
    refetchOnWindowFocus: false
  })

  // 3. Valores iniciales del formulario
  const initialValues: CreateQuestion = useMemo(
    () => ({
      name: '',
      description: '',
      difficulty: 'medium' as QuestionDifficulty,
      question_type_id: '1',
      capability_id: '',
      curricular_area_cycle_id: '',
      competency_id: '',
      options: [],
      help_message: '',
      explanation_required: false,
      image: null
    }),
    []
  )

  // 4. Hook de formulario
  const { data, setData, post, processing, errors, reset } = useForm<CreateQuestion>(initialValues)

  // 5. Memoized data transformations
  const { competenciesByCurricularArea, capabilitiesByCompetency } = useMemo(() => {
    const competenciesMap = allCompetencies.reduce<Record<string, Competency[]>>((acc, competency) => {
      const areaId = competency.curricular_area_cycle_id.toString()
      if (!acc[areaId]) acc[areaId] = []
      acc[areaId].push(competency)
      return acc
    }, {})

    const capabilitiesMap = allCapabilities.reduce<Record<string, Capability[]>>((acc, capability) => {
      const competencyId = capability.competency_id?.toString() || ''
      if (competencyId) {
        if (!acc[competencyId]) acc[competencyId] = []
        acc[competencyId].push(capability)
      }
      return acc
    }, {})

    return { competenciesByCurricularArea: competenciesMap, capabilitiesByCompetency: capabilitiesMap }
  }, [allCompetencies, allCapabilities])

  // 6. Filtered data based on form state
  const filteredCompetencies = useMemo(() => {
    // Si estamos en modo edición y tenemos datos de pregunta, usamos el área curricular de la pregunta
    const areaId = data.curricular_area_cycle_id || question?.capability?.competency?.curricular_area_cycle_id?.toString()
    return areaId ? competenciesByCurricularArea[areaId] || [] : []
  }, [data.curricular_area_cycle_id, competenciesByCurricularArea, question])

  const filteredCapabilities = useMemo(() => {
    // Si estamos en modo edición y tenemos datos de pregunta, usamos la competencia de la pregunta
    const compId = data.competency_id || question?.capability?.competency_id?.toString()
    return compId ? capabilitiesByCompetency[compId] || [] : []
  }, [data.competency_id, capabilitiesByCompetency, question])

  // 7. Efectos secundarios
  // Efecto para inicializar el formulario cuando se carga la pregunta
  useEffect(() => {
    if (isOpen && question && !initialized) {
      const formData = {
        name: question.name,
        description: question.description || '',
        difficulty: question.difficulty,
        question_type_id: question.question_type_id?.toString() || '',
        curricular_area_cycle_id: question.capability?.competency?.curricular_area_cycle_id?.toString() || '',
        competency_id: question.capability?.competency_id?.toString() || '',
        capability_id: question.capability_id?.toString() || '',
        options: Array.isArray(question.options) ? question.options : [],
        help_message: question.help_message || '',
        explanation_required: Boolean(question.explanation_required),
        image: question.image || null
      }

      setData(formData)
      setInitialized(true)
    }
  }, [isOpen, question, initialized, setData])

  // Efecto para reiniciar campos dependientes
  useEffect(() => {
    if (initialized && isOpen && question) {
      const currentAreaId = data.curricular_area_cycle_id
      const questionAreaId = question.capability?.competency?.curricular_area_cycle_id?.toString()
      const currentCompetencyId = data.competency_id
      const questionCompetencyId = question.capability?.competency_id?.toString()

      if (currentAreaId && currentAreaId !== questionAreaId) {
        setData('competency_id', '')
        setData('capability_id', '')
      } else if (currentCompetencyId && currentCompetencyId !== questionCompetencyId) {
        setData('capability_id', '')
      }
    }
  }, [initialized, data.curricular_area_cycle_id, data.competency_id, setData, isOpen, question])

  // Efecto para limpiar el estado cuando se cierra el diálogo
  useEffect(() => {
    if (!isOpen) {
      reset()
      setInitialized(false)
    }
  }, [isOpen, reset])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    post(route('teacher.questions.update', id), {
      forceFormData: true,
      preserveScroll: true,
      preserveState: true,
      onSuccess: () => {
        onSuccess?.()
        reset()
        queryClient.invalidateQueries({ queryKey: ['question', id] })
      }
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <PencilIcon className='h-4 w-4' onClick={() => onOpenChange(true)} />
      </DialogTrigger>
      <DialogContent className='sm:max-w-[700px]'>
        <DialogTitle>Editar Pregunta</DialogTitle>
        <DialogDescription>Complete el formulario para edit una nueva pregunta.</DialogDescription>

        <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
          {/* Selección de área curricular */}
          <div className='flex flex-col gap-2'>
            <Label htmlFor='curricular_area_cycle_id'>Área Curricular *</Label>
            <Select value={data.curricular_area_cycle_id} onValueChange={(value) => setData('curricular_area_cycle_id', value)}>
              <SelectTrigger id='curricular_area_cycle_id' name='curricular_area_cycle_id'>
                <SelectValue placeholder='Selecciona un área curricular' />
              </SelectTrigger>
              <SelectContent>
                {curricularAreas.map((area) => (
                  <SelectItem key={area.id} value={area.id.toString()}>
                    {area.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.curricular_area_cycle_id && <p className='text-sm text-red-500'>{errors.curricular_area_cycle_id}</p>}
          </div>

          {/* Selección de competencia */}
          <div className='flex flex-col gap-2'>
            <Label htmlFor='competency_id'>Competencia *</Label>
            <Select value={data.competency_id} onValueChange={(value) => setData('competency_id', value)} disabled={!data.curricular_area_cycle_id}>
              <SelectTrigger id='competency_id' name='competency_id'>
                <SelectValue placeholder={!data.curricular_area_cycle_id ? 'Primero selecciona un área curricular' : 'Selecciona una competencia'} />
              </SelectTrigger>
              <SelectContent>
                {filteredCompetencies.map((competency) => (
                  <SelectItem key={competency.id} value={competency.id.toString()}>
                    {competency.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <InputError message={errors.competency_id} />
          </div>

          {/* Selección de capacidad */}
          <div className='flex flex-col gap-2'>
            <Label htmlFor='capability_id'>Capacidad *</Label>
            <Select value={data.capability_id} onValueChange={(value) => setData('capability_id', value)} disabled={!data.competency_id}>
              <SelectTrigger id='capability_id' name='capability_id'>
                <SelectValue placeholder={!data.competency_id ? 'Primero selecciona una competencia' : 'Selecciona una capacidad'} />
              </SelectTrigger>
              <SelectContent>
                {filteredCapabilities.map((capability) => (
                  <SelectItem key={capability.id} value={capability.id.toString()}>
                    {capability.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <InputError message={errors.capability_id} />
          </div>

          {/* Selección de tipo de pregunta y dificultad */}
          <div className='flex flex-col items-center gap-6 sm:flex-row sm:gap-4'>
            {/* Selección de tipo de pregunta */}
            <div className='flex flex-1 flex-col gap-2'>
              <Label htmlFor='question_type_id'>Tipo de Pregunta *</Label>
              <Select value={data.question_type_id} onValueChange={(value) => setData('question_type_id', value)} required>
                <SelectTrigger id='question_type_id' name='question_type_id'>
                  <SelectValue placeholder='Selecciona un tipo de pregunta' />
                </SelectTrigger>
                <SelectContent>
                  {questionTypes.map((questionType) => (
                    <SelectItem key={questionType.id} value={questionType.id.toString()}>
                      {questionType.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <InputError message={errors.question_type_id} />
            </div>
            {/* Selección de dificultad */}
            <div className='flex flex-1 flex-col gap-2'>
              <Label htmlFor='difficulty'>Dificultad *</Label>
              <Select value={data.difficulty} onValueChange={(value) => setData('difficulty', value as QuestionDifficulty)} required>
                <SelectTrigger id='difficulty' name='difficulty'>
                  <SelectValue placeholder='Selecciona la dificultad' />
                </SelectTrigger>
                <SelectContent>
                  {difficulties.map((difficulty) => (
                    <SelectItem key={difficulty} value={difficulty}>
                      {t(difficulty)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <InputError message={errors.difficulty} />
            </div>
            {/* Explicación requerida */}
            <div className='flex items-center space-x-2'>
              <Checkbox
                id='explanation_required'
                name='explanation_required'
                checked={data.explanation_required}
                onCheckedChange={(value) => setData('explanation_required', value as boolean)}
              />
              <Label htmlFor='explanation_required'>
                Explicación
                <br />
                requerida
              </Label>
            </div>
          </div>

          {/* Imagen */}
          <div className='flex flex-col items-center gap-2'>
            <Label htmlFor='image' className='self-start'>
              Imagen
            </Label>
            <div className='flex w-full flex-col items-center gap-4'>
              {data.image ? (
                <div className='relative flex w-full max-w-xs justify-center'>
                  <div className='border-input relative h-48 w-full max-w-xs overflow-hidden rounded-md border'>
                    <img
                      src={typeof data.image === 'string' ? data.image : URL.createObjectURL(data.image)}
                      alt='Preview'
                      className='h-full w-full object-contain p-2'
                    />
                  </div>
                  <Button
                    type='button'
                    variant='destructive'
                    size='icon'
                    className='absolute -top-2 -right-2 h-6 w-6 rounded-full'
                    onClick={(e) => {
                      e.preventDefault()
                      setData('image', null)
                      const input = document.getElementById('image') as HTMLInputElement
                      if (input) input.value = ''
                    }}
                  >
                    <X className='h-3 w-3' />
                  </Button>
                </div>
              ) : (
                <div className='flex h-32 w-full max-w-xs items-center justify-center rounded-md border-2 border-dashed'>
                  <span className='text-muted-foreground px-2 text-center'>Vista previa de la imagen aparecerá aquí</span>
                </div>
              )}
              <div className='w-full max-w-xs'>
                <Input
                  id='image'
                  name='image'
                  type='file'
                  accept='image/*'
                  className='w-full'
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      setData('image', file)
                    }
                  }}
                />
              </div>
            </div>
          </div>

          {/* Nombre */}
          <div className='flex flex-col gap-2'>
            <Label htmlFor='name'>Nombre *</Label>
            <Input id='name' name='name' type='text' value={data.name} onChange={(e) => setData('name', e.target.value)} required />
            <InputError message={errors.name} />
          </div>

          {/* Descripción */}
          <div className='flex flex-col gap-2'>
            <Label htmlFor='description'>Descripción</Label>
            <Input
              id='description'
              name='description'
              type='text'
              value={data.description}
              onChange={(e) => setData('description', e.target.value)}
            />
            <InputError message={errors.description} />
          </div>

          {/* Opciones */}
          <div className='flex flex-col gap-2'>
            <InputError message={errors.options} />

            {data.question_type_id === '1' && (
              <SingleChoiceOptions options={data.options} onChange={(newOptions) => setData('options', newOptions)} disabled={processing} />
            )}

            {data.question_type_id === '2' && (
              <OrderingOptions options={data.options} onChange={(newOptions) => setData('options', newOptions)} disabled={processing} />
            )}

            {data.question_type_id === '3' && (
              <MatchingOptions options={data.options} onChange={(newOptions) => setData('options', newOptions)} disabled={processing} />
            )}

            {data.question_type_id === '4' && (
              <TrueFalseOptions options={data.options} onChange={(newOptions) => setData('options', newOptions)} disabled={processing} />
            )}
          </div>

          <Button
            type='submit'
            className='mt-2 w-full'
            disabled={
              processing ||
              !data.curricular_area_cycle_id ||
              !data.competency_id ||
              !data.capability_id ||
              !data.question_type_id ||
              !data.difficulty ||
              !data.name.trim() ||
              // Validación para selección única
              (data.question_type_id === '1' &&
                (data.options.length < 2 ||
                  !data.options.every((opt: CreateQuestionOption) => opt.value.trim()) ||
                  !data.options.some((opt: CreateQuestionOption) => opt.is_correct))) ||
              // Validación para ordenar
              (data.question_type_id === '2' && (data.options.length < 2 || !data.options.every((opt: CreateQuestionOption) => opt.value.trim()))) ||
              // Validación para emparejar
              (data.question_type_id === '3' &&
                (data.options.length < 2 ||
                  data.options.length % 2 !== 0 ||
                  !data.options.every((opt: CreateQuestionOption) => opt.value.trim()) ||
                  Array.from({ length: Math.ceil(data.options.length / 2) }).some((_, i) => {
                    const first = data.options[i * 2]
                    const second = data.options[i * 2 + 1]
                    return !first?.value.trim() || !second?.value.trim()
                  })))
              // Verdadero/Falso siempre es válido una vez inicializado
            }
          >
            {processing ? (
              <>
                <LoaderCircle className='mr-2 h-4 w-4 animate-spin' />
                Guardando...
              </>
            ) : (
              'Guardar Pregunta'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
