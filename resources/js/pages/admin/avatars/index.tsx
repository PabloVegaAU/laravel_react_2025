import { Avatar } from '@/types/avatar'
import { PaginatedResponse, ResourcePageProps } from '@/types/core'
import AvatarsPage from './components'

type PageProps = Omit<ResourcePageProps<Avatar>, 'data'> & {
  avatars: PaginatedResponse<Avatar>
}

export default function TeacherAvatarsPage({ avatars }: PageProps) {
  return <AvatarsPage avatars={avatars} />
}

// Add a display name for the component for better debugging
TeacherAvatarsPage.displayName = 'TeacherAvatarsPage'
