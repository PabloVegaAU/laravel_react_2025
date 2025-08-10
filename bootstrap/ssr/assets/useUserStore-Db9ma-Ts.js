import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
const initialState = {
  currentDashboardRole: "",
  user: null,
  avatar: null,
  background: null,
  roles: [],
  permissions: [],
  progress: {
    nivel_actual: 0,
    porcentaje_completado: 0,
    rango: "Bronce",
    posicion_ranking: 0,
    total_puntos: 0,
    progress_percent: 0,
    experience_achieved: 0,
    experience_required: 0,
    experience_max: 0
  }
};
const STORAGE_KEY = "user-store";
const useUserStore = create()(
  persist(
    (set) => ({
      ...initialState,
      setCurrentDashboardRole: (role) => set({ currentDashboardRole: role }),
      setUser: (user) => set({ user }),
      setAvatar: (avatar) => set({ avatar }),
      setBackground: (background) => set({ background }),
      fetchUserPermissions: async () => {
        try {
          const res = await fetch(route("roles-permissions"));
          const data = await res.json();
          set({
            roles: data.roles,
            permissions: data.permissions
          });
        } catch (error) {
          console.error("Error consultando permisos:", error);
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
);
export {
  useUserStore as u
};
