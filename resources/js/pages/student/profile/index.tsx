import AppLayout from '@/layouts/app-layout'
import { useUserStore } from '@/store/useUserStore'
import { BreadcrumbItem } from '@/types/core'
import { Head } from '@inertiajs/react'
import { useEffect } from 'react'

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Perfil',
    href: 'student/profile'
  }
]

export default function Profile() {
  const { setCurrentDashboardRole } = useUserStore()

  useEffect(() => {
    setCurrentDashboardRole('/student/profile')
  }, [])

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title='Tu Perfil' />
      <div className='w-full space-y-8 px-4 py-6 sm:px-6 lg:px-8'>
        <div className='mx-auto w-full max-w-7xl space-y-8'>
          {/* Header Section */}
          <div className='mb-8 flex items-center justify-between'>
            <h2 className='text-2xl font-bold text-gray-800'>Mi Perfil</h2>
            <a
              href={route('student.objects')}
              className='inline-block rounded-lg bg-blue-500 px-6 py-2 text-white transition-colors hover:bg-blue-600'
            >
              Mis objetos
            </a>
          </div>

          {/* Gamification Card */}
          <div className='mb-8 rounded-xl bg-white p-6 shadow-md'>
            <h3 className='mb-4 text-xl font-semibold text-gray-700'>Gamificación</h3>
            <div className='flex items-center space-x-6'>
              <div className='flex-1'>
                <div className='rounded-lg bg-green-100 p-4'>
                  <div className='mb-1 text-sm text-gray-600'>Nivel actual</div>
                  <div className='text-2xl font-bold text-green-700'>5</div>
                  <div className='mt-2 h-2.5 w-full rounded-full bg-gray-200'>
                    <div className='h-2.5 rounded-full bg-green-500' style={{ width: '65%' }}></div>
                  </div>
                  <div className='mt-1 text-xs text-gray-500'>65% completado</div>
                </div>
              </div>
              <div className='flex-1'>
                <div className='mb-2 text-gray-600'>Rango actual</div>
                <div className='flex items-center space-x-3'>
                  <div className='flex h-12 w-12 items-center justify-center rounded-full bg-orange-200 p-3'>
                    <span className='font-bold text-orange-700'>1°</span>
                  </div>
                  <div>
                    <div className='font-medium'>Oro</div>
                    <div className='text-sm text-gray-500'>Top 5% del salón</div>
                  </div>
                </div>
              </div>
              <div className='flex-1 text-right'>
                <div className='text-gray-600'>Puntos acumulados</div>
                <div className='text-2xl font-bold text-blue-600'>1,250 pts</div>
              </div>
            </div>
          </div>

          {/* Personal Information Card */}
          <div className='rounded-xl bg-white p-6 shadow-md'>
            <h3 className='mb-6 text-xl font-semibold text-gray-700'>Datos personales</h3>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <div className='space-y-1'>
                <label className='block text-sm font-medium text-gray-600'>Nombres y apellidos</label>
                <input
                  className='w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500'
                  value='José Miguel Pérez Gómez'
                  readOnly
                />
              </div>
              <div className='space-y-1'>
                <label className='block text-sm font-medium text-gray-600'>Año escolar</label>
                <input className='w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2' value='2025' readOnly />
              </div>
              <div className='space-y-1'>
                <label className='block text-sm font-medium text-gray-600'>Grado</label>
                <input className='w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2' value='6to' readOnly />
              </div>
              <div className='space-y-1'>
                <label className='block text-sm font-medium text-gray-600'>Nivel</label>
                <input className='w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2' value='Primaria' readOnly />
              </div>
              <div className='space-y-1'>
                <label className='block text-sm font-medium text-gray-600'>Sección</label>
                <input className='w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2' value='A' readOnly />
              </div>
              <div className='space-y-1'>
                <label className='block text-sm font-medium text-gray-600'>Celular</label>
                <input
                  className='w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500'
                  placeholder='Ingresa tu número de celular'
                  type='tel'
                />
              </div>
              <div className='space-y-1'>
                <label className='block text-sm font-medium text-gray-600'>Fecha de nacimiento</label>
                <input className='w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2' value='10/07/2012' readOnly />
              </div>
              <div className='space-y-1'>
                <label className='block text-sm font-medium text-gray-600'>DNI</label>
                <input className='w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2' value='85236974' readOnly />
              </div>
            </div>

            {/* Action Buttons */}
            <div className='mt-8 flex items-center justify-between border-t border-gray-100 pt-6'>
              <div className='space-x-3'>
                <button className='rounded-lg bg-red-100 px-6 py-2.5 font-medium text-red-600 transition-colors hover:bg-red-200'>
                  Cambiar contraseña
                </button>
                <button className='rounded-lg border border-gray-300 px-6 py-2.5 font-medium text-gray-700 transition-colors hover:bg-gray-50'>
                  Cancelar
                </button>
              </div>
              <button className='rounded-lg bg-green-600 px-8 py-2.5 font-medium text-white transition-colors hover:bg-green-700'>
                Guardar cambios
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
