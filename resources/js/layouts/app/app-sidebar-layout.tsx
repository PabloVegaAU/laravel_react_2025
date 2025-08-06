import { AppContent } from '@/components/app-content'
import { AppShell } from '@/components/app-shell'
import { AppSidebar } from '@/components/app-sidebar'
import { AppSidebarHeader } from '@/components/app-sidebar-header'
import Background from '@/components/ui/background'
import { type BreadcrumbItem } from '@/types/core'
import { type PropsWithChildren } from 'react'

export default function AppSidebarLayout({ children, breadcrumbs = [] }: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
  return (
    <AppShell variant='sidebar'>
      <AppSidebar />
      <AppContent variant='sidebar' className='overflow-x-hidden'>
        <AppSidebarHeader breadcrumbs={breadcrumbs} />
        <div className='relative z-20 max-h-screen'>
          <Background />
          {children}
        </div>
      </AppContent>
    </AppShell>
  )
}
