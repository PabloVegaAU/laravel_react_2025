import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import axios from 'axios'
import { useEffect, useState } from 'react'

type Props = {
  isOpen: boolean
  onClose: () => void
  studentId: number | null
}

type Achievement = {
  id: number
  name: string
  description: string
  assigned_at: string
}

export function StudentAchievementsModal({ isOpen, onClose, studentId }: Props) {
  const [achievements, setAchievements] = useState<Achievement[]>([])

  useEffect(() => {
    if (isOpen && studentId !== null) {
      fetchAchievements(studentId)
    }
  }, [isOpen, studentId])

  const fetchAchievements = async (id: number) => {
    try {
      console.log('📩 Enviando ID del estudiante:', id)
      const response = await axios.post(
        '/api/studentachievementslist',
        { p_student_id: id },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
      if (response.data.success) {
        setAchievements(response.data.data)
      } else {
        console.warn('⚠️ Respuesta sin éxito:', response.data)
      }
    } catch (error) {
      console.error('❌ Error al cargar logros del estudiante:', error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='w-full max-w-3xl'>
        <DialogHeader>
          <DialogTitle>Logros del Estudiante</DialogTitle>
        </DialogHeader>

        <div className='max-h-[70vh] overflow-x-auto rounded-lg border bg-white'>
          <Table className='min-w-full text-sm'>
            <TableHeader>
              <TableRow>
                <TableHead className='w-[50px]'>ID</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead className='whitespace-nowrap'>Asignado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {achievements.length > 0 ? (
                achievements.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell>{a.id}</TableCell>
                    <TableCell className='font-medium'>{a.name}</TableCell>
                    <TableCell>{a.description}</TableCell>
                    <TableCell className='whitespace-nowrap'>{new Date(a.assigned_at).toLocaleString()}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className='py-4 text-center text-gray-500'>
                    No hay logros asignados
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  )
}
