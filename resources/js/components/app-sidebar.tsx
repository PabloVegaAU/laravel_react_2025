import { createNavItems } from '@/constants/navigation'
import { useUserStore } from '@/store/useUserStore'
import { NavItem } from '@/types/core'
import { Link } from '@inertiajs/react'
import AppLogo from './app-logo'
import { NavFooter } from './nav-footer'
import { NavMain } from './nav-main'
import { NavUser } from './nav-user'
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from './ui/sidebar'

const footerNavItems: NavItem[] = []

export function AppSidebar() {
  const { currentDashboardRole, permissions } = useUserStore()

  // Obtener los items de navegación filtrados por permisos
  const { noTitleNavItems, peopleNavItems, schoolNavItems, applicationFormsNavItems, storeNavItems } = createNavItems(permissions)

  // Mostrar la sección de personas solo si hay al menos un ítem
  const showPeopleSection = peopleNavItems.length > 0
  const showSchoolSection = schoolNavItems.length > 0
  const showApplicationFormsSection = applicationFormsNavItems.length > 0
  const showStoreSection = storeNavItems.length >= 0

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
        <NavMain items={noTitleNavItems} />
        {showPeopleSection && <NavMain title='PERSONAS' items={peopleNavItems} />}
        {showSchoolSection && <NavMain title='COLEGIO' items={schoolNavItems} />}
        {showApplicationFormsSection && <NavMain title='FICHAS DE APLICACIÓN' items={applicationFormsNavItems} />}
        {showStoreSection && <NavMain title='TIENDA DE PUNTOS' items={storeNavItems} />}
      </SidebarContent>

      <SidebarFooter>
        <NavFooter items={footerNavItems} className='mt-auto' />
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
