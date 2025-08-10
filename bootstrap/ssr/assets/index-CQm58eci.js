import { jsxs, jsx } from "react/jsx-runtime";
import { L as Label } from "./label-CC7KirIj.js";
import { A as AppLayout } from "./app-layout-BsERFbVR.js";
import { u as useTranslations } from "./translator-csgEc0di.js";
import { u as useUserStore } from "./useUserStore-Db9ma-Ts.js";
import { Head, Link } from "@inertiajs/react";
import { useEffect } from "react";
import "@radix-ui/react-label";
import "./utils-qggO9Hcn.js";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "lucide-react";
import "./button-BqjjxT-O.js";
import "@radix-ui/react-dialog";
import "@radix-ui/react-tooltip";
import "./app-logo-icon-ZHVQJC4L.js";
import "./image-Bmp5thdH.js";
import "@radix-ui/react-dropdown-menu";
import "@radix-ui/react-avatar";
import "@tanstack/react-query";
import "zustand";
import "zustand/middleware";
const breadcrumbs = [
  {
    title: "Dashboard",
    href: "student/dashboard"
  }
];
function Dashboard({ application_form_responses, enrollment, avatar, background }) {
  var _a, _b, _c;
  const { t } = useTranslations();
  const { setCurrentDashboardRole, setAvatar, setBackground, setUser } = useUserStore();
  useEffect(() => {
    setCurrentDashboardRole("/student/dashboard");
    setAvatar(avatar);
    setBackground(background);
  }, []);
  return /* @__PURE__ */ jsxs(AppLayout, { breadcrumbs, children: [
    /* @__PURE__ */ jsx(Head, { title: "Dashboard" }),
    /* @__PURE__ */ jsxs("div", { className: "relative flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4 pb-96", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold", children: "Fichas de aplicación pendientes" }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4", children: application_form_responses.map((application_form_response) => {
          var _a2, _b2, _c2, _d;
          return /* @__PURE__ */ jsx(
            Link,
            {
              className: "border-sidebar-border/70 dark:border-sidebar-border hover:bg-sidebar-border/10 dark:hover:bg-sidebar-border overflow-hidden rounded-xl border p-2",
              href: `/student/application-form-responses/${application_form_response.id}/edit`,
              children: /* @__PURE__ */ jsxs("h3", { className: "flex flex-col gap-1", children: [
                /* @__PURE__ */ jsx("span", { className: "truncate font-semibold", children: application_form_response.application_form.name }),
                /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-500 dark:text-gray-400", children: (_d = (_c2 = (_b2 = (_a2 = application_form_response.application_form.learning_session) == null ? void 0 : _a2.teacher_classroom_curricular_area_cycle) == null ? void 0 : _b2.curricular_area_cycle) == null ? void 0 : _c2.curricular_area) == null ? void 0 : _d.name })
              ] })
            },
            application_form_response.id
          );
        }) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "fixed right-4 bottom-4", children: /* @__PURE__ */ jsxs("div", { className: "border-sidebar-border/70 dark:border-sidebar-border dark:bg-sidebar flex flex-col gap-4 rounded-xl border bg-white p-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsx(Label, { className: "text-base", children: "Nivel" }),
          /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm", children: t((_a = enrollment == null ? void 0 : enrollment.classroom) == null ? void 0 : _a.level) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsx(Label, { className: "text-base", children: "Grado" }),
          /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm", children: t((_b = enrollment == null ? void 0 : enrollment.classroom) == null ? void 0 : _b.grade) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsx(Label, { className: "text-base", children: "Sección" }),
          /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm", children: (_c = enrollment == null ? void 0 : enrollment.classroom) == null ? void 0 : _c.section })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsx(Label, { className: "text-base", children: "Año escolar" }),
          /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm", children: enrollment.academic_year })
        ] })
      ] }) })
    ] })
  ] });
}
export {
  Dashboard as default
};
