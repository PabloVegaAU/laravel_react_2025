import { jsxs, jsx } from "react/jsx-runtime";
import { D as DataTable } from "./data-table-BozUKPPq.js";
import { F as FlashMessages } from "./flash-messages-Brq5Zd2U.js";
import { B as Button } from "./button-B8Z_lz_J.js";
import { I as Input } from "./input-Dr5dPtfm.js";
import { L as Label } from "./label-GjpnCFkz.js";
import { A as AppLayout } from "./app-layout-Dq465f56.js";
import { Head, router } from "@inertiajs/react";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { CreateAchievementDialog } from "./form-create-DtNXWV-S.js";
import { EditAchievementDialog } from "./form-edit-B9wtpVL5.js";
import "./table-BeW_tWiO.js";
import "./utils-CpIjqAVa.js";
import "clsx";
import "tailwind-merge";
import "@tanstack/react-table";
import "sonner";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "@radix-ui/react-label";
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
import "./checkbox-kbYJu5q1.js";
import "@radix-ui/react-checkbox";
import "./dialog-sRXsDe1Q.js";
import "./input-error-CyRLkAox.js";
const breadcrumbs = [
  {
    title: "Inicio",
    href: "/admin/dashboard"
  },
  {
    title: "Logros",
    href: "/admin/achievements"
  }
];
function Achievements({ achievements, filters }) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAchievementId, setSelectedAchievementId] = useState(null);
  const handleFilterChange = (name, value) => {
    const newFilters = {
      ...filters,
      [name]: value
    };
    setLocalFilters(newFilters);
  };
  const handleSearch = () => {
    router.get(route("admin.achievements.index"), localFilters, {
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
      header: "Nombre",
      accessorKey: "name"
    },
    {
      header: "Descripción",
      accessorKey: "description"
    },
    {
      header: "Acciones",
      accessorKey: "id",
      cell: (row) => {
        const achievementId = row.getValue();
        return /* @__PURE__ */ jsx("div", { className: "flex gap-2", children: /* @__PURE__ */ jsx(
          Button,
          {
            variant: "ghost",
            size: "icon",
            onClick: () => {
              setSelectedAchievementId(achievementId);
              setIsEditModalOpen(true);
            },
            children: /* @__PURE__ */ jsx(Pencil, { className: "h-4 w-4" })
          }
        ) });
      }
    }
  ];
  return /* @__PURE__ */ jsxs(AppLayout, { breadcrumbs, children: [
    /* @__PURE__ */ jsx(Head, { title: "Logros" }),
    /* @__PURE__ */ jsx(FlashMessages, {}),
    /* @__PURE__ */ jsx("div", { className: "relative flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold", children: "Logros" }),
        /* @__PURE__ */ jsx(CreateAchievementDialog, { isOpen: isCreateModalOpen, onOpenChange: setIsCreateModalOpen })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "search", children: "Buscar" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "search",
              placeholder: "Buscar logros...",
              value: localFilters.search || "",
              onChange: (e) => handleFilterChange("search", e.target.value),
              onKeyDown: (e) => e.key === "Enter" && handleSearch()
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(Button, { className: "mt-4", onClick: handleSearch, children: "Buscar" }) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "rounded-lg border", children: /* @__PURE__ */ jsx(DataTable, { columns, data: achievements }) })
    ] }) }),
    selectedAchievementId && /* @__PURE__ */ jsx(EditAchievementDialog, { isOpen: isEditModalOpen, onOpenChange: setIsEditModalOpen, achievementId: selectedAchievementId })
  ] });
}
export {
  Achievements as default
};
