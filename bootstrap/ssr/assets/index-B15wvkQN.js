import { jsxs, jsx } from "react/jsx-runtime";
import { D as DataTable } from "./data-table-769qkqBW.js";
import { F as FlashMessages } from "./flash-messages-Brq5Zd2U.js";
import { B as Button } from "./button-BqjjxT-O.js";
import { I as Input } from "./input-B1uJ3yMO.js";
import { L as Label } from "./label-CC7KirIj.js";
import { A as AppLayout } from "./app-layout-BsERFbVR.js";
import { f as formatDate } from "./formats-CLP1uR7X.js";
import { u as useTranslations } from "./translator-csgEc0di.js";
import { Head, router } from "@inertiajs/react";
import { useState } from "react";
import "./table-CRcIHZD9.js";
import "./utils-qggO9Hcn.js";
import "clsx";
import "tailwind-merge";
import "@tanstack/react-table";
import "sonner";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "@radix-ui/react-label";
import "lucide-react";
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
  { title: "Inicio", href: "/teacher/dashboard" },
  { title: "Respuestas de Formularios", href: "/teacher/application-form-responses" }
];
function ApplicationFormResponse({ application_form_responses, filters = {} }) {
  const { t } = useTranslations();
  const [localFilters, setLocalFilters] = useState(filters);
  const handleSearch = () => {
    router.get(route("teacher.application-form-responses.index"), localFilters, {
      preserveState: true,
      preserveScroll: true,
      replace: true
    });
  };
  const StatusBadge = ({ status }) => {
    const statusMap = {
      pending: { label: "Pendiente", className: "bg-yellow-100 text-yellow-800" },
      "in progress": { label: "En progreso", className: "bg-blue-100 text-blue-800" },
      submitted: { label: "Enviado", className: "bg-green-100 text-green-800" },
      "in review": { label: "En revisión", className: "bg-purple-100 text-purple-800" },
      graded: { label: "Calificado", className: "bg-indigo-100 text-indigo-800" },
      returned: { label: "Devuelto", className: "bg-pink-100 text-pink-800" },
      late: { label: "Tardío", className: "bg-red-100 text-red-800" }
    };
    const statusInfo = statusMap[status] || { label: status, className: "bg-gray-100 text-gray-800" };
    return /* @__PURE__ */ jsx("span", { className: `inline-flex rounded-full px-2 text-xs leading-5 font-semibold ${statusInfo.className}`, children: statusInfo.label });
  };
  const columns = [
    {
      accessorKey: "student",
      header: "Estudiante",
      cell: ({ row }) => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _i;
        const response = row.original;
        return /* @__PURE__ */ jsx("div", { className: "font-medium", children: ((_c = (_b = (_a = response.student) == null ? void 0 : _a.user) == null ? void 0 : _b.profile) == null ? void 0 : _c.first_name) + " " + ((_f = (_e = (_d = response.student) == null ? void 0 : _d.user) == null ? void 0 : _e.profile) == null ? void 0 : _f.last_name) + " " + ((_i = (_h = (_g = response.student) == null ? void 0 : _g.user) == null ? void 0 : _h.profile) == null ? void 0 : _i.second_last_name) || "Estudiante no encontrado" });
      }
    },
    {
      accessorKey: "learning_session",
      header: "Sesión de Aprendizaje",
      cell: ({ row }) => {
        var _a, _b;
        const response = row.original;
        return ((_b = (_a = response.application_form) == null ? void 0 : _a.learning_session) == null ? void 0 : _b.name) || "No asignada";
      }
    },
    {
      accessorKey: "application_form",
      header: "Ficha de aplicación",
      cell: ({ row }) => {
        var _a;
        const response = row.original;
        return ((_a = response.application_form) == null ? void 0 : _a.name) || "Formulario no encontrado";
      }
    },
    {
      accessorKey: "classroom",
      header: "Aula",
      cell: ({ row }) => {
        var _a, _b, _c, _d, _e, _f, _g;
        const response = row.original;
        const learningSession = (_a = response.application_form) == null ? void 0 : _a.learning_session;
        return t((_c = (_b = learningSession == null ? void 0 : learningSession.teacher_classroom_curricular_area_cycle) == null ? void 0 : _b.classroom) == null ? void 0 : _c.level) + " " + t((_e = (_d = learningSession == null ? void 0 : learningSession.teacher_classroom_curricular_area_cycle) == null ? void 0 : _d.classroom) == null ? void 0 : _e.grade) + " " + ((_g = (_f = learningSession == null ? void 0 : learningSession.teacher_classroom_curricular_area_cycle) == null ? void 0 : _f.classroom) == null ? void 0 : _g.section);
      }
    },
    {
      accessorKey: "curricular_areas",
      header: "Área Curricular",
      cell: ({ row }) => {
        var _a, _b, _c, _d;
        const response = row.original;
        const curricularArea = (_d = (_c = (_b = (_a = response.application_form) == null ? void 0 : _a.learning_session) == null ? void 0 : _b.teacher_classroom_curricular_area_cycle) == null ? void 0 : _c.curricular_area_cycle) == null ? void 0 : _d.curricular_area;
        return (curricularArea == null ? void 0 : curricularArea.name) || "No asignada";
      }
    },
    {
      accessorKey: "status",
      header: "Estado",
      cell: ({ row }) => /* @__PURE__ */ jsx(StatusBadge, { status: row.original.status })
    },
    {
      accessorKey: "score",
      header: "Puntaje",
      cell: ({ row }) => {
        const score = row.original.score;
        return /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-900", children: score !== null ? `${score}` : "N/A" });
      }
    },
    {
      accessorKey: "submitted_at",
      header: "Enviado",
      cell: ({ row }) => {
        const submittedAt = row.original.submitted_at;
        return /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-500", children: submittedAt ? formatDate(submittedAt) : "No enviado" });
      }
    },
    {
      accessorKey: "id",
      header: "Acciones",
      cell: ({ row }) => {
        const { status, id } = row.original;
        const actionMap = {
          submitted: { label: "Revisar", route: "edit" },
          "in review": { label: "Calificar", route: "edit" },
          graded: { label: "Ver", route: "show" }
        };
        const action = actionMap[status];
        return action ? /* @__PURE__ */ jsx("div", { className: "flex space-x-2", children: /* @__PURE__ */ jsx("a", { href: route(`teacher.application-form-responses.${action.route}`, id), className: "text-indigo-600 hover:text-indigo-900", children: action.label }) }) : null;
      }
    }
  ];
  return /* @__PURE__ */ jsxs(AppLayout, { breadcrumbs, children: [
    /* @__PURE__ */ jsx(Head, { title: "Respuestas de Formularios" }),
    /* @__PURE__ */ jsx(FlashMessages, {}),
    /* @__PURE__ */ jsxs("div", { className: "flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 items-center gap-4 md:grid-cols-2", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(Label, { className: "mb-1 block text-sm font-medium text-gray-700", children: "Nombre del Estudiante" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              type: "text",
              placeholder: "Buscar por nombre",
              value: localFilters.search || "",
              onChange: (e) => setLocalFilters((prev) => ({ ...prev, search: e.target.value }))
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-end space-x-2", children: [
          /* @__PURE__ */ jsx(
            Button,
            {
              type: "button",
              onClick: () => setLocalFilters((prev) => ({
                ...prev,
                search: void 0,
                learning_session_id: filters.learning_session_id
              })),
              variant: "outline",
              children: "Limpiar"
            }
          ),
          /* @__PURE__ */ jsx(Button, { type: "button", onClick: handleSearch, children: "Buscar" })
        ] })
      ] }),
      /* @__PURE__ */ jsx(DataTable, { columns, data: application_form_responses })
    ] })
  ] });
}
export {
  ApplicationFormResponse as default
};
