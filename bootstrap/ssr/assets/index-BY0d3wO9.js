import { jsxs, jsx } from "react/jsx-runtime";
import { B as Button } from "./button-BqjjxT-O.js";
import { I as Input } from "./input-B1uJ3yMO.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-CRcIHZD9.js";
import { A as AppLayout } from "./app-layout-BsERFbVR.js";
import { Head } from "@inertiajs/react";
import { Search, Plus, Edit } from "lucide-react";
import { useState, useEffect } from "react";
import { CreateBackgroundModal } from "./create-background-modal-C5us7_YP.js";
import { EditBackgroundModal } from "./edit-background-modal-D-j9uieQ.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./utils-qggO9Hcn.js";
import "clsx";
import "tailwind-merge";
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
import "./dialog-CITBOAxv.js";
import "./label-CC7KirIj.js";
import "@radix-ui/react-label";
import "sonner";
function BackgroundsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedBackground, setSelectedBackground] = useState(null);
  const [backgrounds, setBackgrounds] = useState([]);
  useEffect(() => {
    const fetchBackgrounds = async () => {
      var _a;
      try {
        const response = await fetch("/api/backgroundslist", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Requested-With": "XMLHttpRequest",
            "X-CSRF-TOKEN": ((_a = document.querySelector('meta[name="csrf-token"]')) == null ? void 0 : _a.getAttribute("content")) || ""
          }
        });
        const data = await response.json();
        if (data.success) {
          setBackgrounds(data.data);
        } else {
          console.error("Error en datos:", data.message);
        }
      } catch (error) {
        console.error("Error al obtener fondos:", error);
      }
    };
    fetchBackgrounds();
  }, []);
  const filteredBackgrounds = backgrounds.filter(
    (background) => {
      var _a;
      return background.name.toLowerCase().includes(searchTerm.toLowerCase()) || ((_a = background.level_required_name) == null ? void 0 : _a.toLowerCase().includes(searchTerm.toLowerCase()));
    }
  );
  return /* @__PURE__ */ jsxs(AppLayout, { children: [
    /* @__PURE__ */ jsxs("div", { className: "container mx-auto p-6", children: [
      /* @__PURE__ */ jsx(Head, { title: "Gestión de Fondos" }),
      /* @__PURE__ */ jsxs("div", { className: "mb-6 flex items-center justify-between", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-gray-900 dark:text-gray-100", children: "Gestión de Fondos" }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "relative w-64", children: [
            /* @__PURE__ */ jsx(Search, { className: "absolute top-2.5 left-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                type: "search",
                placeholder: "Buscar fondo...",
                className: "pl-8",
                value: searchTerm,
                onChange: (e) => setSearchTerm(e.target.value)
              }
            )
          ] }),
          /* @__PURE__ */ jsxs(Button, { onClick: () => setIsCreateModalOpen(true), children: [
            /* @__PURE__ */ jsx(Plus, { className: "mr-2 h-4 w-4" }),
            "Crear Fondo"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "dark:border-sidebar-border dark:bg-sidebar rounded-lg border border-gray-200 bg-white", children: /* @__PURE__ */ jsxs(Table, { children: [
        /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableHead, { children: "N°" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Nombre" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Estado" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Nivel Requerido" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Costo" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Acción" })
        ] }) }),
        /* @__PURE__ */ jsx(TableBody, { children: filteredBackgrounds.map((background, index) => /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableCell, { className: "dark:text-sidebar-foreground/70 text-gray-700", children: index + 1 }),
          /* @__PURE__ */ jsx(TableCell, { className: "font-medium", children: background.name }),
          /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx("span", { className: "rounded-full bg-green-100 px-2 py-1 text-xs text-green-800 dark:bg-green-900/30 dark:text-green-400", children: "Activo" }) }),
          /* @__PURE__ */ jsxs(TableCell, { className: "dark:text-sidebar-foreground/70 text-gray-700", children: [
            "Nivel ",
            background.level_required
          ] }),
          /* @__PURE__ */ jsxs(TableCell, { className: "dark:text-sidebar-foreground/70 text-gray-700", children: [
            background.points_store,
            " pts"
          ] }),
          /* @__PURE__ */ jsx(TableCell, { className: "flex justify-center space-x-2", children: /* @__PURE__ */ jsx(
            Button,
            {
              variant: "ghost",
              size: "icon",
              onClick: () => {
                setSelectedBackground(background);
                setIsEditModalOpen(true);
              },
              children: /* @__PURE__ */ jsx(Edit, { className: "h-4 w-4" })
            }
          ) })
        ] }, background.id)) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx(
      CreateBackgroundModal,
      {
        isOpen: isCreateModalOpen,
        onClose: () => setIsCreateModalOpen(false),
        onSuccess: (newBackground) => {
          setBackgrounds((prev) => [...prev, newBackground]);
          setIsCreateModalOpen(false);
        }
      }
    ),
    selectedBackground && /* @__PURE__ */ jsx(
      EditBackgroundModal,
      {
        isOpen: isEditModalOpen,
        onClose: () => {
          setIsEditModalOpen(false);
          setSelectedBackground(null);
        },
        background: {
          ...selectedBackground,
          level_name: `Nivel ${selectedBackground.level_required}`,
          // Add level_name
          level_required: {
            id: selectedBackground.level_required,
            level: selectedBackground.level_required,
            name: `Nivel ${selectedBackground.level_required}`
          }
        },
        onSuccess: (updatedBackground) => {
          setBackgrounds(
            (prev) => prev.map(
              (bg) => bg.id === updatedBackground.id ? {
                ...updatedBackground,
                level_required: (() => {
                  const level = updatedBackground.level_required;
                  return typeof level === "object" && level !== null ? level.level : level;
                })(),
                points_store: Number(updatedBackground.points_store)
              } : bg
            )
          );
          setIsEditModalOpen(false);
          setSelectedBackground(null);
        }
      }
    )
  ] });
}
export {
  BackgroundsPage as default
};
