import { jsx, jsxs } from "react/jsx-runtime";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { c as cn } from "./utils-CpIjqAVa.js";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { useCallback } from "react";
function TooltipProvider({
  delayDuration = 0,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    TooltipPrimitive.Provider,
    {
      "data-slot": "tooltip-provider",
      delayDuration,
      ...props
    }
  );
}
function Tooltip({
  ...props
}) {
  return /* @__PURE__ */ jsx(TooltipProvider, { children: /* @__PURE__ */ jsx(TooltipPrimitive.Root, { "data-slot": "tooltip", ...props }) });
}
function TooltipTrigger({
  ...props
}) {
  return /* @__PURE__ */ jsx(TooltipPrimitive.Trigger, { "data-slot": "tooltip-trigger", ...props });
}
function TooltipContent({
  className,
  sideOffset = 4,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsx(TooltipPrimitive.Portal, { children: /* @__PURE__ */ jsxs(
    TooltipPrimitive.Content,
    {
      "data-slot": "tooltip-content",
      sideOffset,
      className: cn(
        "bg-primary text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 max-w-sm rounded-md px-3 py-1.5 text-xs",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsx(TooltipPrimitive.Arrow, { className: "bg-primary fill-primary z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]" })
      ]
    }
  ) });
}
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
  },
  isLoading: false
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
          set({ isLoading: true });
          const res = await fetch(route("roles-permissions"));
          const data = await res.json();
          set({
            roles: data.roles,
            permissions: data.permissions
          });
        } catch (error) {
          console.error("Error consultando permisos:", error);
        } finally {
          set({ isLoading: false });
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
function useMobileNavigation() {
  return useCallback(() => {
    document.body.style.removeProperty("pointer-events");
  }, []);
}
export {
  TooltipProvider as T,
  Tooltip as a,
  TooltipTrigger as b,
  TooltipContent as c,
  useMobileNavigation as d,
  useUserStore as u
};
