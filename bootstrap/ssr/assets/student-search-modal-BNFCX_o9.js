import { jsx, jsxs } from "react/jsx-runtime";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle } from "./dialog-CITBOAxv.js";
import { I as Input } from "./input-B1uJ3yMO.js";
import axios from "axios";
import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import "@radix-ui/react-dialog";
import "./utils-qggO9Hcn.js";
import "clsx";
import "tailwind-merge";
function StudentSearchModal({ isOpen, onClose, onSelect }) {
  const [query, setQuery] = useState("");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (query.length >= 3) {
      searchStudents(query);
    } else {
      setStudents([]);
    }
  }, [query]);
  const searchStudents = async (search) => {
    try {
      setLoading(true);
      const response = await axios.post("/api/studentssearch", {
        p_search: search
      });
      if (response.data.success) {
        setStudents(response.data.data);
      } else {
        setStudents([]);
      }
    } catch (error) {
      console.error("❌ Error al buscar estudiantes:", error);
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsx(Dialog, { open: isOpen, onOpenChange: onClose, children: /* @__PURE__ */ jsxs(DialogContent, { className: "max-w-md", children: [
    /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { children: "Logros de estudiantes" }) }),
    /* @__PURE__ */ jsxs("div", { className: "relative mb-4", children: [
      /* @__PURE__ */ jsx(Search, { className: "absolute top-2.5 left-2.5 h-4 w-4 text-gray-500" }),
      /* @__PURE__ */ jsx(Input, { type: "text", placeholder: "Buscar por nombre o correo...", className: "pl-8", value: query, onChange: (e) => setQuery(e.target.value) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "h-64 overflow-auto pr-2", children: students.length > 0 ? /* @__PURE__ */ jsx("ul", { className: "space-y-3", children: students.map((student) => /* @__PURE__ */ jsxs(
      "li",
      {
        className: "cursor-pointer rounded-md px-3 py-2 hover:bg-gray-100",
        onClick: () => {
          onSelect(student);
          onClose();
        },
        children: [
          /* @__PURE__ */ jsx("div", { className: "font-semibold text-gray-900", children: student.nombres }),
          /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-500", children: student.correo })
        ]
      },
      student.student_id
    )) }) : /* @__PURE__ */ jsx("div", { className: "px-2 text-sm text-gray-500", children: loading ? "Buscando..." : query.length >= 3 ? "No se encontraron estudiantes" : "Ingresa al menos 3 letras" }) })
  ] }) });
}
export {
  StudentSearchModal
};
