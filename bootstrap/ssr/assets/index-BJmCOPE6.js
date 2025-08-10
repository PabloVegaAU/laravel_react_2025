import { jsxs, jsx } from "react/jsx-runtime";
import { D as DataTable } from "./data-table-769qkqBW.js";
import { F as FlashMessages } from "./flash-messages-Brq5Zd2U.js";
import { B as Badge } from "./badge-DIxTRnmV.js";
import { B as Button } from "./button-BqjjxT-O.js";
import { A as AppLayout } from "./app-layout-BsERFbVR.js";
import { f as formatDate } from "./formats-CLP1uR7X.js";
import { u as useTranslations } from "./translator-csgEc0di.js";
import { c as cn } from "./utils-qggO9Hcn.js";
import { Head, Link, router } from "@inertiajs/react";
import { FileText } from "lucide-react";
import "./table-CRcIHZD9.js";
import "@tanstack/react-table";
import "react";
import "sonner";
import "@radix-ui/react-slot";
import "class-variance-authority";
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
import "clsx";
import "tailwind-merge";
const breadcrumbs = [
  { title: "Inicio", href: "/teacher/dashboard" },
  {
    title: "Sesiones de Aprendizaje",
    href: "teacher/learning-session"
  }
];
function LearningSessionIndex({ learningSessions }) {
  const { t } = useTranslations();
  const columns = [
    {
      header: "Tema",
      accessorKey: "name"
    },
    {
      header: "Competencia",
      accessorKey: "competency.name",
      cell: (row) => row.getValue()
    },
    {
      header: "Estado",
      accessorKey: "status",
      cell: (row) => {
        const colorStatus = row.getValue() === "active" ? "default" : "destructive";
        return /* @__PURE__ */ jsx(Badge, { variant: colorStatus, children: t(row.getValue(), "") });
      }
    },
    {
      header: "Fecha de Aplicación",
      accessorKey: "application_date",
      cell: (row) => formatDate(row.getValue())
    },
    {
      header: "Acciones",
      id: "actions",
      cell: ({ row }) => {
        const learningSession = row.original;
        return /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
          /* @__PURE__ */ jsx(Link, { href: `/teacher/application-form-responses?learning_session_id=${learningSession.id}`, title: "Ver respuestas de esta sesión", children: /* @__PURE__ */ jsxs(Button, { variant: "outline", size: "sm", className: "gap-2", children: [
            /* @__PURE__ */ jsx(FileText, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsx("span", { children: "Revisar" })
          ] }) }),
          /* @__PURE__ */ jsx("div", { className: cn("rounded-lg p-1 font-bold", learningSession.application_form ? "bg-green-500" : "bg-red-500"), children: learningSession.application_form ? "Con ficha" : "Sin ficha" }),
          /* @__PURE__ */ jsx(Link, { href: `/teacher/learning-sessions/${learningSession.id}/edit`, children: /* @__PURE__ */ jsx(Button, { variant: "info", size: "sm", children: "Editar" }) }),
          learningSession.status === "active" ? /* @__PURE__ */ jsx(Button, { variant: "destructive", size: "sm", onClick: () => handleStatusChange(learningSession.id, "inactive"), children: "Desactivar" }) : /* @__PURE__ */ jsx(Button, { variant: "default", size: "sm", onClick: () => handleStatusChange(learningSession.id, "active"), children: "Activar" })
        ] });
      }
    }
  ];
  const handleStatusChange = (id, status) => {
    return router.put(
      `/teacher/learning-sessions/${id}/change-status`,
      {
        status
      },
      {
        preserveScroll: true,
        preserveState: true
      }
    );
  };
  return /* @__PURE__ */ jsxs(AppLayout, { breadcrumbs, children: [
    /* @__PURE__ */ jsx(Head, { title: t("session_learning.title", "Sesiones de Aprendizaje") }),
    /* @__PURE__ */ jsx(FlashMessages, {}),
    /* @__PURE__ */ jsxs("div", { className: "flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4", children: [
      /* @__PURE__ */ jsx(Link, { href: "/teacher/learning-sessions/create", children: /* @__PURE__ */ jsx(Button, { children: "Crear Sesión de Aprendizaje" }) }),
      /* @__PURE__ */ jsx(DataTable, { columns, data: learningSessions })
    ] })
  ] });
}
export {
  LearningSessionIndex as default
};
