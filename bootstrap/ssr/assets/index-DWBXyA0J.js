import { jsxs, jsx } from "react/jsx-runtime";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-BeW_tWiO.js";
import { A as AppLayout } from "./app-layout-Dq465f56.js";
import { u as useTranslations } from "./translator-csgEc0di.js";
import { a as getContainerColorVariant } from "./index-Bc2QsrC0.js";
import { c as cn } from "./utils-CpIjqAVa.js";
import { u as useUserStore } from "./use-mobile-navigation-cG7zaCET.js";
import { Head } from "@inertiajs/react";
import { useEffect } from "react";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "lucide-react";
import "./button-B8Z_lz_J.js";
import "@radix-ui/react-dialog";
import "./app-logo-icon-Dnok8BqH.js";
import "./image-Bmp5thdH.js";
import "@radix-ui/react-dropdown-menu";
import "@radix-ui/react-avatar";
import "@tanstack/react-query";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-tooltip";
import "zustand";
import "zustand/middleware";
function Dashboard({ teacher_classroom_curricular_area_cycles }) {
  const { t } = useTranslations();
  const { setCurrentDashboardRole } = useUserStore();
  useEffect(() => {
    setCurrentDashboardRole("/teacher/dashboard");
  }, []);
  const breadcrumbs = [
    {
      title: t("Dashboard"),
      href: "/teacher/dashboard"
    }
  ];
  return /* @__PURE__ */ jsxs(AppLayout, { breadcrumbs, children: [
    /* @__PURE__ */ jsx(Head, { title: t("Dashboard") }),
    /* @__PURE__ */ jsxs("div", { className: "flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold tracking-tight", children: "Áreas Currículares" }),
        /* @__PURE__ */ jsx("div", { className: "grid auto-rows-min gap-4 md:grid-cols-3", children: teacher_classroom_curricular_area_cycles.map((item) => {
          var _a, _b, _c, _d;
          const color = ((_b = (_a = item.curricular_area_cycle) == null ? void 0 : _a.curricular_area) == null ? void 0 : _b.color) || "gray";
          const variant = getContainerColorVariant(color);
          return /* @__PURE__ */ jsx("div", { className: cn("flex items-center justify-center rounded-xl border p-4", variant), children: /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold tracking-tight", children: (_d = (_c = item.curricular_area_cycle) == null ? void 0 : _c.curricular_area) == null ? void 0 : _d.name }) }, item.id);
        }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold tracking-tight", children: "Aulas" }),
        /* @__PURE__ */ jsxs(Table, { children: [
          /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
            /* @__PURE__ */ jsx(TableHead, { children: "N°" }),
            /* @__PURE__ */ jsx(TableHead, { children: "Grado" }),
            /* @__PURE__ */ jsx(TableHead, { children: "Sección" }),
            /* @__PURE__ */ jsx(TableHead, { children: "Nivel" })
          ] }) }),
          /* @__PURE__ */ jsx(TableBody, { children: teacher_classroom_curricular_area_cycles.map((item, index) => {
            var _a, _b, _c;
            return /* @__PURE__ */ jsxs(TableRow, { children: [
              /* @__PURE__ */ jsx(TableCell, { children: index + 1 }),
              /* @__PURE__ */ jsx(TableCell, { children: t((_a = item == null ? void 0 : item.classroom) == null ? void 0 : _a.grade) }),
              /* @__PURE__ */ jsx(TableCell, { children: (_b = item == null ? void 0 : item.classroom) == null ? void 0 : _b.section }),
              /* @__PURE__ */ jsx(TableCell, { children: t((_c = item == null ? void 0 : item.classroom) == null ? void 0 : _c.level) })
            ] }, item.id);
          }) })
        ] })
      ] })
    ] })
  ] });
}
export {
  Dashboard as default
};
