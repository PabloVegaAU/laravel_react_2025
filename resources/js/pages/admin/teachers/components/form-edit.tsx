import InputError from '@/components/input-error'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { formatDateForInput } from '@/lib/formats'
import { useForm } from '@inertiajs/react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { LoaderCircle, PencilIcon } from 'lucide-react'
import { useEffect, useState } from 'react'

type EditTeacher = {
  /* USER */
  name: string
  password: string
  email: string
  /* PROFILE */
  firstName: string
  lastName: string
  secondLastName: string
  birthDate: string
  phone: string
  /* TEACHER */
}

interface EditTeacherDialogProps {
  userId: number
}

export function EditTeacherDialog({ userId }: EditTeacherDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const queryClient = useQueryClient()

  const { data: user, isLoading } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetch(`/admin/students/${userId}/edit`).then((res) => res.json()),
    enabled: isOpen
  })

  const { data, setData, put, processing, errors, reset } = useForm<EditTeacher>({
    name: user?.name ?? '',
    password: '',
    email: user?.email ?? '',
    firstName: user?.profile?.first_name ?? '',
    lastName: user?.profile?.last_name ?? '',
    secondLastName: user?.profile?.second_last_name ?? '',
    birthDate: formatDateForInput(user?.profile?.birth_date) ?? '',
    phone: user?.profile?.phone ?? ''
  })

  useEffect(() => {
    queryClient.resetQueries({ queryKey: ['user', userId] })
    reset()
  }, [queryClient, userId])

  useEffect(() => {
    if (user) {
      setData({
        name: user.name ?? '',
        password: '',
        email: user.email ?? '',
        firstName: user.profile?.first_name ?? '',
        lastName: user.profile?.last_name ?? '',
        secondLastName: user.profile?.second_last_name ?? '',
        birthDate: formatDateForInput(user.profile?.birth_date) ?? '',
        phone: user.profile?.phone ?? ''
      })
    }
  }, [user])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!user) return

    put(route('admin.teachers.update', user.id), {
      preserveScroll: true,
      preserveState: true,
      onSuccess: () => {
        queryClient.resetQueries({ queryKey: ['user', userId] })
        reset()
        setIsOpen(false)
      }
    })
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open)
      }}
    >
      <DialogTrigger>
        <Button variant={isOpen ? 'info' : 'outline-info'}>
          <PencilIcon className='size-4' />
        </Button>
      </DialogTrigger>

      {user && isOpen && !isLoading && (
        <DialogContent className='sm:max-w-[700px]'>
          <DialogTitle>Editar docente</DialogTitle>
          <DialogDescription>Complete el formulario para editar un docente.</DialogDescription>
          <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
            {/* USER */}
            <div className='grid grid-cols-2 gap-2'>
              <div className='flex flex-col gap-2'>
                <Label htmlFor='name'>Usuario</Label>
                <Input id='name' name='name' type='text' value={data.name} onChange={(e) => setData('name', e.target.value)} />
                <InputError message={errors.name} />
              </div>
              <div className='flex flex-col gap-2'>
                <Label htmlFor='password'>Contraseña</Label>
                <Input id='password' name='password' type='password' value={data.password} onChange={(e) => setData('password', e.target.value)} />
                <InputError message={errors.password} />
              </div>
            </div>

            <div className='flex flex-col gap-2'>
              <Label htmlFor='email'>Correo electrónico</Label>
              <Input id='email' name='email' type='email' value={data.email} onChange={(e) => setData('email', e.target.value)} />
              <InputError message={errors.email} />
            </div>

            {/* PROFILE */}
            <div className='grid grid-cols-3 gap-2'>
              <div className='flex flex-col gap-2'>
                <Label htmlFor='firstName'>Nombre</Label>
                <Input id='firstName' name='firstName' type='text' value={data.firstName} onChange={(e) => setData('firstName', e.target.value)} />
                <InputError message={errors.firstName} />
              </div>
              <div className='flex flex-col gap-2'>
                <Label htmlFor='lastName'>Apellido Paterno</Label>
                <Input id='lastName' name='lastName' type='text' value={data.lastName} onChange={(e) => setData('lastName', e.target.value)} />
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
                />
                <InputError message={errors.secondLastName} />
              </div>
            </div>

            <div className='grid grid-cols-2 gap-2'>
              <div className='flex flex-col gap-2'>
                <Label htmlFor='birthDate'>Fecha de nacimiento</Label>
                <Input id='birthDate' name='birthDate' type='date' value={data.birthDate} onChange={(e) => setData('birthDate', e.target.value)} />
                <InputError message={errors.birthDate} />
              </div>

              <div className='flex flex-col gap-2'>
                <Label htmlFor='phone'>Teléfono</Label>
                <Input id='phone' name='phone' type='text' value={data.phone} onChange={(e) => setData('phone', e.target.value)} />
                <InputError message={errors.phone} />
              </div>
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
      )}
    </Dialog>
  )
}
