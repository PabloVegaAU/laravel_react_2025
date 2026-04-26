import { Head, useForm } from '@inertiajs/react'
import { LoaderCircle } from 'lucide-react'
import { FormEventHandler, useState } from 'react'

import AppLogoIcon from '@/components/app-logo-icon'
import InputError from '@/components/input-error'
import TextLink from '@/components/text-link'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type LoginForm = {
  name: string
  password: string
  remember: boolean
}

interface LoginProps {
  status?: string
  canResetPassword: boolean
}

export default function Login({ status, canResetPassword }: LoginProps) {
  const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
    name: '',
    password: '',
    remember: false
  })

  const [showPassword, setShowPassword] = useState(false)

  const submit: FormEventHandler = (e) => {
    e.preventDefault()
    post(route('login'), {
      onFinish: () => reset('password')
    })
  }

  return (
    <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-green-700 via-green-600 to-green-800 p-4'>
      <Head title='Iniciar sesión' />

      <div className='grid w-full max-w-6xl overflow-hidden rounded-2xl bg-white/10 shadow-2xl backdrop-blur-lg md:grid-cols-2'>
        {/* Lado izquierdo */}
        <div className='relative flex flex-col justify-between bg-gradient-to-br from-green-600/80 to-green-800/80 p-10 text-white'>
          {/* Logo */}
          <div className='flex items-center gap-3'>
            <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-white'>
              <AppLogoIcon className='size-9 fill-current text-[var(--foreground)] dark:text-white' />
            </div>
            <div>
              <h1 className='text-lg font-bold'>I.E. Julio C. Tello</h1>
              <p className='text-sm text-green-200'>Aprende • Juega • Crece</p>
            </div>
          </div>

          {/* Bienvenida */}
          <div>
            <h2 className='mb-2 text-4xl font-extrabold'>¡BIENVENIDO!</h2>
            <p className='text-lg text-green-100'>"Aprendiendo a través de la gamificación y desarrollo de competencias"</p>
          </div>

          {/* Beneficios */}
          <div className='rounded-xl bg-white/10 p-4 backdrop-blur-md'>
            <div className='mb-2 flex items-center gap-3'>
              <span className='text-xl'>🏆</span>
              <p>
                <strong>Gana logros:</strong> Completa actividades
              </p>
            </div>
            <div className='mb-2 flex items-center gap-3'>
              <span className='text-xl'>⭐</span>
              <p>
                <strong>Sube de nivel:</strong> Acumula puntos
              </p>
            </div>
            <div className='flex items-center gap-3'>
              <span className='text-xl'>🎯</span>
              <p>
                <strong>Mejora tus habilidades</strong>
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className='flex justify-between text-sm text-green-200'>
            <span>✔ Seguro</span>
            <span>🔒 Confiable</span>
            <span>👥 Colaborativo</span>
          </div>
        </div>

        {/* Lado derecho (Login) */}
        <div className='flex flex-col justify-center bg-white p-10'>
          {/* Título */}
          <div className='mb-6 text-center'>
            <div className='mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-green-600 text-xl text-white'>🔒</div>
            <h2 className='text-2xl font-bold text-gray-800'>Iniciar sesión</h2>
            <p className='text-sm text-gray-500'>Ingresa tus credenciales</p>
          </div>

          {/* Formulario */}
          <form className='space-y-4' onSubmit={submit}>
            {/* Usuario */}
            <div className='grid gap-2'>
              <div className='relative'>
                <Input
                  id='name'
                  type='text'
                  required
                  autoFocus
                  tabIndex={1}
                  autoComplete='name'
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                  placeholder='Usuario'
                  className='pl-10'
                />
                <span className='absolute top-3 left-3 text-gray-400'>👤</span>
              </div>
              <InputError message={errors.name} />
            </div>

            {/* Contraseña */}
            <div className='grid gap-2'>
              <div className='relative'>
                <Input
                  id='password'
                  type={showPassword ? 'text' : 'password'}
                  required
                  tabIndex={2}
                  autoComplete='current-password'
                  value={data.password}
                  onChange={(e) => setData('password', e.target.value)}
                  placeholder='Contraseña'
                  className='pr-10 pl-10'
                />
                <span className='absolute top-3 left-3 text-gray-400'>🔑</span>
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute top-3 right-3 cursor-pointer text-gray-400 hover:text-gray-600'
                  tabIndex={-1}
                >
                  👁
                </button>
              </div>
              <InputError message={errors.password} />
            </div>

            {/* Opciones */}
            <div className='flex items-center justify-between text-sm'>
              <div className='flex items-center space-x-2'>
                <Checkbox id='remember' name='remember' checked={data.remember} onClick={() => setData('remember', !data.remember)} tabIndex={3} />
                <Label htmlFor='remember' className='cursor-pointer'>
                  Recordarme
                </Label>
              </div>
              {canResetPassword && (
                <TextLink href={route('password.request')} className='text-green-600 hover:underline' tabIndex={5}>
                  ¿Olvidaste?
                </TextLink>
              )}
            </div>

            {/* Botón */}
            <Button type='submit' className='w-full bg-green-600 font-semibold transition hover:bg-green-700' tabIndex={4} disabled={processing}>
              {processing && <LoaderCircle className='mr-2 h-4 w-4 animate-spin' />}
              Iniciar sesión
            </Button>
          </form>
        </div>
      </div>

      {status && (
        <div className='fixed top-4 right-4 rounded-lg border border-green-400 bg-green-100 px-4 py-3 text-green-700 shadow-lg'>{status}</div>
      )}
    </div>
  )
}
