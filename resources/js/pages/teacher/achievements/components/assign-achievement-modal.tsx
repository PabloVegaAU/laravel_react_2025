import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useState } from 'react'

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
}

interface AssignAchievementModalProps {
  isOpen: boolean
  onClose: () => void
  student: Student | null
}

export function AssignAchievementModal({ isOpen, onClose, student }: AssignAchievementModalProps) {
  const [selectedAchievement, setSelectedAchievement] = useState('')
  const [comment, setComment] = useState('')

  // Mock achievements - replace with actual API call
  const achievements: Achievement[] = [
    { id: 1, name: 'Excelente Participación', points: 10 },
    { id: 2, name: 'Trabajo en Equipo', points: 15 },
    { id: 3, name: 'Creatividad', points: 20 }
  ]

  const handleAssign = () => {
    // TODO: Implement assignment logic
    console.log('Assigning achievement:', { student, achievementId: selectedAchievement, comment })
    onClose()
  }

  if (!student) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>Asignar Logro</DialogTitle>
          <DialogDescription>
            Asignar un logro a {student.name} - {student.grade}° {student.section}
          </DialogDescription>
        </DialogHeader>

        <div className='grid gap-4 py-4'>
          <div className='space-y-2'>
            <Label htmlFor='achievement'>Logro</Label>
            <Select onValueChange={setSelectedAchievement} value={selectedAchievement}>
              <SelectTrigger>
                <SelectValue placeholder='Seleccionar logro' />
              </SelectTrigger>
              <SelectContent>
                {achievements.map((achievement) => (
                  <SelectItem key={achievement.id} value={achievement.id.toString()}>
                    {achievement.name} ({achievement.points} pts)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='comment'>Comentario (Opcional)</Label>
            <Textarea
              id='comment'
              placeholder='Agrega un comentario sobre este logro...'
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
        </div>

        <div className='mt-4 flex justify-end space-x-2'>
          <Button variant='outline' onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleAssign} disabled={!selectedAchievement}>
            Asignar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
