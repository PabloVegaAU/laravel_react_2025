// /resources/js/Pages/student-search-modal.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { LoaderCircle, Search } from 'lucide-react'
import { useEffect, useState } from 'react'

type Student = {
  student_id: number
  nombres: string
  correo: string
}

type Props = {
  teacherId: number
  isOpen: boolean
  onClose: () => void
  onSelect: (student: Student) => void
}

export function StudentSearchModal({ teacherId, isOpen, onClose, onSelect }: Props) {
  const [query, setQuery] = useState('')
  const queryClient = useQueryClient()

  const { data: response = [], isLoading } = useQuery({
    queryKey: ['teacher-students-search', teacherId, query],
    queryFn: () =>
      fetch('/api/teacherstudentssearch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          p_teacher_id: teacherId,
          p_search: query
        })
      }).then((res) => res.json()),
    enabled: isOpen && query.length >= 3
  })

  const students = response?.data || []

  useEffect(() => {
    if (!isOpen) {
      queryClient.resetQueries({ queryKey: ['teacher-students-search', teacherId] })
      setQuery('')
    }
  }, [isOpen, teacherId, queryClient])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-h-[90vh] w-full !max-w-4xl overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Logros de estudiantes</DialogTitle>
        </DialogHeader>

        <div className='relative mb-4'>
          <Search className='absolute top-2.5 left-2.5 h-4 w-4 text-gray-500' />
          <Input type='text' placeholder='Buscar por nombre o correo...' className='pl-8' value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>

        <div className='h-96 overflow-auto pr-2'>
          {isLoading ? (
            <div className='flex items-center justify-center py-8'>
              <LoaderCircle className='size-8 animate-spin text-gray-500' />
            </div>
          ) : students.length > 0 ? (
            <ul className='space-y-3'>
              {students.map((student: Student) => (
                <li
                  key={student.student_id}
                  className='cursor-pointer rounded-md px-3 py-2 hover:bg-gray-100'
                  onClick={() => {
                    onSelect(student)
                    onClose()
                  }}
                >
                  <div className='font-semibold text-gray-900'>{student.nombres}</div>
                  <div className='text-sm text-gray-500'>{student.correo}</div>
                </li>
              ))}
            </ul>
          ) : (
            <div className='px-2 text-sm text-gray-500'>{query.length >= 3 ? 'No se encontraron estudiantes' : 'Ingresa al menos 3 letras'}</div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
