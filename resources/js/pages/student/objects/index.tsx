import AppLayout from '@/layouts/app-layout'
import { useUserStore } from '@/store/useUserStore'
import { Head } from '@inertiajs/react'
import { useEffect } from 'react'

const breadcrumbs = [
  { title: 'Inicio', href: '/student/dashboard' },
  { title: 'Mis Objetos', href: '#' }
]

export default function MyObjects() {
  const { setCurrentDashboardRole } = useUserStore()

  useEffect(() => {
    setCurrentDashboardRole('/student/objects')
  }, [])

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title='Mis Objetos' />
      <div className='w-full space-y-8 px-4 py-6 sm:px-6 lg:px-8'>
        <div className='mx-auto w-full max-w-7xl space-y-8'>
          {/* Header Section */}
          <div className='mb-8 flex items-center justify-between'>
            <h2 className='text-2xl font-bold text-gray-800'>Mis Objetos</h2>
            <div className='flex items-center space-x-4'>
              <div className='rounded-lg bg-yellow-100 px-4 py-2'>
                <span className='font-medium'>Monedas: </span>
                <span className='font-bold text-yellow-700'>1,250</span>
              </div>
              <button className='rounded-lg bg-blue-500 px-6 py-2 text-white transition-colors hover:bg-blue-600'>Tienda</button>
            </div>
          </div>

          {/* Categories */}
          <div className='mb-6 flex space-x-4 overflow-x-auto pb-2'>
            <button className='rounded-lg bg-blue-100 px-4 py-2 font-medium whitespace-nowrap text-blue-700'>Todos</button>
            <button className='rounded-lg px-4 py-2 whitespace-nowrap text-gray-600 hover:bg-gray-100'>Avatares</button>
            <button className='rounded-lg px-4 py-2 whitespace-nowrap text-gray-600 hover:bg-gray-100'>Fondos</button>
            <button className='rounded-lg px-4 py-2 whitespace-nowrap text-gray-600 hover:bg-gray-100'>Logros</button>
          </div>

          {/* Items Grid */}
          <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((item) => (
              <div key={item} className='rounded-xl bg-white p-4 shadow-sm transition-shadow hover:shadow-md'>
                <div className='mb-3 flex aspect-square items-center justify-center rounded-lg bg-gray-100'>
                  <span className='text-gray-400'>Imagen {item}</span>
                </div>
                <div className='text-center'>
                  <h3 className='font-medium text-gray-900'>Objeto {item}</h3>
                  <p className='text-sm text-gray-500'>Categoría</p>
                  <div className='mt-2 flex items-center justify-center space-x-2'>
                    <span className='font-medium text-yellow-600'>250</span>
                    <span className='text-gray-400'>|</span>
                    <span className='text-sm text-gray-500'>Nivel {Math.ceil(Math.random() * 5)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className='mt-8 flex justify-center'>
            <nav className='inline-flex -space-x-px rounded-md shadow'>
              <a href='#' className='rounded-l-md border border-gray-300 bg-white px-3 py-2 text-gray-500 hover:bg-gray-50'>
                Anterior
              </a>
              <a href='#' className='border-t border-b border-gray-300 bg-blue-50 px-4 py-2 font-medium text-blue-600'>
                1
              </a>
              <a href='#' className='border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50'>
                2
              </a>
              <a href='#' className='border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50'>
                3
              </a>
              <a href='#' className='rounded-r-md border border-gray-300 bg-white px-3 py-2 text-gray-500 hover:bg-gray-50'>
                Siguiente
              </a>
            </nav>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
