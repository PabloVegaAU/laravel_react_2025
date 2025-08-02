import { PageProps } from '@/types'
import AvatarsPage from './components'

export default function TeacherAvatarsPage({ auth }: PageProps) {
  return <AvatarsPage auth={auth} />
}

// Add a display name for the component for better debugging
TeacherAvatarsPage.displayName = 'TeacherAvatarsPage'
