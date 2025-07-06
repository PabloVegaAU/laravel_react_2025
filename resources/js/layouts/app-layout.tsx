import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout'
import { BreadcrumbItem } from '@/types/core'
import { type ReactNode } from 'react'

interface AppLayoutProps {
  children: ReactNode
  breadcrumbs?: BreadcrumbItem[]
}

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => (
  <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
    {children}
  </AppLayoutTemplate>
)
