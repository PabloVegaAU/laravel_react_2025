import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

type Student = {
  id: number
  name: string
  grade: string
  section: string
}

type Achievement = {
  id: number
  name: string
  points: number
  date: string
  assignedBy: string
  comment?: string
}

interface ViewStudentAchievementsModalProps {
  isOpen: boolean
  onClose: () => void
  student: Student | null
}

export function ViewStudentAchievementsModal({ isOpen, onClose, student }: ViewStudentAchievementsModalProps) {
  // Mock data - replace with actual API call
  const achievements: Achievement[] = [
    { id: 1, name: 'Excelente Participación', points: 10, date: '2023-10-15', assignedBy: 'Prof. García', comment: 'Muy buen trabajo en clase' },
    { id: 2, name: 'Trabajo en Equipo', points: 15, date: '2023-10-10', assignedBy: 'Prof. García' },
    { id: 3, name: 'Creatividad', points: 20, date: '2023-10-05', assignedBy: 'Prof. Rodríguez' }
  ]

  if (!student) return null

  const totalPoints = achievements.reduce((sum, achievement) => sum + achievement.points, 0)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-3xl'>
        <DialogHeader>
          <DialogTitle>Logros de {student.name}</DialogTitle>
          <DialogDescription>
            {student.grade}° {student.section} - Total de puntos:{' '}
            <Badge variant='outline' className='ml-1'>
              {totalPoints} pts
            </Badge>
          </DialogDescription>
        </DialogHeader>

        <div className='rounded-md border'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Logro</TableHead>
                <TableHead>Puntos</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Asignado por</TableHead>
                <TableHead>Comentario</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {achievements.length > 0 ? (
                achievements.map((achievement) => (
                  <TableRow key={achievement.id}>
                    <TableCell className='font-medium'>{achievement.name}</TableCell>
                    <TableCell>
                      <Badge variant='outline'>{achievement.points} pts</Badge>
                    </TableCell>
                    <TableCell>{new Date(achievement.date).toLocaleDateString()}</TableCell>
                    <TableCell>{achievement.assignedBy}</TableCell>
                    <TableCell className='text-gray-500'>{achievement.comment || '-'}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className='py-4 text-center text-gray-500'>
                    El estudiante no tiene logros registrados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className='mt-4 flex justify-end'>
          <Button variant='outline' onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
