import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface UserState {
  roles: string[]
  currentDashboardRole: string
  permissions: string[]
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
      reset: () => set({ roles: [], permissions: [], currentDashboardRole: '' })
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      version: 1
    }
  )
)
