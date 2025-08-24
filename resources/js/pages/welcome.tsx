import Image from '@/components/ui/image'
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
      <Head title={t('Welcome')}>
        <link rel='preconnect' href='https://fonts.bunny.net' />
        <link href='https://fonts.bunny.net/css?family=instrument-sans:400,500,600' rel='stylesheet' />
      </Head>
      <div className='flex min-h-screen flex-col items-center bg-[#FDFDFC] p-6 text-[#1b1b18] lg:justify-center lg:p-8 dark:bg-[#0a0a0a]'>
        <header className='mb-6 w-full max-w-[335px] text-sm not-has-[nav]:hidden lg:max-w-4xl'>
          <nav className='flex items-center justify-end gap-4'>
            {roles.length > 0 ? (
              <>
                {roles.map((role) => (
                  <Link
                    key={role}
                    href={route(role + '.dashboard')}
                    className='inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] capitalize hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]'
                  >
                    {t('dashboard')} {t(role)}
                  </Link>
                ))}
                <div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link
                          className='hover:bg-accent block w-full rounded-md p-2 transition-colors'
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
              <>
                <Link
                  href={route('login')}
                  className='inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]'
                >
                  {t('Log In')}
                </Link>
                {/* 
                <Link
                  href={route('register')}
                  className='inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]'
                >
                  {t('Register')}
                </Link>
                */}
              </>
            )}
          </nav>
        </header>
        <div className='flex w-full items-center justify-center opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0'>
          <main>
            <Image src='/images/home/ie.jpg' alt='Welcome' />
          </main>
        </div>
      </div>
    </>
  )
}
