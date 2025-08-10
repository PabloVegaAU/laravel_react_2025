import { jsxs, jsx } from "react/jsx-runtime";
import { L as Label } from "./label-GjpnCFkz.js";
import { A as AppLayout } from "./app-layout-Dq465f56.js";
import { u as useTranslations } from "./translator-csgEc0di.js";
import { c as cn } from "./utils-CpIjqAVa.js";
import { u as useUserStore } from "./use-mobile-navigation-cG7zaCET.js";
import { Head, Link } from "@inertiajs/react";
import { useEffect } from "react";
import "@radix-ui/react-label";
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
function Dashboard({ application_form_responses, enrollment, avatar, background }) {
  var _a, _b, _c;
  const { t } = useTranslations();
  const { setCurrentDashboardRole, setAvatar, setBackground, setUser } = useUserStore();
  useEffect(() => {
    setCurrentDashboardRole("/student/dashboard");
    setAvatar(avatar);
    setBackground(background);
  }, []);
  const breadcrumbs = [
    {
      title: t("Dashboard"),
      href: "/student/dashboard"
    }
  ];
  return /* @__PURE__ */ jsxs(AppLayout, { breadcrumbs, children: [
    /* @__PURE__ */ jsx(Head, { title: t("Dashboard") }),
    /* @__PURE__ */ jsxs("div", { className: "relative flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4 pb-96", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4", children: [
        /* @__PURE__ */ jsx("div", { className: "dark:bg-sidebar rounded-xl bg-white p-2", children: /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold", children: t("Pending Application Forms") }) }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4", children: application_form_responses.map((application_form_response) => {
          var _a2, _b2, _c2, _d;
          return /* @__PURE__ */ jsx(
            Link,
            {
              className: cn(
                "border-sidebar-border/70 dark:border-sidebar-border",
                "overflow-hidden rounded-xl border p-2",
                "dark:bg-sidebar bg-white",
                "hover:bg-sidebar-border dark:hover:bg-sidebar-border"
              ),
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
          /* @__PURE__ */ jsx(Label, { className: "text-base", children: t("Level") }),
          /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm", children: t((_a = enrollment == null ? void 0 : enrollment.classroom) == null ? void 0 : _a.level) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsx(Label, { className: "text-base", children: t("Grade") }),
          /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm", children: t((_b = enrollment == null ? void 0 : enrollment.classroom) == null ? void 0 : _b.grade) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsx(Label, { className: "text-base", children: t("Section") }),
          /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm", children: (_c = enrollment == null ? void 0 : enrollment.classroom) == null ? void 0 : _c.section })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsx(Label, { className: "text-base", children: t("School Year") }),
          /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm", children: enrollment.academic_year })
        ] })
      ] }) })
    ] })
  ] });
}
export {
  Dashboard as default
};
