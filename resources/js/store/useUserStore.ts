import { UserInertia } from '@/types/auth'
import { ProgressData } from '@/types/user'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

// Estado base del usuario
interface UserState {
  currentDashboardRole: string
  user: UserInertia | null
  avatar: string | null
  background: string | null
  roles: string[]
  permissions: string[]
  progress: ProgressData
  isLoading: boolean
}

// Acciones disponibles
interface UserActions {
  setCurrentDashboardRole: (role: string) => void
  setUser: (user: UserInertia | null) => void
  setAvatar: (avatar: string | null) => void
  setBackground: (background: string | null) => void
  fetchUserPermissions: () => Promise<void>
  setProgress: (progress: ProgressData) => void
  reset: () => void
}

// Tipo completo del store
type UserStore = UserState & UserActions

// Estado inicial
const initialState: UserState = {
  currentDashboardRole: '',
  user: null,
  avatar: null,
  background: null,
  roles: [],
  permissions: [],
  progress: {
    nivel_actual: 0,
    porcentaje_completado: 0,
    rango: 'Bronce',
    posicion_ranking: 0,
    total_puntos: 0,
    progress_percent: 0,
    experience_achieved: 0,
    experience_required: 0,
    experience_max: 0
  },
  isLoading: false
}

// Clave para almacenamiento persistente
const STORAGE_KEY = 'user-store'

// Creación del store
export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      ...initialState,
      setCurrentDashboardRole: (role) => set({ currentDashboardRole: role }),
      setUser: (user) => set({ user }),
      setAvatar: (avatar) => set({ avatar }),
      setBackground: (background) => set({ background }),
      fetchUserPermissions: async () => {
        try {
          set({ isLoading: true })
          const res = await fetch(route('roles-permissions'))
          const data = await res.json()
          set({
            roles: data.roles,
            permissions: data.permissions
          })
        } catch (error) {
          console.error('Error consultando permisos:', error)
        } finally {
          set({ isLoading: false })
        }
      },
      setProgress: (progress) => set({ progress }),
      reset: () => set(initialState)
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      version: 1
    }
  )
)
