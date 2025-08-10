import { jsxs, jsx } from "react/jsx-runtime";
import { D as DataTable } from "./data-table-BozUKPPq.js";
import { F as FlashMessages } from "./flash-messages-Brq5Zd2U.js";
import { B as Badge } from "./badge-65mno7eO.js";
import { B as Button } from "./button-B8Z_lz_J.js";
import { P as Popover, a as PopoverTrigger, b as PopoverContent, C as Calendar } from "./popover-5aXgFmPv.js";
import { I as Input } from "./input-Dr5dPtfm.js";
import { S as Select, a as SelectTrigger, b as SelectValue, d as SelectContent, c as SelectItem } from "./select-DMPk8oWi.js";
import { A as AppLayout } from "./app-layout-Dq465f56.js";
import { u as useTranslations } from "./translator-csgEc0di.js";
import { g as getBadgeColor } from "./index-Bc2QsrC0.js";
import { c as cn } from "./utils-CpIjqAVa.js";
import { usePage, Head, router, Link } from "@inertiajs/react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import "./table-BeW_tWiO.js";
import "@tanstack/react-table";
import "sonner";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "react-day-picker";
import "@radix-ui/react-popover";
import "@radix-ui/react-select";
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
import "clsx";
import "tailwind-merge";
const breadcrumbs = [
  {
    title: "Inicio",
    href: "/teacher/dashboard"
  },
  {
    title: "Fichas de Aplicación",
    href: "/teacher/application-forms"
  }
];
function ApplicationForms({ applicationForms, filters: initialFilters = {} }) {
  const { t } = useTranslations();
  const { url } = usePage();
  const [filters, setFilters] = useState({
    search: (initialFilters == null ? void 0 : initialFilters.search) || "",
    status: (initialFilters == null ? void 0 : initialFilters.status) || "",
    start_date: (initialFilters == null ? void 0 : initialFilters.start_date) ? new Date(initialFilters.start_date) : null,
    end_date: (initialFilters == null ? void 0 : initialFilters.end_date) ? new Date(initialFilters.end_date) : null
  });
  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };
  const applyFilters = (e) => {
    e.preventDefault();
    const params = {};
    if (filters.search) params.search = filters.search;
    if (filters.status) params.status = filters.status;
    if (filters.start_date) params.start_date = format(filters.start_date, "yyyy-MM-dd");
    if (filters.end_date) params.end_date = format(filters.end_date, "yyyy-MM-dd");
    router.get(url.split("?")[0], params, {
      preserveState: true,
      preserveScroll: true
    });
  };
  const resetFilters = () => {
    setFilters({
      search: "",
      status: "",
      start_date: null,
      end_date: null
    });
    router.get(
      url.split("?")[0],
      {},
      {
        preserveState: true,
        preserveScroll: true
      }
    );
  };
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
        const statusValue = row.getValue();
        const status = t(statusValue, "");
        return /* @__PURE__ */ jsx(Badge, { variant: getBadgeColor(statusValue), children: status });
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
    /* @__PURE__ */ jsx(Head, { title: t("Application Forms") }),
    /* @__PURE__ */ jsx(FlashMessages, {}),
    /* @__PURE__ */ jsxs("div", { className: "flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4", children: [
      /* @__PURE__ */ jsxs("form", { onSubmit: applyFilters, className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4", children: [
          /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(Input, { placeholder: "Buscar...", value: filters.search, onChange: (e) => handleFilterChange("search", e.target.value) }) }),
          /* @__PURE__ */ jsxs(Select, { value: filters.status, onValueChange: (value) => handleFilterChange("status", value), children: [
            /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Estado" }) }),
            /* @__PURE__ */ jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsx(SelectItem, { value: "draft", children: "Borrador" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "active", children: "Activo" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "inactive", children: "Inactivo" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "archived", children: "Archivado" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs(Popover, { children: [
            /* @__PURE__ */ jsx(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(
              Button,
              {
                variant: "outline",
                className: cn("w-full justify-start text-left font-normal", !filters.start_date && "text-muted-foreground"),
                children: [
                  /* @__PURE__ */ jsx(CalendarIcon, { className: "mr-2 h-4 w-4" }),
                  filters.start_date ? format(filters.start_date, "PPP", { locale: es }) : /* @__PURE__ */ jsx("span", { children: "Fecha de inicio" })
                ]
              }
            ) }),
            /* @__PURE__ */ jsx(PopoverContent, { className: "w-auto p-0", align: "start", children: /* @__PURE__ */ jsx(
              Calendar,
              {
                mode: "single",
                selected: filters.start_date || void 0,
                onSelect: (date) => {
                  if (date) {
                    const startOfDay = new Date(date);
                    startOfDay.setHours(0, 0, 0, 0);
                    handleFilterChange("start_date", startOfDay);
                  }
                },
                autoFocus: true,
                locale: es
              }
            ) })
          ] }),
          /* @__PURE__ */ jsxs(Popover, { children: [
            /* @__PURE__ */ jsx(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Button, { variant: "outline", className: cn("w-full justify-start text-left font-normal", !filters.end_date && "text-muted-foreground"), children: [
              /* @__PURE__ */ jsx(CalendarIcon, { className: "mr-2 h-4 w-4" }),
              filters.end_date ? format(filters.end_date, "PPP", { locale: es }) : /* @__PURE__ */ jsx("span", { children: "Fecha de fin" })
            ] }) }),
            /* @__PURE__ */ jsx(PopoverContent, { className: "w-auto p-0", align: "start", children: /* @__PURE__ */ jsx(
              Calendar,
              {
                mode: "single",
                selected: filters.end_date || void 0,
                onSelect: (date) => {
                  if (date) {
                    const endOfDay = new Date(date);
                    endOfDay.setHours(23, 59, 59, 999);
                    handleFilterChange("end_date", endOfDay);
                  }
                },
                autoFocus: true,
                locale: es
              }
            ) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex space-x-2", children: [
          /* @__PURE__ */ jsx(Button, { type: "submit", variant: "default", children: "Aplicar filtros" }),
          /* @__PURE__ */ jsx(Button, { type: "button", variant: "outline", onClick: resetFilters, children: "Limpiar filtros" })
        ] })
      ] }),
      /* @__PURE__ */ jsx(DataTable, { columns, data: applicationForms })
    ] })
  ] });
}
export {
  ApplicationForms as default
};
