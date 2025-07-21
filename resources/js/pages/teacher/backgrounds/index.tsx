import { PageProps } from '@/types'
import BackgroundsPage from './components'

export default function TeacherBackgroundsPage({ auth }: PageProps) {
  return <BackgroundsPage />
}

// Add a display name for the component for better debugging
TeacherBackgroundsPage.displayName = 'TeacherBackgroundsPage'
