import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { LoaderCircle, X } from 'lucide-react'
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
  const [assignedStudents, setAssignedStudents] = useState<Student[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const queryClient = useQueryClient()
  const itemsPerPage = 10

  const { data: availableStudentsData, isLoading: isLoadingAvailable } = useQuery({
    queryKey: ['available-students', achievementId, teacherId, currentPage],
    queryFn: () =>
      fetch('/api/getstudentbyachievementteacher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          p_achievement_id: achievementId,
          p_teacher_id: teacherId,
          p_with_achievement: false,
          p_page: currentPage,
          p_per_page: itemsPerPage
        })
      }).then((res) => res.json()),
    enabled: isOpen && achievementId !== null && teacherId !== null
  })

  const { data: assignedStudentsData, isLoading: isLoadingAssigned } = useQuery({
    queryKey: ['assigned-students', achievementId, teacherId],
    queryFn: () =>
      fetch('/api/getstudentbyachievementteacher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          p_achievement_id: achievementId,
          p_teacher_id: teacherId,
          p_with_achievement: true,
          p_page: 1,
          p_per_page: 100
        })
      }).then((res) => res.json()),
    enabled: isOpen && achievementId !== null && teacherId !== null
  })

  const availableStudents = availableStudentsData?.data || []
  const totalCount = availableStudentsData?.pagination?.total_count || 0
  const totalPages = availableStudentsData?.pagination?.total_pages || 0

  useEffect(() => {
    if (assignedStudentsData?.data) {
      setAssignedStudents(assignedStudentsData.data)
    }
  }, [assignedStudentsData])

  useEffect(() => {
    if (!isOpen) {
      queryClient.resetQueries({ queryKey: ['available-students', achievementId, teacherId] })
      queryClient.resetQueries({ queryKey: ['assigned-students', achievementId, teacherId] })
      setCurrentPage(1)
      setSearchTerm('')
      setAssignedStudents([])
    }
  }, [isOpen, achievementId, teacherId, queryClient])

  useEffect(() => {
    if (isOpen) {
      queryClient.invalidateQueries({ queryKey: ['available-students', achievementId, teacherId, currentPage] })
    }
  }, [currentPage, isOpen, achievementId, teacherId, queryClient])

  const addToAssigned = (student: Student) => {
    if (!assignedStudentIds.includes(student.user_id)) {
      setAssignedStudents((prev) => [...prev, student])
    }
  }

  const removeFromAssigned = (id: number) => {
    setAssignedStudents((prev) => prev.filter((s) => s.user_id !== id))
  }

  const assignMutation = useMutation({
    mutationFn: () =>
      fetch('/api/achievementassigntwo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          p_achievement_id: achievementId,
          p_teacher_id: teacherId,
          p_student_ids: assignedStudents.map((s) => s.user_id)
        })
      }).then((res) => res.json()),
    onSuccess: (data) => {
      const result = data?.data?.[0] || {}
      const mensaje = result.message || 'Logro(s) sincronizado(s)'
      toast.success(`✅ ${mensaje}`)
      queryClient.invalidateQueries({ queryKey: ['assigned-students', achievementId, teacherId] })
      queryClient.invalidateQueries({ queryKey: ['available-students', achievementId, teacherId] })
      onClose()
    },
    onError: (err) => {
      console.error('❌ Error al sincronizar logro:', err)
      toast.error('❌ Error al sincronizar logro')
    }
  })

  const handleAssign = () => {
    assignMutation.mutate()
  }

  const filteredStudents = availableStudents.filter(
    (s: Student) =>
      `${s.first_name} ${s.last_name} ${s.second_last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.user_name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Use API data directly since pagination is done server-side
  const paginatedStudents = filteredStudents

  const assignedStudentIds = assignedStudents.map((s: Student) => s.user_id)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-h-[90vh] w-full !max-w-[95vw] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='text-xl font-bold'>ASIGNAR LOGRO A ESTUDIANTES</DialogTitle>
        </DialogHeader>

        <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
          {/* Left Side - Students with achievement */}
          <div className='space-y-4'>
            <div>
              <Label className='text-sm font-semibold'>USUARIOS CON LOGRO</Label>
              <div className='mt-2 min-h-[100px] rounded-md border bg-gray-50 p-3'>
                {assignedStudents.length > 0 ? (
                  <div className='flex flex-wrap gap-2'>
                    {assignedStudents.map((s: Student) => (
                      <div key={s.user_id} className='flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800'>
                        {s.first_name} {s.last_name}
                        <button
                          onClick={() => removeFromAssigned(s.user_id)}
                          className='ml-1 flex size-4 cursor-pointer items-center justify-center rounded-full hover:bg-red-200'
                        >
                          <X className='size-3 text-red-600' />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className='text-sm text-gray-500'>No hay estudiantes con este logro asignado</p>
                )}
              </div>
            </div>

            <Button onClick={handleAssign} disabled={assignMutation.isPending} className='w-full bg-blue-600 hover:bg-blue-700'>
              {assignMutation.isPending ? <LoaderCircle className='mr-2 size-4 animate-spin' /> : null}
              GUARDAR CAMBIOS
            </Button>
          </div>

          {/* Right Side - Available students */}
          <div className='space-y-4'>
            <div>
              <Label htmlFor='search' className='text-sm font-semibold'>
                Buscar:
              </Label>
              <Input
                id='search'
                type='text'
                placeholder='Buscar usuario...'
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setCurrentPage(1)
                }}
                className='mt-2'
              />
            </div>

            <div className='flex flex-col overflow-hidden rounded-lg border bg-white' style={{ height: '400px' }}>
              <div className='flex-1 overflow-y-auto'>
                {isLoadingAvailable ? (
                  <div className='flex items-center justify-center py-8'>
                    <LoaderCircle className='size-8 animate-spin text-gray-500' />
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className='font-semibold'>NOMBRE COMPLETO</TableHead>
                        <TableHead className='text-center font-semibold'>ACCIÓN</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedStudents.map((s: Student) => (
                        <TableRow key={s.user_id} className='cursor-pointer hover:bg-gray-50'>
                          <TableCell className='font-medium'>
                            {s.first_name} {s.last_name} {s.second_last_name}
                          </TableCell>
                          <TableCell className='text-center'>
                            {assignedStudentIds.includes(s.user_id) ? (
                              <Button
                                onClick={() => removeFromAssigned(s.user_id)}
                                className='flex size-8 cursor-pointer items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600'
                              >
                                <X className='size-4' />
                              </Button>
                            ) : (
                              <Button
                                onClick={() => addToAssigned(s)}
                                className='flex size-8 cursor-pointer items-center justify-center rounded-full bg-green-500 text-white hover:bg-green-600'
                              >
                                <span className='text-lg font-bold'>+</span>
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                      {paginatedStudents.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={2} className='py-8 text-center text-gray-500'>
                            No se encontraron usuarios
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                )}
              </div>
            </div>

            {/* Pagination */}
            <div className='space-y-2'>
              <div className='flex items-center justify-between text-sm text-gray-600'>
                <span>
                  Mostrando página {currentPage} de {totalPages} ({totalCount} elementos en total)
                </span>
                <span>Haga clic en una fila para seleccionarla</span>
              </div>
              <div className='flex items-center justify-center gap-1'>
                <Button variant='outline' size='sm' onClick={() => setCurrentPage(1)} disabled={currentPage === 1} className='h-8 px-3'>
                  Primero
                </Button>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className='h-8 px-3'
                >
                  Anterior
                </Button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum
                  if (totalPages <= 5) {
                    pageNum = i + 1
                  } else if (currentPage <= 3) {
                    pageNum = i + 1
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i
                  } else {
                    pageNum = currentPage - 2 + i
                  }
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? 'default' : 'outline'}
                      size='sm'
                      onClick={() => setCurrentPage(pageNum)}
                      className='h-8 w-8 p-0'
                    >
                      {pageNum}
                    </Button>
                  )
                })}
                {totalPages > 5 && <span className='px-2'>...</span>}
                {totalPages > 5 && (
                  <Button
                    variant={currentPage === totalPages ? 'default' : 'outline'}
                    size='sm'
                    onClick={() => setCurrentPage(totalPages)}
                    className='h-8 w-8 p-0'
                  >
                    {totalPages}
                  </Button>
                )}
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className='h-8 px-3'
                >
                  Siguiente
                </Button>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className='h-8 px-3'
                >
                  Último
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Cancel Button */}
        <div className='mt-6 flex justify-end'>
          <Button variant='destructive' onClick={onClose} className='gap-2'>
            <X className='size-4' />
            CANCELAR
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
