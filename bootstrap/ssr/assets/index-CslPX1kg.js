import { jsxs, jsx } from "react/jsx-runtime";
import { D as DataTable } from "./data-table-769qkqBW.js";
import { F as FlashMessages } from "./flash-messages-Brq5Zd2U.js";
import { B as Button } from "./button-BqjjxT-O.js";
import { A as AppLayout } from "./app-layout-BsERFbVR.js";
import { u as useTranslations } from "./translator-csgEc0di.js";
import { Head, Link } from "@inertiajs/react";
import { format } from "date-fns";
import "./table-CRcIHZD9.js";
import "./utils-qggO9Hcn.js";
import "clsx";
import "tailwind-merge";
import "@tanstack/react-table";
import "react";
import "sonner";
import "@radix-ui/react-slot";
import "class-variance-authority";
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
  {
    title: "Fichas de Aplicación",
    href: "teacher/application-forms"
  }
];
function ApplicationsForm({ applicationForms }) {
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
      header: "Fecha de inicio",
      accessorKey: "start_date",
      cell: (row) => format(new Date(row.getValue()), "dd/MM/yyyy")
    },
    {
      header: "Fecha de fin",
      accessorKey: "end_date",
      cell: (row) => format(new Date(row.getValue()), "dd/MM/yyyy")
    },
    {
      header: "Estado",
      accessorKey: "status",
      cell: (row) => {
        const status = String(row.getValue() || "").toLowerCase();
        return t(status, "");
      }
    },
    {
      header: "Acciones",
      accessorKey: "id",
      accessorFn: (row) => row.id,
      cell: (row) => /* @__PURE__ */ jsxs("div", { className: "flex space-x-2", children: [
        /* @__PURE__ */ jsx(Link, { href: `/teacher/application-forms/${row.getValue()}/edit`, children: /* @__PURE__ */ jsx(Button, { variant: "outline", size: "sm", children: "Editar" }) }),
        /* @__PURE__ */ jsx(Link, { href: `/teacher/application-forms/${row.getValue()}`, children: /* @__PURE__ */ jsx(Button, { variant: "outline", size: "sm", children: "Ver" }) })
      ] })
    }
  ];
  return /* @__PURE__ */ jsxs(AppLayout, { breadcrumbs, children: [
    /* @__PURE__ */ jsx(Head, { title: t("application_forms.title", "Fichas de Aplicación") }),
    /* @__PURE__ */ jsx(FlashMessages, {}),
    /* @__PURE__ */ jsx("div", { className: "flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4", children: /* @__PURE__ */ jsx(DataTable, { columns, data: applicationForms }) })
  ] });
}
export {
  ApplicationsForm as default
};
