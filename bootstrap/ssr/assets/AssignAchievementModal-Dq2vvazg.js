import { jsx, jsxs } from "react/jsx-runtime";
import { B as Button } from "./button-B8Z_lz_J.js";
import { C as Checkbox } from "./checkbox-kbYJu5q1.js";
import { D as Dialog, b as DialogContent, c as DialogHeader, d as DialogTitle } from "./dialog-sRXsDe1Q.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-BeW_tWiO.js";
import axios from "axios";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./utils-CpIjqAVa.js";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-checkbox";
import "lucide-react";
import "@radix-ui/react-dialog";
function AssignAchievementModal({ isOpen, onClose, achievementId, teacherId }) {
  const [students, setStudents] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  useEffect(() => {
    if (isOpen) {
      fetchStudents();
      setSelectedIds([]);
    }
  }, [isOpen]);
  const fetchStudents = async () => {
    if (!achievementId) return;
    try {
      const res = await axios.post("/api/getstudentbyachievementteacher", { p_achievement_id: achievementId, p_teacher_id: teacherId });
      setStudents(res.data);
    } catch (err) {
      console.error("❌ Error al obtener estudiantes:", err);
      toast.error("Error al cargar los estudiantes");
    }
  };
  const toggleSelection = (id) => {
    setSelectedIds((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
  };
  const handleAssign = async () => {
    var _a, _b;
    try {
      const res = await axios.post("/api/achievementassigntwo", {
        p_achievement_id: achievementId,
        p_student_ids: selectedIds
      });
      const result = ((_b = (_a = res.data) == null ? void 0 : _a.data) == null ? void 0 : _b[0]) || {};
      const mensaje = result.mensa || "Logro(s) asignado(s)";
      alert(`✅ ${mensaje}`);
      onClose();
    } catch (err) {
      console.error("❌ Error al asignar logro:", err);
      alert("❌ Error al asignar logro");
    }
  };
  return /* @__PURE__ */ jsx(Dialog, { open: isOpen, onOpenChange: onClose, children: /* @__PURE__ */ jsxs(DialogContent, { className: "max-w-3xl", children: [
    /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { children: "Asignar logro a estudiantes" }) }),
    /* @__PURE__ */ jsx("div", { className: "rounded-lg border bg-white", children: /* @__PURE__ */ jsxs(Table, { children: [
      /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
        /* @__PURE__ */ jsx(TableHead, {}),
        /* @__PURE__ */ jsx(TableHead, { children: "Puntos" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Nombre" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Apellido" })
      ] }) }),
      /* @__PURE__ */ jsx(TableBody, { children: students.map((s) => /* @__PURE__ */ jsxs(TableRow, { children: [
        /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Checkbox, { checked: selectedIds.includes(s.user_id), onCheckedChange: () => toggleSelection(s.user_id) }) }),
        /* @__PURE__ */ jsx(TableCell, { className: "font-medium", children: s.first_name }),
        /* @__PURE__ */ jsxs(TableCell, { className: "font-medium", children: [
          s.last_name,
          " ",
          s.second_last_name
        ] }),
        /* @__PURE__ */ jsx(TableCell, { children: s.points_store })
      ] }, s.user_id)) })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "mt-4 text-right", children: /* @__PURE__ */ jsxs(Button, { onClick: handleAssign, disabled: selectedIds.length === 0, children: [
      "Asignar a ",
      selectedIds.length,
      " estudiante(s)"
    ] }) })
  ] }) });
}
export {
  AssignAchievementModal
};
