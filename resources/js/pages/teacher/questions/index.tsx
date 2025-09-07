import DataTable from '@/components/organisms/data-table'
import FlashMessages from '@/components/organisms/flash-messages'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import AppLayout from '@/layouts/app-layout'
import { useTranslations } from '@/lib/translator'
import { Capability, Competency, CurricularArea } from '@/types/academic'
import { Question, QuestionDifficulty, QuestionType } from '@/types/application-form/question'
import { BreadcrumbItem } from '@/types/core'
import { PaginatedResponse, ResourcePageProps } from '@/types/core/api-types'
import { Head, router } from '@inertiajs/react'
import { ColumnDef } from '@tanstack/react-table'
import { Pencil } from 'lucide-react'
import { useState } from 'react'
import { CreateQuestionDialog } from './components/form-create'
import { EditQuestionDialog } from './components/form-edit'

type PageProps = Omit<ResourcePageProps<Question>, 'data'> & {
  curricular_areas: CurricularArea[]
  competencies: Competency[]
  capabilities: Capability[]
  question_types: QuestionType[]
  difficulties: QuestionDifficulty[]

  questions: PaginatedResponse<Question>
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Inicio',
    href: '/teacher/dashboard'
  },
  {
    title: 'Preguntas',
    href: 'teacher/question'
  }
]

export default function Questions({ questions, filters, question_types, capabilities, difficulties, curricular_areas, competencies }: PageProps) {
  const { t } = useTranslations()
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [questionId, setQuestionId] = useState<number>()
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const defaultFilters = {
    search: '',
    question_type: '0',
    curricular_area: '0',
    competency: '0',
    capability: '0'
  }
  const [localFilters, setLocalFilters] = useState(filters)

  const handleSearch = () => {
    router.get(route('teacher.questions.index'), localFilters, {
      preserveState: true,
      preserveScroll: true,
      replace: true
    })
  }

  const columns: ColumnDef<Question>[] = [
    {
      header: 'ID',
      accessorKey: 'id'
    },
    {
      header: 'Título',
      accessorKey: 'name'
    },
    {
      header: 'Tipo',
      accessorKey: 'question_type.name'
    },
    {
      header: 'Área curricular',
      accessorKey: 'capability.competency.curricular_area_cycle.curricular_area.name'
    },
    {
      header: 'Competencia',
      accessorKey: 'capability.competency.name'
    },
    {
      header: 'Capacidad',
      accessorKey: 'capability.name'
    },
    {
      header: 'Dificultad',
      accessorKey: 'difficulty',
      cell: (row) => t(row.getValue() as string)
    },
    {
      header: 'Acciones',
      accessorKey: 'id',
      cell: (row) => {
        return (
          <div className='flex space-x-2' id={row.getValue() as string}>
            <Button
              variant='outline'
              onClick={() => {
                setQuestionId(row.getValue() as number)
                setIsEditModalOpen(true)
              }}
            >
              <Pencil />
            </Button>
          </div>
        )
      }
    }
  ]

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title='Preguntas' />
      <FlashMessages />

      <div className='flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4'>
        <div className='flex flex-wrap gap-4'>
          <CreateQuestionDialog
            isOpen={isCreateModalOpen}
            onOpenChange={setIsCreateModalOpen}
            curricularAreas={curricular_areas}
            competencies={competencies}
            capabilities={capabilities}
            difficulties={difficulties}
            questionTypes={question_types}
            onSuccess={() => setIsCreateModalOpen(false)}
          />

          <div className='min-w-[200px] flex-1'>
            <Label>Título</Label>
            <Input value={localFilters.search} onChange={(e) => setLocalFilters((prev) => ({ ...prev, search: e.target.value }))} />
          </div>

          <div>
            <Label>Tipo de pregunta</Label>
            <Select value={localFilters.question_type} onValueChange={(v) => setLocalFilters((prev) => ({ ...prev, question_type: v }))}>
              <SelectTrigger className='min-w-[200px] flex-1'>
                <SelectValue placeholder='Tipo de pregunta' />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {[{ id: 0, name: 'Todas' }, ...question_types].map((q) => (
                    <SelectItem key={q.id} value={q.id.toString()}>
                      {q.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Área curricular</Label>
            <Select value={localFilters.curricular_area} onValueChange={(v) => setLocalFilters((prev) => ({ ...prev, curricular_area: v }))}>
              <SelectTrigger className='min-w-[200px] flex-1'>
                <SelectValue placeholder='Área curricular' />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {[{ id: 0, name: 'Todas' }, ...curricular_areas].map((a) => (
                    <SelectItem key={a.id} value={a.id.toString()}>
                      {a.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Competencia</Label>
            <Select value={localFilters.competency} onValueChange={(v) => setLocalFilters((prev) => ({ ...prev, competency: v }))}>
              <SelectTrigger className='min-w-[200px] flex-1'>
                <SelectValue placeholder='Competencia' />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {[{ id: 0, name: 'Todas' }, ...competencies].map((c) => (
                    <SelectItem key={c.id} value={c.id.toString()}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Capacidad</Label>
            <Select value={localFilters.capability} onValueChange={(v) => setLocalFilters((prev) => ({ ...prev, capability: v }))}>
              <SelectTrigger className='min-w-[200px] flex-1'>
                <SelectValue placeholder='Capacidad' />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {[{ id: 0, name: 'Todas' }, ...capabilities].map((c) => (
                    <SelectItem key={c.id} value={c.id.toString()}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className='flex items-end gap-2'>
            <Button onClick={handleSearch}>Buscar</Button>
            <Button variant='destructive' onClick={() => setLocalFilters(defaultFilters)}>
              Limpiar
            </Button>
          </div>
        </div>

        <DataTable columns={columns} data={questions} />
      </div>

      {questionId && (
        <EditQuestionDialog
          isOpen={isEditModalOpen}
          id={questionId}
          curricularAreas={curricular_areas}
          competencies={competencies}
          capabilities={capabilities}
          difficulties={difficulties}
          questionTypes={question_types}
          onOpenChange={setIsEditModalOpen}
          onSuccess={() => setIsEditModalOpen(false)}
        />
      )}
    </AppLayout>
  )
}
