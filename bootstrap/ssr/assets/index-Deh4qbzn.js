import { jsxs, jsx } from "react/jsx-runtime";
import { B as Button } from "./button-B8Z_lz_J.js";
import { I as Input } from "./input-Dr5dPtfm.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-BeW_tWiO.js";
import { A as AppLayout } from "./app-layout-Dq465f56.js";
import { Head } from "@inertiajs/react";
import { Search, Plus, Edit } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { CreatePrizeModal } from "./create-prize-modal-Bdlfj3sX.js";
import { EditPrizeModal } from "./edit-prize-modal-DFin332i.js";
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
import "./dialog-sRXsDe1Q.js";
import "./label-GjpnCFkz.js";
import "@radix-ui/react-label";
function TeacherPrizesPage() {
  const [prizes, setPrizes] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPrize, setSelectedPrize] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const fetchPrizes = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/admin/prizes?page=1", {
        headers: {
          Accept: "application/json",
          "X-Requested-With": "XMLHttpRequest",
          "Content-Type": "application/json"
        }
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.prizes && data.prizes.data) {
        setPrizes(data.prizes.data);
      } else if (Array.isArray(data)) {
        setPrizes(data);
      } else if (data.data) {
        setPrizes(data.data);
      } else {
        console.warn("Unexpected API response structure:", data);
        setPrizes([]);
      }
    } catch (error) {
      console.error("Error al cargar los premios:", error);
      toast.error("Error al cargar la lista de premios");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchPrizes();
  }, []);
  const filteredPrizes = prizes.filter(
    (prize) => prize.name.toLowerCase().includes(searchTerm.toLowerCase()) || prize.points_cost.toString().includes(searchTerm) || prize.stock.toString().includes(searchTerm)
  );
  return /* @__PURE__ */ jsxs(AppLayout, { children: [
    /* @__PURE__ */ jsxs("div", { className: "container mx-auto p-6", children: [
      /* @__PURE__ */ jsx(Head, { title: "Gestión de Premios" }),
      /* @__PURE__ */ jsxs("div", { className: "mb-6 flex items-center justify-between", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-gray-900 dark:text-gray-100", children: "Gestión de Premios" }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "relative w-64", children: [
            /* @__PURE__ */ jsx(Search, { className: "absolute top-2.5 left-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                type: "search",
                placeholder: "Buscar premio...",
                className: "pl-8",
                value: searchTerm,
                onChange: (e) => setSearchTerm(e.target.value)
              }
            )
          ] }),
          /* @__PURE__ */ jsxs(Button, { onClick: () => setIsCreateModalOpen(true), children: [
            /* @__PURE__ */ jsx(Plus, { className: "mr-2 h-4 w-4" }),
            "Crear Premio"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "dark:border-sidebar-border dark:bg-sidebar rounded-lg border border-gray-200 bg-white", children: /* @__PURE__ */ jsxs(Table, { children: [
        /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableHead, { children: "Imagen" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Nombre" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Puntos" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Stock" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Estado" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Acciones" })
        ] }) }),
        /* @__PURE__ */ jsx(TableBody, { children: isLoading ? /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, { colSpan: 6, className: "dark:text-sidebar-foreground/60 py-4 text-center text-gray-600", children: "Cargando premios..." }) }) : filteredPrizes.length === 0 ? /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, { colSpan: 6, className: "dark:text-sidebar-foreground/60 py-4 text-center text-gray-600", children: "No se encontraron premios" }) }) : filteredPrizes.map((prize) => /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableCell, { children: prize.image ? /* @__PURE__ */ jsx(
            "img",
            {
              src: prize.image.startsWith("http") ? prize.image : `${prize.image}`,
              alt: prize.name,
              className: "h-10 w-10 rounded-full object-cover"
            }
          ) : /* @__PURE__ */ jsx("div", { className: "dark:bg-sidebar-border flex h-10 w-10 items-center justify-center rounded-full bg-gray-200", children: /* @__PURE__ */ jsx("span", { className: "dark:text-sidebar-foreground/60 text-xs text-gray-500", children: "Sin imagen" }) }) }),
          /* @__PURE__ */ jsx(TableCell, { className: "font-medium", children: prize.name }),
          /* @__PURE__ */ jsxs(TableCell, { className: "dark:text-sidebar-foreground/70 text-gray-700", children: [
            prize.points_cost,
            " pts"
          ] }),
          /* @__PURE__ */ jsxs(TableCell, { className: "dark:text-sidebar-foreground/70 text-gray-700", children: [
            prize.stock,
            " unidades"
          ] }),
          /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(
            "span",
            {
              className: `inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${prize.is_active ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"}`,
              children: prize.is_active ? "Activo" : "Inactivo"
            }
          ) }),
          /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx("div", { className: "flex space-x-2", children: /* @__PURE__ */ jsx(
            Button,
            {
              variant: "ghost",
              size: "icon",
              onClick: () => {
                setSelectedPrize(prize);
                setIsEditModalOpen(true);
              },
              title: "Editar premio",
              children: /* @__PURE__ */ jsx(Edit, { className: "h-4 w-4" })
            }
          ) }) })
        ] }, prize.id)) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx(
      CreatePrizeModal,
      {
        isOpen: isCreateModalOpen,
        onClose: () => setIsCreateModalOpen(false),
        onSuccess: async () => {
          await fetchPrizes();
          setIsCreateModalOpen(false);
        }
      }
    ),
    selectedPrize && /* @__PURE__ */ jsx(
      EditPrizeModal,
      {
        isOpen: isEditModalOpen,
        onClose: () => {
          setIsEditModalOpen(false);
          setSelectedPrize(null);
        },
        prize: selectedPrize,
        onSuccess: async () => {
          await fetchPrizes();
          setIsEditModalOpen(false);
          setSelectedPrize(null);
        }
      }
    )
  ] });
}
export {
  TeacherPrizesPage as default
};
