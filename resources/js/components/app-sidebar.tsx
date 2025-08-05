import { createNavItems } from '@/constants/navigation'
import { useInitials } from '@/hooks/use-initials'
import { useUserStore } from '@/store/useUserStore'
import { NavItem, SharedData } from '@/types/core'
import { Link, usePage } from '@inertiajs/react'
import AppLogo from './app-logo'
import { NavFooter } from './nav-footer'
import { NavMain } from './nav-main'
import { NavUser } from './nav-user'
import ProgressBar from './organisms/progress-bar'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from './ui/sidebar'

const footerNavItems: NavItem[] = []

export function AppSidebar() {
  const page = usePage<SharedData>()
  const { auth } = page.props
  const getInitials = useInitials()
  const { currentDashboardRole, avatar, roles, permissions } = useUserStore()
  const showStudentSection = roles.includes('student')

  // Obtener los items de navegación filtrados por permisos
  const { noTitleNavItems, peopleNavItems, schoolNavItems, applicationFormsNavItems, storeNavItems } = createNavItems(permissions)

  // Mostrar la sección de personas solo si hay al menos un ítem
  const showPeopleSection = peopleNavItems.length > 0
  const showSchoolSection = schoolNavItems.length > 0
  const showApplicationFormsSection = applicationFormsNavItems.length > 0
  const showStoreSection = storeNavItems.length > 0

  return (
    <Sidebar collapsible='icon' variant='inset'>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size='lg' asChild>
              <Link href={currentDashboardRole} prefetch>
                <AppLogo />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {showStudentSection && (
          <Link href='/student/profile' prefetch className='flex flex-col items-center gap-4 p-4'>
            <Avatar className='size-20'>
              <AvatarImage src={avatar || undefined} alt={auth.user?.name || undefined} />
              <AvatarFallback className='bg-green-200 text-green-900'>{getInitials(auth.user?.name || '')}</AvatarFallback>
            </Avatar>
            <ProgressBar />
          </Link>
        )}

        <NavMain items={noTitleNavItems} />
        {showPeopleSection && <NavMain title='PERSONAS' items={peopleNavItems} />}
        {showSchoolSection && <NavMain title='COLEGIO' items={schoolNavItems} />}
        {showApplicationFormsSection && <NavMain title='FICHAS DE APLICACIÓN' items={applicationFormsNavItems} />}
        {showStoreSection && <NavMain title='TIENDA DE PUNTOS' items={storeNavItems} />}
      </SidebarContent>

      {!showStudentSection && (
        <SidebarFooter>
          <NavFooter items={footerNavItems} className='mt-auto' />
          <NavUser />
        </SidebarFooter>
      )}
    </Sidebar>
  )
}
