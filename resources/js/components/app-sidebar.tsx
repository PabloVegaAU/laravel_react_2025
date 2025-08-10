import { Link, usePage } from '@inertiajs/react'
import { useMemo } from 'react'

import { createNavItems } from '@/constants/navigation'
import { useInitials } from '@/hooks/use-initials'
import { useUserStore } from '@/store/useUserStore'
import { type NavItem, type SharedData } from '@/types/core'

import AppLogo from './app-logo'
import { NavFooter } from './nav-footer'
import { NavMain } from './nav-main'
import { NavUser } from './nav-user'
import ProgressBar from './organisms/progress-bar'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from './ui/sidebar'

// Constantes
const FOOTER_NAV_ITEMS: NavItem[] = []

// Tipos
interface NavigationSections {
  noTitleNavItems: NavItem[]
  peopleNavItems: NavItem[]
  schoolNavItems: NavItem[]
  applicationFormsNavItems: NavItem[]
  storeNavItems: NavItem[]
}

interface SectionVisibility {
  showStudentSection: boolean
  showPeopleSection: boolean
  showSchoolSection: boolean
  showApplicationFormsSection: boolean
  showStoreSection: boolean
}

export function AppSidebar() {
  // Hooks de React y estados
  const { state } = useSidebar()
  const page = usePage<SharedData>()
  const getInitials = useInitials()
  const { currentDashboardRole, avatar, roles, permissions } = useUserStore()

  // Extracción de datos del estado global
  const { auth } = page.props

  // Memoizar elementos de navegación para evitar recreación en cada renderizado
  const navigationSections = useMemo<NavigationSections>(
    () => createNavItems(permissions),
    [permissions] // Solo se recrea cuando los permisos cambian
  )

  const { noTitleNavItems, peopleNavItems, schoolNavItems, applicationFormsNavItems, storeNavItems } = navigationSections

  // Memoizar visibilidad de secciones para evitar recálculos en cada renderizado
  const sectionVisibility = useMemo<SectionVisibility>(
    () => ({
      showStudentSection: roles.includes('student'),
      showPeopleSection: peopleNavItems.length > 0,
      showSchoolSection: schoolNavItems.length > 0,
      showApplicationFormsSection: applicationFormsNavItems.length > 0,
      showStoreSection: storeNavItems.length > 0
    }),
    [roles, peopleNavItems.length, schoolNavItems.length, applicationFormsNavItems.length, storeNavItems.length]
  )

  const { showStudentSection } = sectionVisibility

  return (
    <Sidebar collapsible='icon' variant='inset'>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size='lg' asChild>
              <Link href={currentDashboardRole}>
                <AppLogo />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {showStudentSection && <StudentProfileSection state={state} avatar={avatar} userName={auth.user?.name} getInitials={getInitials} />}

        <NavigationSections
          noTitleNavItems={noTitleNavItems}
          peopleNavItems={peopleNavItems}
          schoolNavItems={schoolNavItems}
          applicationFormsNavItems={applicationFormsNavItems}
          storeNavItems={storeNavItems}
          sectionVisibility={sectionVisibility}
        />
      </SidebarContent>

      {!showStudentSection && (
        <SidebarFooter>
          <NavFooter items={FOOTER_NAV_ITEMS} className='mt-auto' />
          <NavUser />
        </SidebarFooter>
      )}
    </Sidebar>
  )
}

// Componentes secundarios
interface StudentProfileSectionProps {
  state: string
  avatar: string | null
  userName?: string
  getInitials: (name: string) => string
}

function StudentProfileSection({ state, avatar, userName, getInitials }: StudentProfileSectionProps) {
  const isCollapsed = state === 'collapsed'

  return (
    <Link href='/student/profile' className='flex flex-col items-center gap-4 p-4'>
      <Avatar className={isCollapsed ? 'size-12' : 'size-20'}>
        <AvatarImage src={avatar || undefined} alt={userName || undefined} />
        <AvatarFallback className='bg-green-200 text-green-900'>{getInitials(userName || '')}</AvatarFallback>
      </Avatar>
      {!isCollapsed && (
        <div>
          <ProgressBar />
        </div>
      )}
    </Link>
  )
}

interface NavigationSectionsProps extends NavigationSections {
  sectionVisibility: SectionVisibility
}

function NavigationSections({
  noTitleNavItems,
  peopleNavItems,
  schoolNavItems,
  applicationFormsNavItems,
  storeNavItems,
  sectionVisibility
}: NavigationSectionsProps) {
  const { showPeopleSection, showSchoolSection, showApplicationFormsSection, showStoreSection } = sectionVisibility

  return (
    <>
      <NavMain items={noTitleNavItems} />

      {showPeopleSection && <NavMain title='PERSONAS' items={peopleNavItems} />}

      {showSchoolSection && <NavMain title='COLEGIO' items={schoolNavItems} />}

      {showApplicationFormsSection && <NavMain title='FICHAS DE APLICACIÓN' items={applicationFormsNavItems} />}

      {showStoreSection && <NavMain title='TIENDA DE PUNTOS' items={storeNavItems} />}
    </>
  )
}
