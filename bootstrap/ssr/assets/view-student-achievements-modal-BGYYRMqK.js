import { jsx, jsxs } from "react/jsx-runtime";
import { B as Badge } from "./badge-65mno7eO.js";
import { B as Button } from "./button-B8Z_lz_J.js";
import { D as Dialog, b as DialogContent, c as DialogHeader, d as DialogTitle, e as DialogDescription } from "./dialog-sRXsDe1Q.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-BeW_tWiO.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./utils-CpIjqAVa.js";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-dialog";
import "lucide-react";
function ViewStudentAchievementsModal({ isOpen, onClose, student }) {
  const achievements = [
    { id: 1, name: "Excelente Participación", points: 10, date: "2023-10-15", assignedBy: "Prof. García", comment: "Muy buen trabajo en clase" },
    { id: 2, name: "Trabajo en Equipo", points: 15, date: "2023-10-10", assignedBy: "Prof. García" },
    { id: 3, name: "Creatividad", points: 20, date: "2023-10-05", assignedBy: "Prof. Rodríguez" }
  ];
  if (!student) return null;
  const totalPoints = achievements.reduce((sum, achievement) => sum + achievement.points, 0);
  return /* @__PURE__ */ jsx(Dialog, { open: isOpen, onOpenChange: onClose, children: /* @__PURE__ */ jsxs(DialogContent, { className: "max-w-3xl", children: [
    /* @__PURE__ */ jsxs(DialogHeader, { children: [
      /* @__PURE__ */ jsxs(DialogTitle, { children: [
        "Logros de ",
        student.name
      ] }),
      /* @__PURE__ */ jsxs(DialogDescription, { children: [
        student.grade,
        "° ",
        student.section,
        " - Total de puntos:",
        " ",
        /* @__PURE__ */ jsxs(Badge, { variant: "outline", className: "ml-1", children: [
          totalPoints,
          " pts"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "rounded-md border", children: /* @__PURE__ */ jsxs(Table, { children: [
      /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
        /* @__PURE__ */ jsx(TableHead, { children: "Logro" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Puntos" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Fecha" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Asignado por" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Comentario" })
      ] }) }),
      /* @__PURE__ */ jsx(TableBody, { children: achievements.length > 0 ? achievements.map((achievement) => /* @__PURE__ */ jsxs(TableRow, { children: [
        /* @__PURE__ */ jsx(TableCell, { className: "font-medium", children: achievement.name }),
        /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs(Badge, { variant: "outline", children: [
          achievement.points,
          " pts"
        ] }) }),
        /* @__PURE__ */ jsx(TableCell, { children: new Date(achievement.date).toLocaleDateString() }),
        /* @__PURE__ */ jsx(TableCell, { children: achievement.assignedBy }),
        /* @__PURE__ */ jsx(TableCell, { className: "text-gray-500", children: achievement.comment || "-" })
      ] }, achievement.id)) : /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, { colSpan: 5, className: "py-4 text-center text-gray-500", children: "El estudiante no tiene logros registrados." }) }) })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "mt-4 flex justify-end", children: /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: onClose, children: "Cerrar" }) })
  ] }) });
}
export {
  ViewStudentAchievementsModal
};
