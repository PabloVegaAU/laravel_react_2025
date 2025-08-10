import { jsxs, jsx } from "react/jsx-runtime";
import { D as DataTable } from "./data-table-BozUKPPq.js";
import { F as FlashMessages } from "./flash-messages-Brq5Zd2U.js";
import { B as Button } from "./button-B8Z_lz_J.js";
import { I as Input } from "./input-Dr5dPtfm.js";
import { L as Label } from "./label-GjpnCFkz.js";
import { A as AppLayout } from "./app-layout-Dq465f56.js";
import { f as formatDate } from "./formats-DYgp-paT.js";
import { u as useTranslations } from "./translator-csgEc0di.js";
import { Head, router } from "@inertiajs/react";
import { useState } from "react";
import { CreateEnrollmentDialog } from "./form-create-BP0Rlu9r.js";
import "./table-BeW_tWiO.js";
import "./utils-CpIjqAVa.js";
import "clsx";
import "tailwind-merge";
import "@tanstack/react-table";
import "sonner";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "@radix-ui/react-label";
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
import "./input-error-CyRLkAox.js";
import "@radix-ui/react-select";
import "./select-DMPk8oWi.js";
import "./checkbox-kbYJu5q1.js";
import "@radix-ui/react-checkbox";
import "./dialog-sRXsDe1Q.js";
const breadcrumbs = [
  {
    title: "Matriculas",
    href: "admin/enrollment"
  }
];
function Enrollments({ enrollments, filters }) {
  var _a;
  const { t } = useTranslations();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);
  const handleFilterChange = (name, value) => {
    const newFilters = {
      ...filters,
      [name]: value
    };
    setLocalFilters(newFilters);
  };
  const handleSearch = () => {
    router.get(route("admin.enrollments.index"), localFilters, {
      preserveState: true,
      preserveScroll: true,
      replace: true
    });
  };
  const columns = [
    {
      header: "ID",
      accessorKey: "id"
    },
    {
      header: "Estudiante",
      accessorKey: "student.profile",
      cell: ({ cell }) => {
        const profile = cell.getValue();
        return /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsxs("p", { children: [
          profile.first_name,
          " ",
          profile.last_name,
          " ",
          profile.second_last_name
        ] }) });
      }
    },
    {
      header: "Clase",
      accessorKey: "classroom",
      cell: ({ cell }) => {
        const classroom = cell.getValue();
        return /* @__PURE__ */ jsxs("p", { children: [
          t(classroom.grade),
          " ",
          classroom.section,
          " ",
          t(classroom.level)
        ] });
      }
    },
    {
      header: "Año",
      accessorKey: "academic_year"
    },
    {
      header: "Fecha de matricula",
      accessorKey: "enrollment_date",
      cell({ cell }) {
        return /* @__PURE__ */ jsx("p", { children: formatDate(cell.getValue()) });
      }
    }
  ];
  return /* @__PURE__ */ jsxs(AppLayout, { breadcrumbs, children: [
    /* @__PURE__ */ jsx(Head, { title: "Matriculas" }),
    /* @__PURE__ */ jsx(FlashMessages, {}),
    /* @__PURE__ */ jsxs("div", { className: "flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4", children: [
      /* @__PURE__ */ jsx(CreateEnrollmentDialog, { isOpen: isCreateModalOpen, onOpenChange: setIsCreateModalOpen }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(Label, { children: "Año" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              type: "number",
              placeholder: "Año",
              value: (_a = localFilters.year) == null ? void 0 : _a.toString(),
              onChange: (e) => handleFilterChange("year", e.target.value)
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(Label, { children: "Buscar" }),
          /* @__PURE__ */ jsx(Input, { type: "text", placeholder: "Buscar", value: localFilters.search, onChange: (e) => handleFilterChange("search", e.target.value) })
        ] }),
        /* @__PURE__ */ jsx(Button, { variant: "outline-info", onClick: () => setLocalFilters((prev) => ({ ...prev, year: "", search: "" })), children: "Limpiar" }),
        /* @__PURE__ */ jsx(Button, { variant: "info", onClick: handleSearch, children: "Buscar" })
      ] }),
      /* @__PURE__ */ jsx(DataTable, { columns, data: enrollments })
    ] })
  ] });
}
export {
  Enrollments as default
};
