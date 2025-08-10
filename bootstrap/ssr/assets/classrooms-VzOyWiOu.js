import { jsxs, jsx } from "react/jsx-runtime";
import { B as Button } from "./button-B8Z_lz_J.js";
import { D as Dialog, a as DialogTrigger, b as DialogContent, d as DialogTitle } from "./dialog-sRXsDe1Q.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-BeW_tWiO.js";
import { u as useTranslations } from "./translator-csgEc0di.js";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./utils-CpIjqAVa.js";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-dialog";
import "@inertiajs/react";
function ClassroomsDialog({ enrollmentId }) {
  const { t } = useTranslations();
  const [isOpen, setIsOpen] = useState(false);
  const { data: classrooms, isLoading } = useQuery({
    queryKey: ["classrooms", enrollmentId],
    queryFn: async () => (await fetch(`/admin/enrollments/classrooms/${enrollmentId}`)).json(),
    enabled: isOpen
  });
  return /* @__PURE__ */ jsxs(Dialog, { open: isOpen, onOpenChange: setIsOpen, children: [
    /* @__PURE__ */ jsx(DialogTrigger, { children: /* @__PURE__ */ jsx(Button, { variant: isOpen ? "info" : "outline-info", children: "Ver áreas curriculares" }) }),
    /* @__PURE__ */ jsxs(DialogContent, { className: "sm:max-w-[700px]", children: [
      /* @__PURE__ */ jsx(DialogTitle, { children: "Ver áreas curriculares" }),
      /* @__PURE__ */ jsx("div", { className: "flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4", children: isLoading ? /* @__PURE__ */ jsx(Loader2, { className: "h-8 w-8 animate-spin" }) : /* @__PURE__ */ jsxs(Table, { children: [
        /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableHead, { className: "h-12 font-medium", children: "Aula" }),
          /* @__PURE__ */ jsx(TableHead, { className: "h-12 font-medium", children: "Área curricular" }),
          /* @__PURE__ */ jsx(TableHead, { className: "h-12 font-medium", children: "Ciclo" })
        ] }) }),
        /* @__PURE__ */ jsx(TableBody, { children: (classrooms == null ? void 0 : classrooms.length) ? classrooms.map((item) => {
          var _a, _b, _c;
          return /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, { className: "font-medium", children: `${t((_a = item.classroom) == null ? void 0 : _a.grade)} ${(_b = item.classroom) == null ? void 0 : _b.section} ${t((_c = item.classroom) == null ? void 0 : _c.level)}` }) }, item.id);
        }) : /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, { colSpan: 3, className: "h-24 text-center", children: "No se encontraron áreas curriculares asignadas." }) }) })
      ] }) })
    ] })
  ] });
}
export {
  ClassroomsDialog
};
