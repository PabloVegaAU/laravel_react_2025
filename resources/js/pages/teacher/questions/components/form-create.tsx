import InputError from '@/components/input-error'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Capability, Competency } from '@/types/academic'
import { CurricularArea } from '@/types/academic/curricular-area'
import { CreateQuestion, CreateQuestionOption, QuestionType } from '@/types/question'
import { QuestionDifficulty } from '@/types/question/question'
import { useForm } from '@inertiajs/react'
import { LoaderCircle } from 'lucide-react'
import { useEffect, useMemo } from 'react'
import { MatchingOptions, OrderingOptions, SingleChoiceOptions, TrueFalseOptions } from './question-types'

interface CreateQuestionDialogProps {
  isOpen: boolean
  curricularAreas: CurricularArea[]
  competencies: Competency[]
  capabilities: Capability[]
  difficulties: QuestionDifficulty[]
  questionTypes: QuestionType[]
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function CreateQuestionDialog({
  isOpen,
  curricularAreas,
  competencies: allCompetencies,
  capabilities: allCapabilities,
  difficulties,
  questionTypes,
  onOpenChange,
  onSuccess
}: CreateQuestionDialogProps) {
  // 1. Define los valores iniciales con el tipo Required<CreateQuestion>
  const initialValues: CreateQuestion = {
    name: '',
    description: '',
    difficulty: 'medium' as QuestionDifficulty,
    question_type_id: '1',
    capability_id: '',
    curricular_area_id: '',
    competency_id: '',
    options: [],
    help_message: '',
    explanation_required: false,
    correct_feedback: '',
    incorrect_feedback: '',
    image: null
  }

  // 2. Usa el mismo tipo en useForm
  const { data, setData, post, processing, errors, reset } = useForm<CreateQuestion>(initialValues)

  // Crea mapas de acceso rápido
  const { competenciesByCurricularArea, capabilitiesByCompetency } = useMemo(() => {
    const competenciesMap = allCompetencies.reduce<Record<string, Competency[]>>((acc, competency) => {
      const areaId = competency.curricular_area_id.toString()
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

    return {
      competenciesByCurricularArea: competenciesMap,
      capabilitiesByCompetency: capabilitiesMap
    }
  }, [allCompetencies, allCapabilities])

  // Filtra competencias según área curricular seleccionada
  const filteredCompetencies = useMemo(() => {
    return data.curricular_area_id ? competenciesByCurricularArea[data.curricular_area_id] || [] : []
  }, [data.curricular_area_id, competenciesByCurricularArea])

  // Filtra capacidades según competencia seleccionada
  const filteredCapabilities = useMemo(() => {
    return data.competency_id ? capabilitiesByCompetency[data.competency_id] || [] : []
  }, [data.competency_id, capabilitiesByCompetency])

  // Reinicia campos dependientes al cambiar el padre
  useEffect(() => {
    if (data.curricular_area_id) {
      setData('competency_id', '')
      setData('capability_id', '')
    }
  }, [data.curricular_area_id, setData])

  useEffect(() => {
    if (data.competency_id) {
      setData('capability_id', '')
    }
  }, [data.competency_id, setData])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    post(route('teacher.questions.store'), {
      preserveScroll: true,
      preserveState: true,
      onSuccess: () => {
        onSuccess?.()
        reset()
      }
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant='outline-info'>Agregar Pregunta</Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[600px]'>
        <div className='flex flex-col gap-1'>
          <DialogTitle>Agregar Pregunta</DialogTitle>
          <DialogDescription>Complete el formulario para agregar una nueva pregunta.</DialogDescription>
        </div>

        <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
          {/* Selección de área curricular */}
          <div className='flex flex-col gap-2'>
            <Label htmlFor='curricular_area_id'>Área Curricular *</Label>
            <Select value={data.curricular_area_id} onValueChange={(value) => setData('curricular_area_id', value)}>
              <SelectTrigger id='curricular_area_id' name='curricular_area_id'>
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
            {errors.curricular_area_id && <p className='text-sm text-red-500'>{errors.curricular_area_id}</p>}
          </div>

          {/* Selección de competencia */}
          <div className='flex flex-col gap-2'>
            <Label htmlFor='competency_id'>Competencia *</Label>
            <Select value={data.competency_id} onValueChange={(value) => setData('competency_id', value)} disabled={!data.curricular_area_id}>
              <SelectTrigger id='competency_id' name='competency_id'>
                <SelectValue placeholder={!data.curricular_area_id ? 'Primero selecciona un área curricular' : 'Selecciona una competencia'} />
              </SelectTrigger>
              <SelectContent>
                {filteredCompetencies.map((competency) => (
                  <SelectItem key={competency.id} value={competency.id.toString()}>
                    {competency.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.competency_id && <p className='text-sm text-red-500'>{errors.competency_id}</p>}
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
            {errors.capability_id && <p className='text-sm text-red-500'>{errors.capability_id}</p>}
          </div>

          {/* Selección de tipo de pregunta y dificultad */}
          <div className='flex flex-col gap-6 sm:flex-row sm:gap-4'>
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
                      {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <InputError message={errors.difficulty} />
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
              !data.curricular_area_id ||
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
