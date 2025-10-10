import InputError from '@/components/input-error'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { UpdateStudent } from '@/types/user'
import { useForm } from '@inertiajs/react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { LoaderCircle } from 'lucide-react'
import { memo, useEffect } from 'react'

interface EditStudentDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  studentId: number
}
const EditStudentDialogComponent = memo(({ isOpen, onOpenChange, studentId }: EditStudentDialogProps) => {
  const queryClient = useQueryClient()

  const { data: student, isLoading } = useQuery({
    queryKey: ['student', studentId],
    queryFn: () => fetch(`/admin/students/${studentId}/edit`).then((res) => res.json()),
    enabled: isOpen && !!studentId
  })

  const { data, setData, put, processing, errors, reset } = useForm<UpdateStudent>()

  useEffect(() => {
    if (student) {
      setData({
        name: student.user.name ?? '',
        password: '',
        email: student.user.email ?? '',
        firstName: student.profile?.first_name ?? '',
        lastName: student.profile?.last_name ?? '',
        secondLastName: student.profile?.second_last_name ?? '',
        birthDate: student.profile?.birth_date ?? '',
        phone: student.profile?.phone ?? '',
        entryDate: student?.entry_date ?? ''
      })
    }
  }, [student])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!student) return

    put(route('admin.students.update', studentId), {
      preserveScroll: true,
      preserveState: true,
      onSuccess: () => {
        queryClient.resetQueries({ queryKey: ['student', studentId] })
        reset()
        onOpenChange(false)
      }
    })
  }

  const handleDialogOpenChange = (open: boolean) => {
    if (!open) {
      reset()
    }
    onOpenChange(open)
  }

  const isDisabled = isLoading || processing

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogOpenChange}>
      <DialogContent className='sm:max-w-[700px]'>
        <DialogTitle>Editar estudiante</DialogTitle>
        <DialogDescription>Complete el formulario para editar un estudiante.</DialogDescription>
        <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
          {/* USER */}
          <div className='grid grid-cols-2 gap-2'>
            <div className='flex flex-col gap-2'>
              <Label htmlFor='name'>Usuario</Label>
              <Input id='name' name='name' type='text' value={data.name} onChange={(e) => setData('name', e.target.value)} disabled={isDisabled} />
              <InputError message={errors.name} />
            </div>
            <div className='flex flex-col gap-2'>
              <Label htmlFor='password'>Contraseña</Label>
              <Input
                id='password'
                name='password'
                type='password'
                value={data.password}
                onChange={(e) => setData('password', e.target.value)}
                disabled={isDisabled}
              />
              <InputError message={errors.password} />
            </div>
          </div>

          <div className='flex flex-col gap-2'>
            <Label htmlFor='email'>Correo electrónico</Label>
            <Input id='email' name='email' type='email' value={data.email} onChange={(e) => setData('email', e.target.value)} disabled={isDisabled} />
            <InputError message={errors.email} />
          </div>

          {/* PROFILE */}
          <div className='grid grid-cols-3 gap-2'>
            <div className='flex flex-col gap-2'>
              <Label htmlFor='firstName'>Nombre</Label>
              <Input
                id='firstName'
                name='firstName'
                type='text'
                value={data.firstName}
                onChange={(e) => setData('firstName', e.target.value)}
                disabled={isDisabled}
              />
              <InputError message={errors.firstName} />
            </div>
            <div className='flex flex-col gap-2'>
              <Label htmlFor='lastName'>Apellido Paterno</Label>
              <Input
                id='lastName'
                name='lastName'
                type='text'
                value={data.lastName}
                onChange={(e) => setData('lastName', e.target.value)}
                disabled={isDisabled}
              />
              <InputError message={errors.lastName} />
            </div>
            <div className='flex flex-col gap-2'>
              <Label htmlFor='secondLastName'>Apellido Materno</Label>
              <Input
                id='secondLastName'
                name='secondLastName'
                type='text'
                value={data.secondLastName}
                onChange={(e) => setData('secondLastName', e.target.value)}
                disabled={isDisabled}
              />
              <InputError message={errors.secondLastName} />
            </div>
          </div>

          <div className='grid grid-cols-2 gap-2'>
            <div className='flex flex-col gap-2'>
              <Label htmlFor='birthDate'>Fecha de nacimiento</Label>
              <Input
                id='birthDate'
                name='birthDate'
                type='date'
                value={data.birthDate}
                onChange={(e) => setData('birthDate', e.target.value)}
                disabled={isDisabled}
              />
              <InputError message={errors.birthDate} />
            </div>

            <div className='flex flex-col gap-2'>
              <Label htmlFor='phone'>Teléfono</Label>
              <Input
                id='phone'
                name='phone'
                type='text'
                value={data.phone}
                onChange={(e) => setData('phone', e.target.value)}
                disabled={isDisabled}
              />
              <InputError message={errors.phone} />
            </div>
          </div>

          {/* STUDENT */}
          <div className='flex flex-col gap-2'>
            <Label htmlFor='entryDate'>Fecha de ingreso</Label>
            <Input
              id='entryDate'
              name='entryDate'
              type='date'
              value={data.entryDate}
              onChange={(e) => setData('entryDate', e.target.value)}
              disabled={isDisabled}
            />
            <InputError message={errors.entryDate} />
          </div>

          {/* SUBMIT */}
          <Button type='submit' className='mt-2 w-full' disabled={processing}>
            {processing ? (
              <>
                <LoaderCircle className='mr-2 h-4 w-4 animate-spin' />
                Guardando...
              </>
            ) : (
              'Guardar cambios'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
})

export { EditStudentDialogComponent as EditStudentDialog }
