import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useTranslations } from '@/lib/translator'
import { TeacherClassroomCurricularAreaCycle } from '@/types/academic'
import { useQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'

interface ClassroomCurricularAreasDialogProps {
  userId: number
}

export function ClassroomCurricularAreasDialog({ userId }: ClassroomCurricularAreasDialogProps) {
  const { t } = useTranslations()
  const [isOpen, setIsOpen] = useState(false)

  const { data: teacherClassroomCurricularAreaCycles, isLoading } = useQuery<TeacherClassroomCurricularAreaCycle[]>({
    queryKey: ['teacher-classroom-curricular-area-cycles', userId],
    queryFn: async () =>
      (await fetch(`/admin/teachers/classroom-curricular-area-cycles/${userId}`)).json() as Promise<TeacherClassroomCurricularAreaCycle[]>,
    enabled: isOpen
  })

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>
        <Button variant={isOpen ? 'info' : 'outline-info'}>Ver áreas curriculares</Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[700px]'>
        <DialogTitle>Ver áreas curriculares</DialogTitle>

        <div className='flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4'>
          {isLoading ? (
            <Loader2 className='h-8 w-8 animate-spin' />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='h-12 font-medium'>Aula</TableHead>
                  <TableHead className='h-12 font-medium'>Área curricular</TableHead>
                  <TableHead className='h-12 font-medium'>Ciclo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teacherClassroomCurricularAreaCycles?.length ? (
                  teacherClassroomCurricularAreaCycles.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className='font-medium'>
                        {`${t(item.classroom?.grade)} ${item.classroom?.section} ${t(item.classroom?.level)}`}
                      </TableCell>
                      <TableCell>{item.curricular_area_cycle?.curricular_area?.name}</TableCell>
                      <TableCell>{item.curricular_area_cycle?.cycle?.name}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className='h-24 text-center'>
                      No se encontraron áreas curriculares asignadas.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
