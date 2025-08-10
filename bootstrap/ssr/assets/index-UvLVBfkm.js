import { jsxs, jsx } from "react/jsx-runtime";
import { D as DataTable } from "./data-table-BozUKPPq.js";
import { A as AppLayout } from "./app-layout-Dq465f56.js";
import { Head } from "@inertiajs/react";
import { useState } from "react";
import { ClassroomCurricularAreasDialog } from "./classroom-curricular-areas-BCThuZVB.js";
import { CreateTeacherDialog } from "./form-create-TtNPdmpg.js";
import { EditTeacherDialog } from "./form-edit-Ce-Ry-zW.js";
import "./table-BeW_tWiO.js";
import "./utils-CpIjqAVa.js";
import "clsx";
import "tailwind-merge";
import "@tanstack/react-table";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "lucide-react";
import "./button-B8Z_lz_J.js";
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
import "./dialog-sRXsDe1Q.js";
import "./input-error-CyRLkAox.js";
import "./input-Dr5dPtfm.js";
import "./label-GjpnCFkz.js";
import "@radix-ui/react-label";
import "./formats-DYgp-paT.js";
const breadcrumbs = [
  {
    title: "Docentes",
    href: "admin/teachers"
  }
];
function Teachers({ users }) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const columns = [
    {
      header: "ID",
      accessorKey: "id"
    },
    {
      header: "Usuario",
      accessorKey: "name"
    },
    {
      header: "Nombres y apellidos",
      accessorKey: "profile",
      cell(row) {
        const profile = row.cell.getValue();
        return profile.first_name + " " + profile.last_name + " " + profile.second_last_name;
      }
    },
    {
      header: "Acciones",
      accessorKey: "id",
      cell(row) {
        const userId = row.cell.getValue();
        return /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsx(EditTeacherDialog, { userId }),
          /* @__PURE__ */ jsx(ClassroomCurricularAreasDialog, { userId })
        ] });
      }
    }
  ];
  return /* @__PURE__ */ jsxs(AppLayout, { breadcrumbs, children: [
    /* @__PURE__ */ jsx(Head, { title: "Docentes" }),
    /* @__PURE__ */ jsxs("div", { className: "flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4", children: [
      /* @__PURE__ */ jsx(CreateTeacherDialog, { isOpen: isCreateModalOpen, onOpenChange: setIsCreateModalOpen }),
      /* @__PURE__ */ jsx(DataTable, { columns, data: users })
    ] })
  ] });
}
export {
  Teachers as default
};
