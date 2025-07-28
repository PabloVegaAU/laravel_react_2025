import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface User {
  id: number
  name: string
  email: string
  student_id?: string
  // Add other user properties as needed
}

interface UserState {
  roles: string[]
  currentDashboardRole: string
  permissions: string[]
  user: User | null
  setUser: (user: User | null) => void
  setRoles: (roles: string[]) => void
  setCurrentDashboardRole: (role: string) => void
  setPermissions: (permissions: string[]) => void
  fetchUserPermissions: () => Promise<void>
  reset: () => void
}

const STORAGE_KEY = 'user-store'

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      roles: [],
      currentDashboardRole: '',
      permissions: [],
      user: null,
      setUser: (user) => set({ user }),
      setRoles: (roles) => set({ roles }),
      setCurrentDashboardRole: (role) => set({ currentDashboardRole: role }),
      setPermissions: (permissions) => set({ permissions }),
      fetchUserPermissions: async () => {
        try {
          const res = await fetch(route('roles-permissions'))
          const data = await res.json()
          set({
            roles: data.roles,
            permissions: data.permissions
          })
        } catch (error) {
          console.error('Error fetching user permissions:', error)
        }
      },
      reset: () => set({ roles: [], permissions: [], currentDashboardRole: '', user: null })
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      version: 1
    }
  )
)
