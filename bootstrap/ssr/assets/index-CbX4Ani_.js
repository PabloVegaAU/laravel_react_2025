import { jsxs, jsx } from "react/jsx-runtime";
import { B as Button } from "./button-BqjjxT-O.js";
import { I as Input } from "./input-B1uJ3yMO.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-CRcIHZD9.js";
import { A as AppLayout } from "./app-layout-BsERFbVR.js";
import { Head } from "@inertiajs/react";
import { Search, Plus, Edit } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { CreateAvatarModal } from "./create-avatar-modal-bh7rOqgn.js";
import { EditAvatarModal } from "./edit-avatar-modal-vWQabX_J.js";
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
function AvatarsPage({ auth }) {
  const [avatars, setAvatars] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const fetchAvatars = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/admin/avatars", {
        headers: {
          Accept: "application/json",
          "X-Requested-With": "XMLHttpRequest"
        }
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error HTTP:", errorText);
        throw new Error(`Error HTTP! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.avatars && data.avatars.data) {
        setAvatars(data.avatars.data);
      } else if (Array.isArray(data)) {
        setAvatars(data);
      } else if (data.data) {
        setAvatars(data.data);
      } else {
        console.warn("Unexpected API response structure:", data);
        setAvatars([]);
      }
    } catch (error) {
      console.error("Error cargando avatars:", error);
      toast.error("Error cargando lista de avatars");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchAvatars();
  }, []);
  const filteredAvatars = avatars.filter(
    (avatar) => {
      var _a, _b, _c;
      return avatar.name.toLowerCase().includes(searchTerm.toLowerCase()) || (((_a = avatar.price) == null ? void 0 : _a.toString()) || "").includes(searchTerm) || (((_c = (_b = avatar.requiredLevel) == null ? void 0 : _b.level) == null ? void 0 : _c.toString()) || "").includes(searchTerm);
    }
  );
  return /* @__PURE__ */ jsxs(AppLayout, { user: auth.user, children: [
    /* @__PURE__ */ jsxs("div", { className: "container mx-auto p-6", children: [
      /* @__PURE__ */ jsx(Head, { title: "Gestión de Avatar" }),
      /* @__PURE__ */ jsxs("div", { className: "mb-6 flex items-center justify-between", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-gray-900 dark:text-gray-100", children: "Gestión de Avatar" }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "relative w-64", children: [
            /* @__PURE__ */ jsx(Search, { className: "absolute top-2.5 left-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                type: "search",
                placeholder: "Buscar avatar...",
                className: "pl-8",
                value: searchTerm,
                onChange: (e) => setSearchTerm(e.target.value)
              }
            )
          ] }),
          /* @__PURE__ */ jsxs(Button, { onClick: () => setIsCreateModalOpen(true), children: [
            /* @__PURE__ */ jsx(Plus, { className: "mr-2 h-4 w-4" }),
            "Crear Avatar"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "dark:border-sidebar-border dark:bg-sidebar rounded-lg border border-gray-200 bg-white", children: /* @__PURE__ */ jsxs(Table, { children: [
        /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableHead, { children: "Image" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Nombre" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Precio" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Estado" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Acciones" })
        ] }) }),
        /* @__PURE__ */ jsx(TableBody, { children: isLoading ? /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, { colSpan: 6, className: "dark:text-sidebar-foreground/60 py-4 text-center text-gray-600", children: "Cargando avatars..." }) }) : filteredAvatars.length === 0 ? /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, { colSpan: 6, className: "dark:text-sidebar-foreground/60 py-4 text-center text-gray-600", children: "No se encontraron avatares" }) }) : filteredAvatars.map((avatar) => /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableCell, { children: avatar.image_url ? /* @__PURE__ */ jsx(
            "img",
            {
              src: avatar.image_url.startsWith("http") ? avatar.image_url : `${avatar.image_url}`,
              alt: avatar.name,
              className: "h-10 w-10 rounded-full object-cover"
            }
          ) : /* @__PURE__ */ jsx("div", { className: "dark:bg-sidebar-border flex h-10 w-10 items-center justify-center rounded-full bg-gray-200", children: /* @__PURE__ */ jsx("span", { className: "dark:text-sidebar-foreground/60 text-xs text-gray-500", children: "No image" }) }) }),
          /* @__PURE__ */ jsx(TableCell, { className: "font-medium", children: avatar.name }),
          /* @__PURE__ */ jsx(TableCell, { className: "dark:text-sidebar-foreground/70 text-gray-700", children: avatar.price }),
          /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(
            "span",
            {
              className: `inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${avatar.is_active ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"}`,
              children: avatar.is_active ? "Activo" : "Inactivo"
            }
          ) }),
          /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx("div", { className: "flex space-x-2", children: /* @__PURE__ */ jsx(
            Button,
            {
              variant: "ghost",
              size: "icon",
              onClick: () => {
                setSelectedAvatar(avatar);
                setIsEditModalOpen(true);
              },
              title: "Editar avatar",
              children: /* @__PURE__ */ jsx(Edit, { className: "h-4 w-4" })
            }
          ) }) })
        ] }, avatar.id)) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx(
      CreateAvatarModal,
      {
        isOpen: isCreateModalOpen,
        onClose: () => setIsCreateModalOpen(false),
        onSuccess: async () => {
          await fetchAvatars();
          setIsCreateModalOpen(false);
        }
      }
    ),
    selectedAvatar && /* @__PURE__ */ jsx(
      EditAvatarModal,
      {
        isOpen: isEditModalOpen,
        onClose: () => {
          setIsEditModalOpen(false);
          setSelectedAvatar(null);
        },
        avatar: selectedAvatar,
        onSuccess: async () => {
          await fetchAvatars();
          setIsEditModalOpen(false);
          setSelectedAvatar(null);
        }
      }
    )
  ] });
}
export {
  AvatarsPage as default
};
