import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

type Props = {
  isOpen: boolean
  onClose: () => void
  achievementId: number | null
  teacherId: number | null
}

type Student = {
  user_id: number
  user_name: string
  first_name: string
  last_name: string
  second_last_name: string
  status: string
  points_store: string
}

export function AssignAchievementModal({ isOpen, onClose, achievementId, teacherId }: Props) {
  const [students, setStudents] = useState<Student[]>([])
  const [selectedIds, setSelectedIds] = useState<number[]>([])

  useEffect(() => {
    if (isOpen) {
      fetchStudents()
      setSelectedIds([])
    }
  }, [isOpen])

  const fetchStudents = async () => {
    if (!achievementId) return

    try {
      const res = await axios.post('/api/getstudentbyachievementteacher', { p_achievement_id: achievementId, p_teacher_id: teacherId })
      setStudents(res.data)
    } catch (err) {
      console.error('❌ Error al obtener estudiantes:', err)
      toast.error('Error al cargar los estudiantes')
    }
  }

  const toggleSelection = (id: number) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))
  }

  const handleAssign = async () => {
    try {
      const res = await axios.post('/api/achievementassigntwo', {
        p_achievement_id: achievementId,
        p_student_ids: selectedIds
      })

      const result = res.data?.data?.[0] || {}
      const mensaje = result.mensa || 'Logro(s) asignado(s)'
      alert(`✅ ${mensaje}`)

      onClose()
    } catch (err) {
      console.error('❌ Error al asignar logro:', err)
      alert('❌ Error al asignar logro')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-3xl'>
        <DialogHeader>
          <DialogTitle>Asignar logro a estudiantes</DialogTitle>
        </DialogHeader>

        <div className='rounded-lg border bg-white'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead></TableHead>
                <TableHead>Puntos</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Puntos</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((s) => (
                <TableRow key={s.user_id}>
                  <TableCell>
                    <Checkbox checked={selectedIds.includes(s.user_id)} onCheckedChange={() => toggleSelection(s.user_id)} />
                  </TableCell>
                  <TableCell className='font-medium'>{s.first_name}</TableCell>
                  <TableCell className='font-medium'>
                    {s.last_name} {s.second_last_name}
                  </TableCell>
                  <TableCell>{s.points_store}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className='mt-4 text-right'>
          <Button onClick={handleAssign} disabled={selectedIds.length === 0}>
            Asignar a {selectedIds.length} estudiante(s)
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
