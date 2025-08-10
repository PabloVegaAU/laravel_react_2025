import { jsx, jsxs } from "react/jsx-runtime";
import { D as Dialog, b as DialogContent, c as DialogHeader, d as DialogTitle } from "./dialog-sRXsDe1Q.js";
import { I as Input } from "./input-Dr5dPtfm.js";
import axios from "axios";
import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import "@radix-ui/react-dialog";
import "./utils-CpIjqAVa.js";
import "clsx";
import "tailwind-merge";
function StudentSearchModal({ isOpen, onClose, onSelect }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (searchTerm.length >= 3) {
      const delayDebounce = setTimeout(() => {
        fetchStudents(searchTerm);
      }, 400);
      return () => clearTimeout(delayDebounce);
    } else {
      setResults([]);
    }
  }, [searchTerm]);
  const fetchStudents = async (search) => {
    try {
      setLoading(true);
      const response = await axios.post("/api/studentssearch", { p_search: search });
      if (response.data.success) {
        setResults(response.data.data);
      }
    } catch (error) {
      console.error("❌ Error al buscar estudiantes:", error);
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsx(Dialog, { open: isOpen, onOpenChange: onClose, children: /* @__PURE__ */ jsxs(DialogContent, { className: "sm:max-w-md", children: [
    /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { children: "Logros de estudiantes" }) }),
    /* @__PURE__ */ jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsx(Search, { className: "absolute top-2.5 left-2.5 h-4 w-4 text-gray-500" }),
      /* @__PURE__ */ jsx(Input, { placeholder: "Buscar estudiante...", className: "pl-8", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-3 rounded-md border bg-black text-white shadow-md", children: [
      loading && /* @__PURE__ */ jsx("div", { className: "p-4 text-sm", children: "Buscando..." }),
      !loading && results.length > 0 && /* @__PURE__ */ jsx("div", { className: "divide-y divide-gray-700", children: results.map((student) => /* @__PURE__ */ jsxs(
        "div",
        {
          onClick: () => {
            onSelect(student);
            onClose();
          },
          className: "flex cursor-pointer items-center justify-between px-4 py-2 hover:bg-gray-800",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-3", children: [
              /* @__PURE__ */ jsx("span", { className: "inline-block h-6 w-6 rounded-full bg-white pt-0.5 text-center text-xs font-bold text-black", children: "👤" }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("div", { className: "font-semibold", children: student.name }),
                /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-300", children: student.email })
              ] })
            ] }),
            /* @__PURE__ */ jsx("button", { className: "rounded bg-green-700 px-2 py-1 text-xs font-semibold hover:bg-green-800", children: "Ver logros" })
          ]
        },
        student.id
      )) }),
      !loading && results.length === 0 && searchTerm.length >= 3 && /* @__PURE__ */ jsx("div", { className: "p-4 text-sm text-gray-400", children: "No se encontraron resultados." })
    ] })
  ] }) });
}
export {
  StudentSearchModal
};
