import InputError from '@/components/input-error'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useForm } from '@inertiajs/react'
import { LoaderCircle } from 'lucide-react'

type CreateStudent = {
  name: string
  password: string
  email: string
  firstName: string
  lastName: string
  secondLastName: string
  birthDate: string
  phone: string
}

interface CreateTeacherDialogProps {
  isOpen: boolean
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>
}

export function CreateTeacherDialog({ isOpen, onOpenChange }: CreateTeacherDialogProps) {
  const initialValues: CreateStudent = {
    /* USER */
    name: '',
    password: '',
    email: '',
    /* PROFILE */
    firstName: '',
    lastName: '',
    secondLastName: '',
    birthDate: '',
    phone: ''
  }

  const { data, setData, post, processing, errors, reset } = useForm<CreateStudent>(initialValues)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    post(route('admin.teachers.store'), {
      preserveScroll: true,
      preserveState: true,
      onSuccess: () => {
        reset()
        onOpenChange(false)
      }
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild className='w-fit'>
        <Button variant={isOpen ? 'info' : 'outline-info'}>Agregar docente</Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[700px]'>
        <DialogTitle>Agregar docente</DialogTitle>
        <DialogDescription>Complete el formulario para agregar un nuevo docente.</DialogDescription>

        <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
          {/* USUARIO */}
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

          {/* PERFIL */}
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

          {/* BOTON DE SUBMIT */}
          <Button type='submit' className='mt-2 w-full' disabled={processing}>
            {processing ? (
              <>
                <LoaderCircle className='mr-2 h-4 w-4 animate-spin' />
                Guardando...
              </>
            ) : (
              'Guardar docente'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
