import { jsxs, jsx } from "react/jsx-runtime";
import { D as DataTable } from "./data-table-769qkqBW.js";
import { F as FlashMessages } from "./flash-messages-Brq5Zd2U.js";
import { S as Select, a as SelectTrigger, b as SelectValue, d as SelectContent, c as SelectItem } from "./select-qcG6mW7O.js";
import { A as AppLayout } from "./app-layout-BsERFbVR.js";
import { u as useTranslations } from "./translator-csgEc0di.js";
import { Head, router } from "@inertiajs/react";
import { useState } from "react";
import "./table-CRcIHZD9.js";
import "./utils-qggO9Hcn.js";
import "clsx";
import "tailwind-merge";
import "@tanstack/react-table";
import "sonner";
import "@radix-ui/react-select";
import "lucide-react";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./button-BqjjxT-O.js";
import "@radix-ui/react-dialog";
import "@radix-ui/react-tooltip";
import "./useUserStore-Db9ma-Ts.js";
import "zustand";
import "zustand/middleware";
import "./app-logo-icon-ZHVQJC4L.js";
import "./image-Bmp5thdH.js";
import "@radix-ui/react-dropdown-menu";
import "@radix-ui/react-avatar";
import "@tanstack/react-query";
const breadcrumbs = [
  {
    title: "Sesiones de Aprendizaje",
    href: "teacher/learning-session"
  }
];
function LearningSession({ learning_sessions, curricular_areas, filters }) {
  console.log("learning_sessions", learning_sessions);
  const { t } = useTranslations();
  const columns = [
    {
      header: "ID",
      accessorKey: "id"
    },
    {
      header: "Nombre",
      accessorKey: "name"
    },
    {
      header: "Estado",
      accessorKey: "application_form",
      cell: (cell) => {
        var _a;
        const applicationForms = cell.row.original.application_form;
        const response = (_a = applicationForms == null ? void 0 : applicationForms.responses) == null ? void 0 : _a[0];
        if (!applicationForms) return "No disponible";
        if (response) {
          return t(
            `statuses.${response.status}`,
            {
              pending: "Pendiente",
              "in progress": "En progreso",
              submitted: "Enviado",
              "in review": "En revisión",
              graded: "Calificado",
              returned: "Devuelto",
              late: "Tardío"
            }[response.status] || response.status
          );
        }
        return t(applicationForms == null ? void 0 : applicationForms.status, "");
      }
    },
    {
      header: "Nota",
      accessorKey: "application_form",
      cell: (cell) => {
        var _a;
        const applicationForms = cell.row.original.application_form;
        const response = (_a = applicationForms == null ? void 0 : applicationForms.responses) == null ? void 0 : _a[0];
        return (applicationForms == null ? void 0 : applicationForms.score_max) + " / " + ((response == null ? void 0 : response.score) || "N/A");
      }
    },
    {
      header: "Acciones",
      accessorKey: "id",
      cell: (row) => {
        var _a, _b;
        const applicationForms = row.row.original.application_form;
        const response = (_a = applicationForms == null ? void 0 : applicationForms.responses) == null ? void 0 : _a[0];
        const now = /* @__PURE__ */ new Date();
        const startDate = new Date((applicationForms == null ? void 0 : applicationForms.start_date) || "");
        const endDate = new Date((applicationForms == null ? void 0 : applicationForms.end_date) || "");
        const isAvailable = (((_b = applicationForms == null ? void 0 : applicationForms.responses) == null ? void 0 : _b.length) || 0) > 0 && now >= startDate && now <= endDate;
        const canTakeTest = !response || response.status === "pending" || response.status === "in progress";
        return /* @__PURE__ */ jsx("div", { className: "flex space-x-2", children: isAvailable && (canTakeTest ? /* @__PURE__ */ jsx(
          "a",
          {
            href: `/student/application-form-responses/${applicationForms == null ? void 0 : applicationForms.responses[0].id}/edit`,
            className: "inline-flex items-center rounded-md border border-transparent bg-blue-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none",
            children: response ? "Continuar prueba" : "Comenzar prueba"
          }
        ) : /* @__PURE__ */ jsx(
          "a",
          {
            href: `/student/application-form-responses/${applicationForms == null ? void 0 : applicationForms.responses[0].id}`,
            className: "inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none",
            children: "Ver prueba"
          }
        )) });
      }
    }
  ];
  const [localFilters, setLocalFilters] = useState({
    curricular_area_id: filters.curricular_area_id || "0",
    // Default to '0' (Todos) if no filter is set
    response_status: filters.response_status || ""
  });
  const handleFilterChange = (name, value) => {
    const newFilters = {
      ...filters,
      [name]: value
    };
    setLocalFilters(newFilters);
    router.get(route("student.learning-sessions.index"), newFilters, {
      preserveState: true,
      preserveScroll: true,
      replace: true
    });
  };
  return /* @__PURE__ */ jsxs(AppLayout, { breadcrumbs, children: [
    /* @__PURE__ */ jsx(Head, { title: t("session_learning.title", "Sesiones de Aprendizaje") }),
    /* @__PURE__ */ jsx(FlashMessages, {}),
    /* @__PURE__ */ jsxs("div", { className: "flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-4 flex flex-col justify-end gap-4 sm:flex-row sm:items-center", children: [
        localFilters.curricular_area_id !== "0" && (() => {
          var _a, _b, _c, _d, _e;
          const selectedArea = curricular_areas.find((a) => a.id.toString() === localFilters.curricular_area_id);
          const teacher = (_d = (_c = (_b = (_a = selectedArea == null ? void 0 : selectedArea.cycles) == null ? void 0 : _a[0]) == null ? void 0 : _b.teacher_classroom_curricular_area_cycles) == null ? void 0 : _c[0]) == null ? void 0 : _d.teacher;
          return ((_e = teacher == null ? void 0 : teacher.user) == null ? void 0 : _e.profile) ? /* @__PURE__ */ jsx("div", { className: "min-w-0 flex-1 text-right sm:text-left", children: /* @__PURE__ */ jsxs("p", { className: "truncate text-sm text-gray-600", children: [
            /* @__PURE__ */ jsx("span", { className: "font-medium", children: "Docente:" }),
            " ",
            [teacher.user.profile.first_name, teacher.user.profile.last_name].filter(Boolean).join(" ")
          ] }) }) : null;
        })(),
        /* @__PURE__ */ jsx("div", { className: "dark:bg-sidebar-border w-full rounded bg-white sm:w-64", children: /* @__PURE__ */ jsxs(Select, { value: localFilters.curricular_area_id, onValueChange: (value) => handleFilterChange("curricular_area_id", value), children: [
          /* @__PURE__ */ jsx(SelectTrigger, { className: "w-full", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Seleccionar área curricular" }) }),
          /* @__PURE__ */ jsx(SelectContent, { children: curricular_areas.map((area) => {
            const showColor = area.id.toString() !== "0" && area.color;
            return /* @__PURE__ */ jsx(SelectItem, { value: area.id.toString(), children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              showColor && /* @__PURE__ */ jsx("span", { className: "h-3 w-3 rounded-full", style: { backgroundColor: area.color }, "aria-hidden": "true" }),
              /* @__PURE__ */ jsx("span", { className: "truncate", children: area.name })
            ] }) }, area.id);
          }) })
        ] }) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "dark:bg-sidebar-border rounded-xl bg-white p-4", children: /* @__PURE__ */ jsx(DataTable, { columns, data: learning_sessions }) })
    ] })
  ] });
}
export {
  LearningSession as default
};
