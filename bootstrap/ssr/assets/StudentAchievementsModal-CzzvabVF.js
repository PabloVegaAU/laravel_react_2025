import { jsx, jsxs } from "react/jsx-runtime";
import { D as Dialog, b as DialogContent, c as DialogHeader, d as DialogTitle } from "./dialog-sRXsDe1Q.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-BeW_tWiO.js";
import axios from "axios";
import { useState, useEffect } from "react";
import "@radix-ui/react-dialog";
import "lucide-react";
import "./utils-CpIjqAVa.js";
import "clsx";
import "tailwind-merge";
function StudentAchievementsModal({ isOpen, onClose, studentId }) {
  const [achievements, setAchievements] = useState([]);
  useEffect(() => {
    if (isOpen && studentId !== null) {
      fetchAchievements(studentId);
    }
  }, [isOpen, studentId]);
  const fetchAchievements = async (id) => {
    try {
      const response = await axios.post(
        "/api/studentachievementslist",
        { p_student_id: id },
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
      if (response.data.success) {
        setAchievements(response.data.data);
      } else {
        console.warn("⚠️ Respuesta sin éxito:", response.data);
      }
    } catch (error) {
      console.error("❌ Error al cargar logros del estudiante:", error);
    }
  };
  return /* @__PURE__ */ jsx(Dialog, { open: isOpen, onOpenChange: onClose, children: /* @__PURE__ */ jsxs(DialogContent, { className: "w-full max-w-3xl", children: [
    /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { children: "Logros del Estudiante" }) }),
    /* @__PURE__ */ jsx("div", { className: "max-h-[70vh] overflow-x-auto rounded-lg border bg-white", children: /* @__PURE__ */ jsxs(Table, { className: "min-w-full text-sm", children: [
      /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
        /* @__PURE__ */ jsx(TableHead, { className: "w-[50px]", children: "ID" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Nombre" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Descripción" }),
        /* @__PURE__ */ jsx(TableHead, { className: "whitespace-nowrap", children: "Asignado" })
      ] }) }),
      /* @__PURE__ */ jsx(TableBody, { children: achievements.length > 0 ? achievements.map((a) => /* @__PURE__ */ jsxs(TableRow, { children: [
        /* @__PURE__ */ jsx(TableCell, { children: a.id }),
        /* @__PURE__ */ jsx(TableCell, { className: "font-medium", children: a.name }),
        /* @__PURE__ */ jsx(TableCell, { children: a.description }),
        /* @__PURE__ */ jsx(TableCell, { className: "whitespace-nowrap", children: new Date(a.assigned_at).toLocaleString() })
      ] }, a.id)) : /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, { colSpan: 4, className: "py-4 text-center text-gray-500", children: "No hay logros asignados" }) }) })
    ] }) })
  ] }) });
}
export {
  StudentAchievementsModal
};
