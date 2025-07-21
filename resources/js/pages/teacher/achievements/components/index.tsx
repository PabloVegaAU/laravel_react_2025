import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import AppLayout from '@/layouts/app-layout'
import { Plus, Search } from 'lucide-react'
import { useState } from 'react'
import { AssignAchievementModal } from './assign-achievement-modal'

type Student = {
  id: number
  name: string
  grade: string
  section: string
  achievements: number
}

export default function TeacherAchievementsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)

  // Mock data - replace with actual API call
  const students: Student[] = [
    { id: 1, name: 'Juan Pérez', grade: '5to', section: 'A', achievements: 3 },
    { id: 2, name: 'María Gómez', grade: '5to', section: 'A', achievements: 5 },
    { id: 3, name: 'Carlos López', grade: '5to', section: 'B', achievements: 2 }
  ]

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.grade.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.section.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAssignAchievement = (student: Student) => {
    setSelectedStudent(student)
    setIsAssignModalOpen(true)
  }

  const handleViewAchievements = (student: Student) => {
    setSelectedStudent(student)
    setIsViewModalOpen(true)
  }

  return (
    <AppLayout>
      <div className='container mx-auto p-6'>
        <div className='mb-6 flex items-center justify-between'>
          <h1 className='text-2xl font-bold text-gray-800'>Gestión de Logros</h1>
          <div className='relative w-64'>
            <Search className='absolute top-2.5 left-2.5 h-4 w-4 text-gray-500' />
            <Input
              type='search'
              placeholder='Buscar estudiante...'
              className='pl-8'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className='rounded-lg border bg-white'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Estudiante</TableHead>
                <TableHead>Grado</TableHead>
                <TableHead>Sección</TableHead>
                <TableHead>Logros</TableHead>
                <TableHead className='text-right'>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className='font-medium'>{student.name}</TableCell>
                  <TableCell>{student.grade}</TableCell>
                  <TableCell>{student.section}</TableCell>
                  <TableCell>{student.achievements}</TableCell>
                  <TableCell className='flex justify-end space-x-2'>
                    <Button variant='outline' size='sm' onClick={() => handleViewAchievements(student)}>
                      Ver logros
                    </Button>
                    <Button size='sm' onClick={() => handleAssignAchievement(student)}>
                      <Plus className='mr-2 h-4 w-4' />
                      Asignar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <AssignAchievementModal isOpen={isAssignModalOpen} onClose={() => setIsAssignModalOpen(false)} student={selectedStudent} />
      </div>
    </AppLayout>
  )
}
