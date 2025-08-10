import { jsx, jsxs } from "react/jsx-runtime";
import { A as AppLayout, P as ProgressBar } from "./app-layout-Dq465f56.js";
import { B as Button } from "./button-B8Z_lz_J.js";
import { d as useMobileNavigation, u as useUserStore } from "./use-mobile-navigation-cG7zaCET.js";
import { u as useTranslations } from "./translator-csgEc0di.js";
import { usePage, Head, Link, router } from "@inertiajs/react";
import axios from "axios";
import { LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./utils-CpIjqAVa.js";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-dialog";
import "./app-logo-icon-Dnok8BqH.js";
import "./image-Bmp5thdH.js";
import "@radix-ui/react-dropdown-menu";
import "@radix-ui/react-avatar";
import "@tanstack/react-query";
import "@radix-ui/react-tooltip";
import "zustand";
import "zustand/middleware";
const breadcrumbs = [{ title: "Perfil", href: "student/profile" }];
function Profile() {
  const { t } = useTranslations();
  const cleanup = useMobileNavigation();
  const { auth } = usePage().props;
  const { reset } = useUserStore();
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState({
    nombres: "",
    apellidos: "",
    anio_escolar: "",
    grado: "",
    nivel: "",
    seccion: "",
    celular: "",
    fecha_nacimiento: "",
    dni: "",
    puntos: 0,
    rango_nombre: "",
    rango_imagen: "",
    avatar_imagen: "",
    level_numero: 0,
    level_name: ""
  });
  useEffect(() => {
    fetchProfileData();
  }, []);
  const fetchProfileData = async () => {
    var _a, _b;
    try {
      setIsLoading(true);
      const profileRes = await axios.post("/api/studentprofile", {
        p_student_id: Number((_a = auth.user) == null ? void 0 : _a.id)
      });
      if (profileRes.data.success && ((_b = profileRes.data.data) == null ? void 0 : _b.length) > 0) {
        const data = profileRes.data.data[0];
        setProfile((prev) => ({ ...prev, ...data }));
      }
    } catch (error) {
      console.error(error);
      toast.error("Error al cargar los datos del perfil");
    } finally {
      setIsLoading(false);
    }
  };
  if (isLoading) {
    return /* @__PURE__ */ jsx(AppLayout, { breadcrumbs, children: /* @__PURE__ */ jsx("div", { className: "flex h-64 items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "h-8 w-8 animate-spin rounded-full border-b-2 border-blue-500" }) }) });
  }
  const handleLogout = () => {
    cleanup();
    reset();
    router.flushAll();
  };
  return /* @__PURE__ */ jsxs(AppLayout, { breadcrumbs, children: [
    /* @__PURE__ */ jsx(Head, { title: "Tu Perfil" }),
    /* @__PURE__ */ jsx("div", { className: "w-full space-y-8 px-4 py-6 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto w-full max-w-7xl space-y-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-8 flex items-center justify-between", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-gray-800", children: "Mi Perfil" }),
        /* @__PURE__ */ jsx(Link, { href: route("student.objects"), className: "rounded-lg bg-blue-500 px-6 py-2 text-white hover:bg-blue-600", children: "Mis objetos" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "rounded-xl bg-white p-6 shadow-md", children: [
        /* @__PURE__ */ jsx("h3", { className: "mb-4 text-xl font-semibold text-gray-700", children: "Gamificación" }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col space-y-6 md:flex-row md:items-center md:space-x-6", children: [
          /* @__PURE__ */ jsx(ProgressBar, {}),
          /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsx("div", { className: "text-gray-600", children: "Level actual" }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-3", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex h-12 w-12 items-center justify-center rounded-full bg-orange-200 font-bold text-orange-700", children: [
                profile.level_numero,
                "°"
              ] }),
              /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("div", { className: "font-medium", children: profile.level_name }) })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex-1 text-right", children: [
            /* @__PURE__ */ jsx("div", { className: "text-gray-600", children: "Puntos acumulados" }),
            /* @__PURE__ */ jsxs("div", { className: "text-2xl font-bold text-blue-600", children: [
              Number(profile.puntos).toLocaleString(),
              " pts"
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "rounded-xl bg-white p-6 shadow-md", children: [
        /* @__PURE__ */ jsx("h3", { className: "mb-6 text-xl font-semibold text-gray-700", children: "Datos personales" }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-6 md:grid-cols-2", children: ["nombres", "apellidos", "anio_escolar", "grado", "level_numero", "seccion"].map((field) => /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsx("label", { className: "text-sm font-medium text-gray-600 capitalize", children: t(field.replace("_", " ").replace("anio escolar", "año escolar")) }),
          /* @__PURE__ */ jsx(
            "input",
            {
              className: "w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2",
              value: t(profile[field]),
              readOnly: true
            }
          )
        ] }, field)) })
      ] }),
      /* @__PURE__ */ jsx(Button, { variant: "destructive", asChild: true, children: /* @__PURE__ */ jsxs(Link, { className: "block w-full", method: "post", href: route("logout"), as: "button", onClick: handleLogout, children: [
        /* @__PURE__ */ jsx(LogOut, { className: "mr-2" }),
        t("Log Out")
      ] }) })
    ] }) })
  ] });
}
export {
  Profile as default
};
