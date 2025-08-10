import DataTable from '@/components/organisms/data-table'
import FlashMessages from '@/components/organisms/flash-messages'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import AppLayout from '@/layouts/app-layout'
import { useTranslations } from '@/lib/translator'
import { Capability, Competency, CurricularArea } from '@/types/academic'
import { Question, QuestionDifficulty, QuestionType } from '@/types/application-form/question'
import { BreadcrumbItem } from '@/types/core'
import { PaginatedResponse, ResourcePageProps } from '@/types/core/api-types'
import { Head, router } from '@inertiajs/react'
import { ColumnDef } from '@tanstack/react-table'
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
      header: 'Dificultad',
      accessorKey: 'difficulty',
      cell: (row) => t(row.getValue() as string)
    },
    {
      header: 'Acciones',
      accessorKey: 'id',
      cell: (row) => {
        const [isEditModalOpen, setIsEditModalOpen] = useState(false)
        return (
          <div className='flex space-x-2' id={row.getValue() as string}>
            <EditQuestionDialog
              isOpen={isEditModalOpen}
              id={row.getValue() as number}
              curricularAreas={curricular_areas}
              competencies={competencies}
              capabilities={capabilities}
              difficulties={difficulties}
              questionTypes={question_types}
              onOpenChange={setIsEditModalOpen}
              onSuccess={() => setIsEditModalOpen(false)}
            />
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
        <div className='flex items-center justify-between gap-4'>
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

          {/* Buscador */}
          <div className='flex items-center gap-4'>
            <div>
              <Label>Título</Label>
              <Input value={localFilters.search} onChange={(e) => setLocalFilters((prev) => ({ ...prev, search: e.target.value }))} />
            </div>

            <Button onClick={handleSearch}>Buscar</Button>
          </div>
        </div>

        <DataTable columns={columns} data={questions} />
      </div>
    </AppLayout>
  )
}
