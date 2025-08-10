import { jsxs, jsx } from "react/jsx-runtime";
import { A as AppLayout } from "./app-layout-Dq465f56.js";
import { u as useUserStore } from "./use-mobile-navigation-cG7zaCET.js";
import { usePage, Head, router } from "@inertiajs/react";
import axios from "axios";
import { useState, useEffect } from "react";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "lucide-react";
import "./utils-CpIjqAVa.js";
import "clsx";
import "tailwind-merge";
import "./button-B8Z_lz_J.js";
import "@radix-ui/react-dialog";
import "./app-logo-icon-Dnok8BqH.js";
import "./image-Bmp5thdH.js";
import "@radix-ui/react-dropdown-menu";
import "@radix-ui/react-avatar";
import "./translator-csgEc0di.js";
import "@tanstack/react-query";
import "@radix-ui/react-tooltip";
import "zustand";
import "zustand/middleware";
const breadcrumbs = [
  {
    title: "Tienda de Puntos",
    href: "#"
  }
];
function Dashboard() {
  const { props } = usePage();
  const { setUser } = useUserStore();
  const [puntos, setPuntos] = useState(null);
  useEffect(() => {
    if (props.user) {
      setUser({
        ...props.user,
        id: Number(props.user.id)
      });
      fetchStudentProfile(props.user.id);
    }
  }, [props.user]);
  const fetchStudentProfile = async (studentId) => {
    try {
      const response = await axios.post("/api/studentprofile", {
        p_student_id: studentId
      });
      if (response.data.success && response.data.data.length > 0) {
        setPuntos(response.data.data[0].puntos);
      }
    } catch (error) {
      if (error.response) {
        console.error("❌ Error de servidor:", error.response.data);
      } else {
        console.error("❌ Error al conectar con la API:", error.message);
      }
    }
  };
  return /* @__PURE__ */ jsxs(AppLayout, { breadcrumbs, children: [
    /* @__PURE__ */ jsx(Head, { title: "Tienda de Puntos" }),
    /* @__PURE__ */ jsxs("header", { className: "mb-4 flex flex-col items-start justify-between gap-4 p-6 sm:flex-row sm:items-center sm:gap-0 lg:p-8", children: [
      /* @__PURE__ */ jsx("div", { className: "bg-background rounded-lg border p-6 shadow-sm", children: /* @__PURE__ */ jsx("h2", { className: "text-foreground text-2xl font-bold", children: "Tienda de Objetos" }) }),
      /* @__PURE__ */ jsx("div", { className: "flex items-center space-x-4", children: /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-2 dark:border-yellow-800 dark:bg-yellow-950", children: [
        /* @__PURE__ */ jsx("span", { className: "font-medium text-yellow-900 dark:text-yellow-100", children: "Tus puntos: " }),
        /* @__PURE__ */ jsx("span", { className: "font-bold text-yellow-700 dark:text-yellow-300", children: puntos !== null ? `${puntos} pts` : "..." })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mb-6 flex justify-center px-6 sm:justify-end lg:px-8", children: /* @__PURE__ */ jsx(
      "button",
      {
        onClick: () => router.visit("/student/objects"),
        className: "border-border dark:bg-muted mb-8 flex items-center space-x-2 rounded-lg border bg-white p-6 text-base font-medium transition-colors sm:px-8 sm:py-4 sm:text-lg lg:text-xl",
        children: /* @__PURE__ */ jsx("span", { children: "MIS OBJETOS" })
      }
    ) }),
    /* @__PURE__ */ jsxs("main", { className: "p-6 text-center lg:p-8", children: [
      /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "border-border dark:bg-muted mb-8 rounded-lg border bg-white p-6", children: /* @__PURE__ */ jsx("p", { className: "text-foreground text-lg font-semibold sm:text-xl lg:text-2xl xl:text-3xl", children: "COMPRAR" }) }) }),
      /* @__PURE__ */ jsx("div", { className: "flex flex-col items-center justify-center space-y-8 sm:flex-row sm:space-y-0 sm:space-x-12 lg:space-x-16", children: [
        { label: "AVATARES", path: "/student/store/avatars", image: "/images/avatars/default.png" },
        { label: "FONDOS", path: "/student/store/backgrounds", image: "/images/backgrounds/default.png" },
        { label: "PREMIOS", path: "/student/store/rewards", image: "/images/rewards/default.png" }
      ].map(({ label, path, image }) => /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center", children: [
        /* @__PURE__ */ jsx("div", { className: "border-border bg-muted relative size-24 overflow-hidden rounded-xl border sm:size-32 md:size-40 lg:size-48 xl:size-56", children: /* @__PURE__ */ jsx("img", { src: image, alt: label, className: "h-full w-full object-cover" }) }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => router.visit(path),
            className: "bg-secondary text-secondary-foreground hover:bg-secondary/80 mt-4 w-24 rounded-lg px-4 py-2 text-sm font-medium transition-colors sm:w-32 sm:text-base md:w-40 md:px-6 md:py-3 lg:text-lg xl:text-xl",
            children: label
          }
        )
      ] }, label)) })
    ] })
  ] });
}
export {
  Dashboard as default
};
