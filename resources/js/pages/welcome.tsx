import AppLogoIcon from '@/components/app-logo-icon'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useMobileNavigation } from '@/hooks/use-mobile-navigation'
import { useTranslations } from '@/lib/translator'
import { useUserStore } from '@/store/useUserStore'
import { SharedData } from '@/types/core'
import { Head, Link, router, usePage } from '@inertiajs/react'
import { LogOut } from 'lucide-react'
import { useEffect } from 'react'

export default function Welcome() {
  // Hooks
  const { t } = useTranslations()
  const { auth } = usePage<SharedData>().props
  const { roles, isLoading, fetchUserPermissions, reset } = useUserStore()
  const cleanup = useMobileNavigation()

  // Effects
  useEffect(() => {
    if (auth.user?.id) fetchUserPermissions()
  }, [auth.user?.id, fetchUserPermissions])

  // Handlers
  const handleLogout = () => {
    cleanup()
    reset()
    router.flushAll()
  }

  return (
    <>
      <Head title={t('Welcome')} />

      <div className='relative min-h-screen bg-gradient-to-br from-green-900 via-green-700 to-green-800 text-white'>
        {/* Imagen de fondo */}
        <div className='absolute inset-0 z-0'>
          <img src='/images/home/ie.jpg' alt='Background' className='h-full w-full object-cover' />
          {/* Overlay verde */}
          <div className='absolute inset-0 bg-gradient-to-br from-green-900/30 via-green-700/30 to-green-800/30'></div>
        </div>

        {/* Contenido */}
        <div className='relative z-10'>
          {/* HEADER */}
          <header className='flex items-center justify-between px-6 py-4'>
            <div />
            {!isLoading && (
              <div className='flex gap-3'>
                {roles.length > 0 ? (
                  <>
                    {roles.map((role) => (
                      <Link
                        key={role}
                        href={route(role + '.dashboard')}
                        className='rounded-full bg-white px-4 py-2 text-gray-800 capitalize hover:bg-gray-100'
                      >
                        {t('dashboard')} {t(role)}
                      </Link>
                    ))}
                    <div>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Link
                              className='flex items-center rounded-full bg-white px-4 py-2 text-gray-800 hover:bg-gray-100'
                              method='post'
                              href={route('logout')}
                              as='button'
                              onClick={handleLogout}
                            >
                              <LogOut className='h-5 w-5' />
                            </Link>
                          </TooltipTrigger>
                          <TooltipContent side='bottom'>
                            <p>{t('Log Out')}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </>
                ) : (
                  <Link href={route('login')} className='rounded-full bg-white px-4 py-2 font-semibold text-green-800 hover:bg-green-50'>
                    Iniciar sesión
                  </Link>
                )}
              </div>
            )}
          </header>

          {/* HERO */}
          <section className='mt-10 px-4 text-center'>
            {/* Logo centrado */}
            <div className='mx-auto mb-6 flex max-w-sm flex-col items-center gap-3'>
              <div className='flex h-16 w-16 items-center justify-center rounded-lg bg-white shadow-lg'>
                <AppLogoIcon className='size-12 fill-current text-green-800' />
              </div>
              <div className='text-center'>
                <h1 className='text-2xl font-bold'>I.E. Julio C. Tello</h1>
                <p className='text-green-200'>Aprende • Juega • Crece</p>
              </div>
            </div>

            <h2 className='text-5xl font-extrabold drop-shadow-lg md:text-6xl'>BIENVENIDO</h2>

            <p className='mt-3 inline-block rounded-full bg-green-600 px-6 py-2 text-xl shadow'>
              "Aprendiendo a través de la gamificación y desarrollo de competencias"
            </p>
          </section>

          {/* INFO GAMIFICACIÓN */}
          <section className='mx-auto mt-10 max-w-3xl px-4'>
            <div className='rounded-xl border border-white/20 bg-white/10 p-5 text-center backdrop-blur-lg'>
              <p className='text-sm'>Este aplicativo te ayudará a aprender:</p>
              <p className='font-semibold text-yellow-300'>A través de la gamificación y desarrollo de competencias</p>
              <p className='text-sm'>mediante actividades interactivas.</p>
            </div>
          </section>

          {/* BENEFICIOS */}
          <section className='mx-auto mt-10 max-w-5xl px-4 pb-10'>
            <div className='grid gap-6 rounded-2xl bg-white/10 p-6 text-center backdrop-blur-lg md:grid-cols-3'>
              <div>
                <div className='mb-2 text-3xl'>🏆</div>
                <h4 className='font-bold'>Gana logros</h4>
                <p className='text-sm text-gray-200'>Completa actividades y obtén premios.</p>
              </div>

              <div>
                <div className='mb-2 text-3xl'>⭐</div>
                <h4 className='font-bold'>Sube de nivel</h4>
                <p className='text-sm text-gray-200'>Acumula puntos y avanza.</p>
              </div>

              <div>
                <div className='mb-2 text-3xl'>🎯</div>
                <h4 className='font-bold'>Mejora tus habilidades</h4>
                <p className='text-sm text-gray-200'>Practica y conviértete en experto.</p>
              </div>
            </div>
          </section>

          {/* FOOTER */}
          <footer className='fixed right-0 bottom-0 left-0 bg-green-800/80 py-4'>
            <div className='flex flex-wrap justify-center gap-10 px-4 text-sm text-green-200'>
              <span>✔ Seguro y confiable</span>
              <span>🔒 Tu aprendizaje es nuestra misión</span>
              <span>👥 Juntos aprendemos mejor</span>
            </div>
          </footer>
        </div>
      </div>
    </>
  )
}
