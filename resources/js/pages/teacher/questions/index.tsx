import FlashMessages from '@/components/organisms/flash-messages'
import Table from '@/components/organisms/table'
import AppLayout from '@/layouts/app-layout'
import { Capability, Competency, CurricularArea } from '@/types/academic'
import { BreadcrumbItem } from '@/types/core'
import { PaginatedResponse, ResourcePageProps } from '@/types/core/api-types'
import { Column } from '@/types/core/ui-types'
import { Question, QuestionDifficulty, QuestionType } from '@/types/question'
import { Head } from '@inertiajs/react'
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
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const columns: Column<Question>[] = [
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
      renderCell: (row) => row.difficulty.charAt(0).toUpperCase() + row.difficulty.slice(1)
    },
    {
      header: 'Acciones',
      accessorKey: 'actions',
      renderCell: () => <></>
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

        <Table columns={columns} data={questions} />
      </div>
    </AppLayout>
  )
}
