import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { LoaderCircle } from 'lucide-react'
import { useEffect } from 'react'

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
  const queryClient = useQueryClient()

  const { data: response = [], isLoading } = useQuery({
    queryKey: ['student-achievements', studentId],
    queryFn: () =>
      fetch('/api/studentachievementslist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ p_student_id: studentId })
      }).then((res) => res.json()),
    enabled: isOpen && studentId !== null
  })

  const achievements = response?.data || []

  useEffect(() => {
    if (!isOpen) {
      queryClient.resetQueries({ queryKey: ['student-achievements', studentId] })
    }
  }, [isOpen, studentId, queryClient])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-h-[90vh] w-full !max-w-6xl overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Logros del Estudiante</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className='flex items-center justify-center py-8'>
            <LoaderCircle className='size-8 animate-spin text-gray-500' />
          </div>
        ) : (
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
                  achievements.map((a: Achievement) => (
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
        )}
      </DialogContent>
    </Dialog>
  )
}
