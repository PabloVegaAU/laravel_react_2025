import { jsxs, jsx } from "react/jsx-runtime";
import { D as DataTable } from "./data-table-BozUKPPq.js";
import { F as FlashMessages } from "./flash-messages-Brq5Zd2U.js";
import { B as Button } from "./button-B8Z_lz_J.js";
import { A as AppLayout } from "./app-layout-Dq465f56.js";
import { u as useTranslations } from "./translator-csgEc0di.js";
import { Head } from "@inertiajs/react";
import { format } from "date-fns";
import "./table-BeW_tWiO.js";
import "./utils-CpIjqAVa.js";
import "clsx";
import "tailwind-merge";
import "@tanstack/react-table";
import "react";
import "sonner";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "lucide-react";
import "@radix-ui/react-dialog";
import "./use-mobile-navigation-cG7zaCET.js";
import "@radix-ui/react-tooltip";
import "zustand";
import "zustand/middleware";
import "./app-logo-icon-Dnok8BqH.js";
import "./image-Bmp5thdH.js";
import "@radix-ui/react-dropdown-menu";
import "@radix-ui/react-avatar";
import "@tanstack/react-query";
const breadcrumbs = [
  {
    title: "Fichas de Aplicación",
    href: "student/application-forms"
  },
  {
    title: "Tienda de Puntos",
    href: "#"
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
      cell: (row) => format(row.getValue(), "dd/MM/yyyy")
    },
    {
      header: "Fecha de fin",
      accessorKey: "end_date",
      cell: (row) => format(row.getValue(), "dd/MM/yyyy")
    },
    {
      header: "Estado",
      accessorKey: "status",
      cell: (row) => {
        const status = String(row.getValue() || "").toLowerCase();
        return t(status, "status");
      }
    },
    {
      header: "Acciones",
      accessorKey: "actions",
      cell: () => /* @__PURE__ */ jsx(Button, { children: "Completar" })
    }
  ];
  return /* @__PURE__ */ jsxs(AppLayout, { breadcrumbs, children: [
    /* @__PURE__ */ jsx(Head, { title: "Fichas de Aplicación" }),
    /* @__PURE__ */ jsx(FlashMessages, {}),
    /* @__PURE__ */ jsx("div", { className: "flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4", children: /* @__PURE__ */ jsx(DataTable, { columns, data: applicationForms }) })
  ] });
}
export {
  ApplicationsForm as default
};
