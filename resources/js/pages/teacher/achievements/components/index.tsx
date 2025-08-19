import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import AppLayout from '@/layouts/app-layout'
import { BreadcrumbItem, SharedData } from '@/types/core'
import { Head, usePage } from '@inertiajs/react'
import axios from 'axios'
import { Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import { AssignAchievementModal } from './AssignAchievementModal'
import { StudentSearchModal } from './student-search-modal'
import { StudentAchievementsModal } from './StudentAchievementsModal'

type Achievement = {
  id: number
  name: string
  description: string
  activo: boolean
}

type Student = {
  id: number
  name: string
  email: string
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Inicio',
    href: '/teacher/dashboard'
  },
  {
    title: 'Logros',
    href: '/teacher/achievements'
  }
]

export default function AchievementsListPage() {
  const { auth } = usePage<SharedData>().props

  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false)
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false)
  const [isAchievementsModalOpen, setIsAchievementsModalOpen] = useState(false)
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null)
  const [assignModalOpen, setAssignModalOpen] = useState(false)
  const [selectedAchievement, setSelectedAchievement] = useState<number | null>(null)

  useEffect(() => {
    fetchAchievements()
  }, [])

  const fetchAchievements = async () => {
    try {
      const response = await axios.post('/api/achievementslist')
      if (Array.isArray(response.data)) {
        setAchievements(response.data)
      } else {
        console.error('Respuesta inesperada:', response.data)
      }
    } catch (error) {
      console.error('❌ Error al cargar logros:', error)
    }
  }

  const filtered = achievements.filter(
    (a) => a.name.toLowerCase().includes(searchTerm.toLowerCase()) || a.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title='Listado de Logros' />
      <div className='container mx-auto p-6'>
        <div className='mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
          <h1 className='text-2xl font-bold text-gray-800'>Listado de Logros</h1>
          <div className='flex gap-4'>
            <div className='relative w-64'>
              <Search className='absolute top-2.5 left-2.5 h-4 w-4 text-gray-500' />
              <Input
                type='search'
                placeholder='Buscar logro...'
                className='pl-8'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button onClick={() => setIsSearchModalOpen(true)}>Buscar estudiante</Button>
          </div>
        </div>

        <div className='rounded-lg border bg-white'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Activo</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((achievement) => (
                <TableRow key={achievement.id}>
                  <TableCell>{achievement.id}</TableCell>
                  <TableCell className='font-medium'>{achievement.name}</TableCell>
                  <TableCell>{achievement.description}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-block rounded-full px-3 py-1 text-sm font-semibold ${achievement.activo ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}
                    >
                      {achievement.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button
                      onClick={() => {
                        setSelectedAchievement(achievement.id)
                        setAssignModalOpen(true)
                      }}
                    >
                      Asignar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <StudentSearchModal
        teacherId={auth.user.id}
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onSelect={(student) => {
          setSelectedStudentId(student.student_id)
          setIsSearchModalOpen(false)
          setIsAchievementsModalOpen(true)
        }}
      />

      <StudentAchievementsModal isOpen={isAchievementsModalOpen} onClose={() => setIsAchievementsModalOpen(false)} studentId={selectedStudentId} />

      <AssignAchievementModal
        isOpen={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        achievementId={selectedAchievement}
        teacherId={auth.user.id}
      />
    </AppLayout>
  )
}
