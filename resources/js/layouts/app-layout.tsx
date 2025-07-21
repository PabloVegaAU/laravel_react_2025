import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout'
import { BreadcrumbItem } from '@/types/core'
import { type ReactNode } from 'react'

import { User } from '@/types/auth/types'

interface AppLayoutProps {
  children: ReactNode
  breadcrumbs?: BreadcrumbItem[]
  user?: User
}

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => (
  <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
    {children}
  </AppLayoutTemplate>
)
