import { jsxs, jsx } from "react/jsx-runtime";
import { D as DataTable } from "./data-table-BozUKPPq.js";
import { F as FlashMessages } from "./flash-messages-Brq5Zd2U.js";
import { B as Button } from "./button-B8Z_lz_J.js";
import { I as Input } from "./input-Dr5dPtfm.js";
import { L as Label } from "./label-GjpnCFkz.js";
import { A as AppLayout } from "./app-layout-Dq465f56.js";
import { b as formatDateTime } from "./formats-DYgp-paT.js";
import { Head, router } from "@inertiajs/react";
import { useState } from "react";
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
import "./translator-csgEc0di.js";
import "@tanstack/react-query";
const breadcrumbs = [
  {
    title: "Inicio",
    href: "/teacher/dashboard"
  },
  {
    title: "Premios",
    href: "teacher/student-prizes"
  }
];
function StudentPrizes({ student_prizes, filters }) {
  const [localFilters, setLocalFilters] = useState(filters);
  const handleSearch = () => {
    router.get(route("teacher.student-prizes.index"), localFilters, {
      preserveState: true,
      preserveScroll: true,
      replace: true
    });
  };
  const handleClaim = (id) => {
    router.post(route("teacher.student-prizes.claim", id), {
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
      header: "Nombres y Apellidos",
      accessorKey: "student.profile",
      cell: ({ cell }) => {
        const profile = cell.getValue();
        return profile.first_name + " " + profile.last_name + " " + profile.second_last_name;
      }
    },
    {
      header: "Premio",
      accessorKey: "prize.name"
    },
    {
      header: "Obtenido",
      accessorKey: "exchange_date",
      cell: (row) => formatDateTime(row.getValue())
    },
    {
      header: "Acciones",
      accessorKey: "actions",
      cell: ({ row }) => {
        const studentPrize = row.original;
        return /* @__PURE__ */ jsx("div", { className: "flex space-x-2", id: studentPrize.id.toString(), children: /* @__PURE__ */ jsx(
          Button,
          {
            variant: studentPrize.claimed ? "default" : "outline",
            onClick: () => handleClaim(studentPrize.id),
            disabled: studentPrize.claimed,
            children: studentPrize.claimed ? "Entregado" : "Entregar"
          }
        ) });
      }
    }
  ];
  return /* @__PURE__ */ jsxs(AppLayout, { breadcrumbs, children: [
    /* @__PURE__ */ jsx(Head, { title: "Premios" }),
    /* @__PURE__ */ jsx(FlashMessages, {}),
    /* @__PURE__ */ jsxs("div", { className: "flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4", children: [
      /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between gap-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(Label, { children: "Nombres y Apellidos" }),
          /* @__PURE__ */ jsx(Input, { value: localFilters.search, onChange: (e) => setLocalFilters((prev) => ({ ...prev, search: e.target.value })) })
        ] }),
        /* @__PURE__ */ jsx(Button, { onClick: handleSearch, children: "Buscar" })
      ] }) }),
      /* @__PURE__ */ jsx(DataTable, { columns, data: student_prizes })
    ] })
  ] });
}
export {
  StudentPrizes as default
};
