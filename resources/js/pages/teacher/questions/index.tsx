import DataTable from '@/components/organisms/data-table'
import FlashMessages from '@/components/organisms/flash-messages'
import AppLayout from '@/layouts/app-layout'
import { useTranslations } from '@/lib/translator'
import { Capability, Competency, CurricularArea } from '@/types/academic'
import { Question, QuestionDifficulty, QuestionType } from '@/types/application-form/question'
import { BreadcrumbItem } from '@/types/core'
import { PaginatedResponse, ResourcePageProps } from '@/types/core/api-types'
import { Head } from '@inertiajs/react'
import { ColumnDef } from '@tanstack/react-table'
import { useState } from 'react'
import { CreateQuestionDialog } from './components/form-create'

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
    title: 'Preguntas',
    href: 'teacher/question'
  }
]

export default function Questions({ questions, question_types, capabilities, difficulties, curricular_areas, competencies }: PageProps) {
  const { t } = useTranslations()
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const columns: ColumnDef<Question>[] = [
    {
      header: 'ID',
      accessorKey: 'id'
    },
    {
      header: 'Pregunta',
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
      accessorKey: 'actions',
      cell: () => <></>
    }
  ]

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title='Preguntas' />
      <FlashMessages />
      <div className='flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4'>
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

        <DataTable columns={columns} data={questions} />
      </div>
    </AppLayout>
  )
}
