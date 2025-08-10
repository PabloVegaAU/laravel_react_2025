import { jsxs, jsx } from "react/jsx-runtime";
import { D as DataTable } from "./data-table-769qkqBW.js";
import { F as FlashMessages } from "./flash-messages-Brq5Zd2U.js";
import { B as Button } from "./button-BqjjxT-O.js";
import { I as Input } from "./input-B1uJ3yMO.js";
import { L as Label } from "./label-CC7KirIj.js";
import { A as AppLayout } from "./app-layout-BsERFbVR.js";
import { u as useTranslations } from "./translator-csgEc0di.js";
import { Head, router } from "@inertiajs/react";
import { useState } from "react";
import { CreateQuestionDialog } from "./form-create-B5a7U_Xt.js";
import { EditQuestionDialog } from "./form-edit-BW4TdIdH.js";
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
import "./input-error-BCtMt8Ki.js";
import "./checkbox-B_r2H9BE.js";
import "@radix-ui/react-checkbox";
import "./dialog-CITBOAxv.js";
import "./select-qcG6mW7O.js";
import "@radix-ui/react-select";
import "./textarea-DQiokWve.js";
import "./MatchingOptions-D4dRcsQ7.js";
import "./OrderingOptions-CzBeIvT6.js";
import "./SingleChoiceOptions-D8MJii43.js";
import "./BaseQuestionType-vuBW0I6d.js";
import "./TrueFalseOptions-CY2DJnPC.js";
import "@radix-ui/react-radio-group";
const breadcrumbs = [
  {
    title: "Preguntas",
    href: "teacher/question"
  }
];
function Questions({ questions, filters, question_types, capabilities, difficulties, curricular_areas, competencies }) {
  const { t } = useTranslations();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);
  const handleSearch = () => {
    router.get(route("teacher.questions.index"), localFilters, {
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
      header: "Título",
      accessorKey: "name"
    },
    {
      header: "Tipo",
      accessorKey: "question_type.name"
    },
    {
      header: "Dificultad",
      accessorKey: "difficulty",
      cell: (row) => t(row.getValue())
    },
    {
      header: "Acciones",
      accessorKey: "id",
      cell: (row) => {
        const [isEditModalOpen, setIsEditModalOpen] = useState(false);
        return /* @__PURE__ */ jsx("div", { className: "flex space-x-2", id: row.getValue(), children: /* @__PURE__ */ jsx(
          EditQuestionDialog,
          {
            isOpen: isEditModalOpen,
            id: row.getValue(),
            curricularAreas: curricular_areas,
            competencies,
            capabilities,
            difficulties,
            questionTypes: question_types,
            onOpenChange: setIsEditModalOpen,
            onSuccess: () => setIsEditModalOpen(false)
          }
        ) });
      }
    }
  ];
  return /* @__PURE__ */ jsxs(AppLayout, { breadcrumbs, children: [
    /* @__PURE__ */ jsx(Head, { title: "Preguntas" }),
    /* @__PURE__ */ jsx(FlashMessages, {}),
    /* @__PURE__ */ jsxs("div", { className: "flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-4", children: [
        /* @__PURE__ */ jsx(
          CreateQuestionDialog,
          {
            isOpen: isCreateModalOpen,
            onOpenChange: setIsCreateModalOpen,
            curricularAreas: curricular_areas,
            competencies,
            capabilities,
            difficulties,
            questionTypes: question_types,
            onSuccess: () => setIsCreateModalOpen(false)
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(Label, { children: "Título" }),
            /* @__PURE__ */ jsx(Input, { value: localFilters.search, onChange: (e) => setLocalFilters((prev) => ({ ...prev, search: e.target.value })) })
          ] }),
          /* @__PURE__ */ jsx(Button, { onClick: handleSearch, children: "Buscar" })
        ] })
      ] }),
      /* @__PURE__ */ jsx(DataTable, { columns, data: questions })
    ] })
  ] });
}
export {
  Questions as default
};
