import { jsxs, jsx } from "react/jsx-runtime";
import { D as DataTable } from "./data-table-BozUKPPq.js";
import { F as FlashMessages } from "./flash-messages-Brq5Zd2U.js";
import { B as Button } from "./button-B8Z_lz_J.js";
import { I as Input } from "./input-Dr5dPtfm.js";
import { L as Label } from "./label-GjpnCFkz.js";
import { S as Select, a as SelectTrigger, b as SelectValue, d as SelectContent, e as SelectGroup, c as SelectItem } from "./select-DMPk8oWi.js";
import { A as AppLayout } from "./app-layout-Dq465f56.js";
import { u as useTranslations } from "./translator-csgEc0di.js";
import { Head, router } from "@inertiajs/react";
import { useState } from "react";
import { CreateQuestionDialog } from "./form-create-B9M6hDUQ.js";
import { EditQuestionDialog } from "./form-edit-BOIfSpbP.js";
import "./table-BeW_tWiO.js";
import "./utils-CpIjqAVa.js";
import "clsx";
import "tailwind-merge";
import "@tanstack/react-table";
import "sonner";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "@radix-ui/react-label";
import "@radix-ui/react-select";
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
import "./checkbox-kbYJu5q1.js";
import "@radix-ui/react-checkbox";
import "./dialog-sRXsDe1Q.js";
import "./textarea-ClDEq31t.js";
import "./MatchingOptions-C_4Caq9y.js";
import "./OrderingOptions-C8C0teog.js";
import "./SingleChoiceOptions-DepWZepg.js";
import "./BaseQuestionType-Bq4-9YcG.js";
import "./TrueFalseOptions-D-RYM-j6.js";
import "@radix-ui/react-radio-group";
const breadcrumbs = [
  {
    title: "Inicio",
    href: "/teacher/dashboard"
  },
  {
    title: "Preguntas",
    href: "teacher/question"
  }
];
function Questions({ questions, filters, question_types, capabilities, difficulties, curricular_areas, competencies }) {
  const { t } = useTranslations();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const defaultFilters = {
    search: "",
    question_type: "0",
    curricular_area: "0",
    competency: "0",
    capability: "0"
  };
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
      header: "Área curricular",
      accessorKey: "capability.competency.curricular_area_cycle.curricular_area.name"
    },
    {
      header: "Competencia",
      accessorKey: "capability.competency.name"
    },
    {
      header: "Capacidad",
      accessorKey: "capability.name"
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
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-4", children: [
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
        /* @__PURE__ */ jsxs("div", { className: "min-w-[200px] flex-1", children: [
          /* @__PURE__ */ jsx(Label, { children: "Título" }),
          /* @__PURE__ */ jsx(Input, { value: localFilters.search, onChange: (e) => setLocalFilters((prev) => ({ ...prev, search: e.target.value })) })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(Label, { children: "Tipo de pregunta" }),
          /* @__PURE__ */ jsxs(Select, { value: localFilters.question_type, onValueChange: (v) => setLocalFilters((prev) => ({ ...prev, question_type: v })), children: [
            /* @__PURE__ */ jsx(SelectTrigger, { className: "min-w-[200px] flex-1", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Tipo de pregunta" }) }),
            /* @__PURE__ */ jsx(SelectContent, { children: /* @__PURE__ */ jsx(SelectGroup, { children: [{ id: 0, name: "Todas" }, ...question_types].map((q) => /* @__PURE__ */ jsx(SelectItem, { value: q.id.toString(), children: q.name }, q.id)) }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(Label, { children: "Área curricular" }),
          /* @__PURE__ */ jsxs(Select, { value: localFilters.curricular_area, onValueChange: (v) => setLocalFilters((prev) => ({ ...prev, curricular_area: v })), children: [
            /* @__PURE__ */ jsx(SelectTrigger, { className: "min-w-[200px] flex-1", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Área curricular" }) }),
            /* @__PURE__ */ jsx(SelectContent, { children: /* @__PURE__ */ jsx(SelectGroup, { children: [{ id: 0, name: "Todas" }, ...curricular_areas].map((a) => /* @__PURE__ */ jsx(SelectItem, { value: a.id.toString(), children: a.name }, a.id)) }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(Label, { children: "Competencia" }),
          /* @__PURE__ */ jsxs(Select, { value: localFilters.competency, onValueChange: (v) => setLocalFilters((prev) => ({ ...prev, competency: v })), children: [
            /* @__PURE__ */ jsx(SelectTrigger, { className: "min-w-[200px] flex-1", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Competencia" }) }),
            /* @__PURE__ */ jsx(SelectContent, { children: /* @__PURE__ */ jsx(SelectGroup, { children: [{ id: 0, name: "Todas" }, ...competencies].map((c) => /* @__PURE__ */ jsx(SelectItem, { value: c.id.toString(), children: c.name }, c.id)) }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(Label, { children: "Capacidad" }),
          /* @__PURE__ */ jsxs(Select, { value: localFilters.capability, onValueChange: (v) => setLocalFilters((prev) => ({ ...prev, capability: v })), children: [
            /* @__PURE__ */ jsx(SelectTrigger, { className: "min-w-[200px] flex-1", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Capacidad" }) }),
            /* @__PURE__ */ jsx(SelectContent, { children: /* @__PURE__ */ jsx(SelectGroup, { children: [{ id: 0, name: "Todas" }, ...capabilities].map((c) => /* @__PURE__ */ jsx(SelectItem, { value: c.id.toString(), children: c.name }, c.id)) }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-end gap-2", children: [
          /* @__PURE__ */ jsx(Button, { onClick: handleSearch, children: "Buscar" }),
          /* @__PURE__ */ jsx(Button, { variant: "destructive", onClick: () => setLocalFilters(defaultFilters), children: "Limpiar" })
        ] })
      ] }),
      /* @__PURE__ */ jsx(DataTable, { columns, data: questions })
    ] })
  ] });
}
export {
  Questions as default
};
