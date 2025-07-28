import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import axios from 'axios'
import { Search } from 'lucide-react'
import { useEffect, useState } from 'react'

interface Student {
  id: number
  name: string
  email: string
}

interface Props {
  isOpen: boolean
  onClose: () => void
  onSelect: (student: Student) => void
}

export function StudentSearchModal({ isOpen, onClose, onSelect }: Props) {
  const [searchTerm, setSearchTerm] = useState('')
  const [results, setResults] = useState<Student[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (searchTerm.length >= 3) {
      const delayDebounce = setTimeout(() => {
        fetchStudents(searchTerm)
      }, 400)
      return () => clearTimeout(delayDebounce)
    } else {
      setResults([])
    }
  }, [searchTerm])

  const fetchStudents = async (search: string) => {
    try {
      setLoading(true)
      const response = await axios.post('/api/studentssearch', { p_search: search })
      if (response.data.success) {
        setResults(response.data.data)
      }
    } catch (error) {
      console.error('❌ Error al buscar estudiantes:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Logros de estudiantes</DialogTitle>
        </DialogHeader>

        <div className='relative'>
          <Search className='absolute top-2.5 left-2.5 h-4 w-4 text-gray-500' />
          <Input placeholder='Buscar estudiante...' className='pl-8' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>

        <div className='mt-3 rounded-md border bg-black text-white shadow-md'>
          {loading && <div className='p-4 text-sm'>Buscando...</div>}
          {!loading && results.length > 0 && (
            <div className='divide-y divide-gray-700'>
              {results.map((student) => (
                <div
                  key={student.id}
                  onClick={() => {
                    onSelect(student)
                    onClose()
                  }}
                  className='flex cursor-pointer items-center justify-between px-4 py-2 hover:bg-gray-800'
                >
                  <div className='flex items-center space-x-3'>
                    <span className='inline-block h-6 w-6 rounded-full bg-white pt-0.5 text-center text-xs font-bold text-black'>👤</span>
                    <div>
                      <div className='font-semibold'>{student.name}</div>
                      <div className='text-xs text-gray-300'>{student.email}</div>
                    </div>
                  </div>
                  <button className='rounded bg-green-700 px-2 py-1 text-xs font-semibold hover:bg-green-800'>Ver logros</button>
                </div>
              ))}
            </div>
          )}
          {!loading && results.length === 0 && searchTerm.length >= 3 && (
            <div className='p-4 text-sm text-gray-400'>No se encontraron resultados.</div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
