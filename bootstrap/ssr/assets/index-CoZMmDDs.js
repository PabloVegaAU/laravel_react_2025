import { jsxs, jsx } from "react/jsx-runtime";
import { B as Button } from "./button-B8Z_lz_J.js";
import { I as Input } from "./input-Dr5dPtfm.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-BeW_tWiO.js";
import { A as AppLayout } from "./app-layout-Dq465f56.js";
import { usePage, Head } from "@inertiajs/react";
import axios from "axios";
import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import { AssignAchievementModal } from "./AssignAchievementModal-Dq2vvazg.js";
import { StudentSearchModal } from "./student-search-modal-B3gMtOa9.js";
import { StudentAchievementsModal } from "./StudentAchievementsModal-CzzvabVF.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./utils-CpIjqAVa.js";
import "clsx";
import "tailwind-merge";
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
import "./checkbox-kbYJu5q1.js";
import "@radix-ui/react-checkbox";
import "./dialog-sRXsDe1Q.js";
import "sonner";
const breadcrumbs = [
  {
    title: "Inicio",
    href: "/teacher/dashboard"
  },
  {
    title: "Logros",
    href: "/teacher/achievements"
  }
];
function AchievementsListPage() {
  const { auth } = usePage().props;
  const [achievements, setAchievements] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isAchievementsModalOpen, setIsAchievementsModalOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  useEffect(() => {
    fetchAchievements();
  }, []);
  const fetchAchievements = async () => {
    try {
      const response = await axios.post("/api/achievementslist");
      if (Array.isArray(response.data)) {
        setAchievements(response.data);
      } else {
        console.error("Respuesta inesperada:", response.data);
      }
    } catch (error) {
      console.error("❌ Error al cargar logros:", error);
    }
  };
  const filtered = achievements.filter(
    (a) => a.name.toLowerCase().includes(searchTerm.toLowerCase()) || a.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return /* @__PURE__ */ jsxs(AppLayout, { breadcrumbs, children: [
    /* @__PURE__ */ jsx(Head, { title: "Listado de Logros" }),
    /* @__PURE__ */ jsxs("div", { className: "container mx-auto p-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-gray-800", children: "Listado de Logros" }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "relative w-64", children: [
            /* @__PURE__ */ jsx(Search, { className: "absolute top-2.5 left-2.5 h-4 w-4 text-gray-500" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                type: "search",
                placeholder: "Buscar logro...",
                className: "pl-8",
                value: searchTerm,
                onChange: (e) => setSearchTerm(e.target.value)
              }
            )
          ] }),
          /* @__PURE__ */ jsx(Button, { onClick: () => setIsSearchModalOpen(true), children: "Buscar estudiante" })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "rounded-lg border bg-white", children: /* @__PURE__ */ jsxs(Table, { children: [
        /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableHead, { children: "ID" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Nombre" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Descripción" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Activo" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Acciones" })
        ] }) }),
        /* @__PURE__ */ jsx(TableBody, { children: filtered.map((achievement) => /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableCell, { children: achievement.id }),
          /* @__PURE__ */ jsx(TableCell, { className: "font-medium", children: achievement.name }),
          /* @__PURE__ */ jsx(TableCell, { children: achievement.description }),
          /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(
            "span",
            {
              className: `inline-block rounded-full px-3 py-1 text-sm font-semibold ${achievement.activo ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"}`,
              children: achievement.activo ? "Activo" : "Inactivo"
            }
          ) }),
          /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(
            Button,
            {
              onClick: () => {
                setSelectedAchievement(achievement.id);
                setAssignModalOpen(true);
              },
              children: "Asignar"
            }
          ) })
        ] }, achievement.id)) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx(
      StudentSearchModal,
      {
        teacherId: auth.user.id,
        isOpen: isSearchModalOpen,
        onClose: () => setIsSearchModalOpen(false),
        onSelect: (student) => {
          setSelectedStudentId(student.student_id);
          setIsSearchModalOpen(false);
          setIsAchievementsModalOpen(true);
        }
      }
    ),
    /* @__PURE__ */ jsx(StudentAchievementsModal, { isOpen: isAchievementsModalOpen, onClose: () => setIsAchievementsModalOpen(false), studentId: selectedStudentId }),
    /* @__PURE__ */ jsx(
      AssignAchievementModal,
      {
        isOpen: assignModalOpen,
        onClose: () => setAssignModalOpen(false),
        achievementId: selectedAchievement,
        teacherId: auth.user.id
      }
    )
  ] });
}
export {
  AchievementsListPage as default
};
