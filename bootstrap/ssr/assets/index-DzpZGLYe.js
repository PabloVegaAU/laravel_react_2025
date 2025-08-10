import { jsxs, jsx } from "react/jsx-runtime";
import { D as DataTable } from "./data-table-769qkqBW.js";
import { F as FlashMessages } from "./flash-messages-Brq5Zd2U.js";
import { A as AppLayout } from "./app-layout-BsERFbVR.js";
import { Head } from "@inertiajs/react";
import { useState } from "react";
import { CreateStudentDialog } from "./form-create-Be9zxVsg.js";
import { EditStudentDialog } from "./form-edit-CT4yGkdV.js";
import "./table-CRcIHZD9.js";
import "./utils-qggO9Hcn.js";
import "clsx";
import "tailwind-merge";
import "@tanstack/react-table";
import "sonner";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "lucide-react";
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
import "./input-error-BCtMt8Ki.js";
import "./dialog-CITBOAxv.js";
import "./input-B1uJ3yMO.js";
import "./label-CC7KirIj.js";
import "@radix-ui/react-label";
import "./formats-CLP1uR7X.js";
const breadcrumbs = [
  {
    title: "Estudiantes",
    href: "admin/students"
  }
];
function Students({ users }) {
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
        return /* @__PURE__ */ jsx("div", { className: "flex gap-2", id: userId.toString(), children: /* @__PURE__ */ jsx(EditStudentDialog, { userId }) });
      }
    }
  ];
  return /* @__PURE__ */ jsxs(AppLayout, { breadcrumbs, children: [
    /* @__PURE__ */ jsx(Head, { title: "Docentes" }),
    /* @__PURE__ */ jsx(FlashMessages, {}),
    /* @__PURE__ */ jsx(CreateStudentDialog, { isOpen: isCreateModalOpen, onOpenChange: setIsCreateModalOpen }),
    /* @__PURE__ */ jsx("div", { className: "flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4", children: /* @__PURE__ */ jsx(DataTable, { columns, data: users }) })
  ] });
}
export {
  Students as default
};
