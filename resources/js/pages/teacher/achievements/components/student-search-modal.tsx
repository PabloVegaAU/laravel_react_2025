// /resources/js/Pages/student-search-modal.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

import axios from 'axios'
import { Search } from 'lucide-react'
import { useEffect, useState } from 'react'

type Student = {
  student_id: number
  nombres: string
  correo: string
}

type Props = {
  isOpen: boolean
  onClose: () => void
  onSelect: (student: Student) => void
}

export function StudentSearchModal({ isOpen, onClose, onSelect }: Props) {
  const [query, setQuery] = useState('')
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (query.length >= 3) {
      searchStudents(query)
    } else {
      setStudents([])
    }
  }, [query])

  const searchStudents = async (search: string) => {
    try {
      setLoading(true)
      const response = await axios.post('/api/studentssearch', {
        p_search: search
      })

      if (response.data.success) {
        setStudents(response.data.data)
      } else {
        setStudents([])
      }
    } catch (error) {
      console.error('❌ Error al buscar estudiantes:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle>Logros de estudiantes</DialogTitle>
        </DialogHeader>

        <div className='relative mb-4'>
          <Search className='absolute top-2.5 left-2.5 h-4 w-4 text-gray-500' />
          <Input type='text' placeholder='Buscar por nombre o correo...' className='pl-8' value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>

        <div className='h-64 overflow-auto pr-2'>
          {students.length > 0 ? (
            <ul className='space-y-3'>
              {students.map((student) => (
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
            <div className='px-2 text-sm text-gray-500'>
              {loading ? 'Buscando...' : query.length >= 3 ? 'No se encontraron estudiantes' : 'Ingresa al menos 3 letras'}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
