import InputError from '@/components/input-error'
import { SearchableSelect } from '@/components/organisms/searchable-select'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SelectItem } from '@/components/ui/select'
import { useTranslations } from '@/lib/translator'
import { normalizeString } from '@/lib/utils'
import { Classroom } from '@/types/academic'
import { Student } from '@/types/user'
import { useForm } from '@inertiajs/react'
import { useQuery } from '@tanstack/react-query'
import { LoaderCircle } from 'lucide-react'
import { useState } from 'react'

type CreateEnrollment = {
  academic_year: number
  status_last_enrollment: string
  enrollment_date: string
  student_id: number
  classroom_id: number
}

interface CreateEnrollmentDialogProps {
  isOpen: boolean
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>
}

export function CreateEnrollmentDialog({ isOpen, onOpenChange }: CreateEnrollmentDialogProps) {
  const { t } = useTranslations()
  const [studentSearch, setStudentSearch] = useState('')
  const [classroomSearch, setClassroomSearch] = useState('')

  const initialValues: CreateEnrollment = {
    academic_year: new Date().getFullYear(),
    status_last_enrollment: 'active',
    enrollment_date: new Date().toISOString(),
    student_id: 0,
    classroom_id: 0
  }

  /* STUDENTS */
  const { data: students } = useQuery({
    queryKey: ['students'],
    queryFn: () => fetch('/admin/students-to-enrollments').then((response) => response.json()) as Promise<Student[]>
  })

  // Filtro optimizado para estudiantes
  const studentsFiltered = students?.filter((student) => {
    const searchTerm = normalizeString(studentSearch)
    if (!searchTerm) return true

    const fullName = [student.profile?.first_name, student.profile?.last_name, student.profile?.second_last_name]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()

    return fullName.includes(searchTerm)
  })

  /* CLASSROOMS */
  const { data: classrooms } = useQuery({
    queryKey: ['classrooms'],
    queryFn: () => fetch('/admin/get-classrooms').then((response) => response.json()) as Promise<Classroom[]>
  })

  // Filtro optimizado para aulas
  const classroomsFiltered = classrooms?.filter((classroom) => {
    const searchTerm = normalizeString(classroomSearch)
    if (!searchTerm) return true

    const classroomInfo = [classroom.grade, classroom.section, classroom.level].filter(Boolean).join(' ').toLowerCase()

    return classroomInfo.includes(searchTerm)
  })

  const { data, setData, post, processing, errors, reset } = useForm<CreateEnrollment>(initialValues)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    post(route('admin.enrollments.store'), {
      preserveScroll: true,
      preserveState: true,
      onSuccess: () => {
        reset()
        onOpenChange(false)
      }
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild className='w-fit'>
        <Button variant={isOpen ? 'info' : 'outline-info'}>Agregar matricula</Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[700px]'>
        <DialogTitle>Agregar matricula</DialogTitle>
        <DialogDescription>Complete el formulario para agregar una nueva matricula.</DialogDescription>

        <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
          <div className='grid grid-cols-2 gap-4'>
            {/* ACADEMIC_YEAR */}
            <div>
              <Label>Año academico</Label>
              <Input
                type='number'
                placeholder='Año academico'
                value={data.academic_year}
                onChange={(e) => setData('academic_year', Number(e.target.value))}
              />
              <InputError message={errors.academic_year} />
            </div>

            {/* ENROLLMENT_DATE */}
            <div>
              <Label>Fecha de matricula</Label>
              <Input
                type='date'
                placeholder='Fecha de matricula'
                value={data.enrollment_date}
                onChange={(e) => setData('enrollment_date', e.target.value)}
              />
              <InputError message={errors.enrollment_date} />
            </div>
          </div>

          <div className='grid grid-cols-2 gap-4'>
            {/* STUDENT */}
            <div>
              <Label>Estudiante</Label>
              <SearchableSelect
                value={data.student_id.toString()}
                searchValue={studentSearch}
                onSearchChange={(value) => {
                  setStudentSearch(value)
                }}
                onValueChange={(value) => setData('student_id', Number(value))}
                placeholder='Buscar estudiante...'
                searchPlaceholder='Buscar por nombre...'
              >
                {studentsFiltered?.map((student) => (
                  <SelectItem key={student.user_id} value={student.user_id.toString()}>
                    {`${student?.profile?.first_name} ${student?.profile?.last_name} ${student?.profile?.second_last_name}`}
                  </SelectItem>
                ))}
              </SearchableSelect>
              <InputError message={errors.student_id} />
            </div>

            {/* CLASSROOM */}
            <div>
              <Label>Clase</Label>
              <SearchableSelect
                value={data.classroom_id.toString()}
                searchValue={classroomSearch}
                onSearchChange={(value) => {
                  setClassroomSearch(value)
                }}
                onValueChange={(value) => setData('classroom_id', Number(value))}
                placeholder='Buscar clase...'
                searchPlaceholder='Buscar por nombre...'
              >
                {classroomsFiltered?.map((classroom) => (
                  <SelectItem key={classroom.id} value={classroom.id.toString()}>
                    {`${t(classroom.grade)} ${classroom.section} ${t(classroom.level)}`}
                  </SelectItem>
                ))}
              </SearchableSelect>
              <InputError message={errors.classroom_id} />
            </div>
          </div>

          {/* SUBMIT */}
          <Button type='submit' className='mt-2 w-full' disabled={processing}>
            {processing ? (
              <>
                <LoaderCircle className='mr-2 h-4 w-4 animate-spin' />
                Guardando...
              </>
            ) : (
              'Guardar matricula'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
