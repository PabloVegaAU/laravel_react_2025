import { jsxs, jsx } from "react/jsx-runtime";
import { B as Button } from "./button-B8Z_lz_J.js";
import { D as Dialog, b as DialogContent, c as DialogHeader, d as DialogTitle } from "./dialog-sRXsDe1Q.js";
import { A as AppLayout } from "./app-layout-Dq465f56.js";
import { u as useUserStore } from "./use-mobile-navigation-cG7zaCET.js";
import { usePage, Head } from "@inertiajs/react";
import axios from "axios";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./utils-CpIjqAVa.js";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-dialog";
import "lucide-react";
import "./app-logo-icon-Dnok8BqH.js";
import "./image-Bmp5thdH.js";
import "@radix-ui/react-dropdown-menu";
import "@radix-ui/react-avatar";
import "./translator-csgEc0di.js";
import "@tanstack/react-query";
import "@radix-ui/react-tooltip";
import "zustand";
import "zustand/middleware";
const breadcrumbs = [
  { title: "Tienda de Puntos", href: "#" },
  { title: "Avatares", href: "student/store/avatars" }
];
function Dashboard() {
  const { setUser } = useUserStore();
  const { props } = usePage();
  const [avatars, setAvatars] = useState([]);
  const [puntos, setPuntos] = useState(null);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  useEffect(() => {
    if (props.user) {
      setUser({
        ...props.user,
        id: Number(props.user.id)
      });
      fetchStudentProfile(props.user.id);
      fetchAvatars(props.user.id);
    }
  }, [props.user]);
  const fetchAvatars = async (studentId) => {
    try {
      const response = await axios.post("/api/avatarlistforpurchase", {
        p_student_id: studentId
      });
      if (response.data.success) setAvatars(response.data.data);
    } catch (error) {
      console.error("Error al obtener los avatares:", error);
    }
  };
  const fetchStudentProfile = async (studentId) => {
    try {
      const response = await axios.post("/api/studentprofile", {
        p_student_id: studentId
      });
      if (response.data.success && response.data.data.length > 0) {
        setPuntos(response.data.data[0].puntos);
      }
    } catch (error) {
      if (error.response) {
        console.error("❌ Error de servidor:", error.response.data);
      } else {
        console.error("❌ Error al conectar con la API:", error.message);
      }
    }
  };
  const handlePurchase = async (avatarId) => {
    const confirm = window.confirm("¿Estás seguro de que deseas adquirir este avatar?");
    if (!confirm) return;
    try {
      const response = await axios.post("/api/avatarpurchase", {
        p_student_id: props.user.id,
        p_avatar_id: avatarId
      });
      const result = response.data.data[0];
      if (result.error < 0) {
        toast.error(result.mensa);
      } else {
        toast.success(result.mensa);
        await Promise.all([fetchAvatars(props.user.id), fetchStudentProfile(props.user.id)]);
      }
    } catch (error) {
      console.error("❌ Error en la compra:", error);
      toast.error("Ocurrió un error inesperado al procesar la compra.");
    }
  };
  const handlePreviewClick = (avatar) => {
    setSelectedAvatar(avatar);
    setIsPreviewOpen(true);
  };
  return /* @__PURE__ */ jsxs(AppLayout, { breadcrumbs, children: [
    /* @__PURE__ */ jsx(Head, { title: "Tienda de Puntos - Avatares" }),
    /* @__PURE__ */ jsx(Dialog, { open: isPreviewOpen, onOpenChange: setIsPreviewOpen, children: /* @__PURE__ */ jsxs(DialogContent, { className: "sm:max-w-[425px]", children: [
      /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { children: "Vista Previa del Avatar" }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-4 py-4", children: [
        /* @__PURE__ */ jsx("div", { className: "relative h-64 w-64 overflow-hidden rounded-full bg-white shadow-md", children: (selectedAvatar == null ? void 0 : selectedAvatar.image) ? /* @__PURE__ */ jsx(
          "img",
          {
            src: selectedAvatar.image.startsWith("http") ? selectedAvatar.image : `${selectedAvatar.image}`,
            alt: selectedAvatar.name,
            className: "h-full w-full object-contain p-4"
          }
        ) : /* @__PURE__ */ jsx("div", { className: "flex h-full w-full items-center justify-center rounded-full bg-gray-100", children: /* @__PURE__ */ jsx("span", { className: "text-gray-400", children: "Sin imagen" }) }) }),
        /* @__PURE__ */ jsx("h3", { className: "text-xl font-medium", children: selectedAvatar == null ? void 0 : selectedAvatar.name }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxs("span", { className: "rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-800", children: [
            selectedAvatar == null ? void 0 : selectedAvatar.points_store,
            " pts"
          ] }),
          /* @__PURE__ */ jsx("span", { className: "rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800", children: (selectedAvatar == null ? void 0 : selectedAvatar.adquirido) ? "Adquirido" : "Disponible" })
        ] }),
        /* @__PURE__ */ jsx(
          Button,
          {
            onClick: () => {
              if (selectedAvatar) {
                handlePurchase(selectedAvatar.avatar_id);
              }
              setIsPreviewOpen(false);
            },
            disabled: selectedAvatar == null ? void 0 : selectedAvatar.adquirido,
            className: `mt-2 w-full ${(selectedAvatar == null ? void 0 : selectedAvatar.adquirido) ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"}`,
            children: selectedAvatar == null ? void 0 : selectedAvatar.estado_adquisicion
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "w-full space-y-8 px-4 py-6 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto w-full max-w-7xl space-y-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-8 flex items-center justify-between", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-gray-800", children: "Tienda de Avatares" }),
        /* @__PURE__ */ jsx("div", { className: "flex items-center space-x-4", children: /* @__PURE__ */ jsxs("div", { className: "rounded-lg bg-yellow-100 px-4 py-2", children: [
          /* @__PURE__ */ jsx("span", { className: "font-medium", children: "Tus puntos: " }),
          /* @__PURE__ */ jsx("span", { className: "font-bold text-yellow-700", children: puntos !== null ? `${puntos} pts` : "..." })
        ] }) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6", children: avatars.map((avatar) => /* @__PURE__ */ jsxs(
        "div",
        {
          className: "group relative cursor-pointer rounded-xl bg-white p-3 shadow-sm transition-all hover:shadow-md",
          onClick: () => handlePreviewClick(avatar),
          children: [
            /* @__PURE__ */ jsx("div", { className: "mb-3 flex aspect-square items-center justify-center overflow-hidden rounded-lg bg-white shadow-sm transition-transform duration-300 group-hover:scale-105", children: avatar.image ? /* @__PURE__ */ jsx("div", { className: "relative h-full w-full", children: /* @__PURE__ */ jsx(
              "img",
              {
                src: avatar.image.startsWith("http") ? avatar.image : `${avatar.image}`,
                alt: avatar.name,
                className: "h-full w-full object-contain p-4 transition-opacity duration-200 group-hover:opacity-90"
              }
            ) }) : /* @__PURE__ */ jsx("div", { className: "flex h-full w-full items-center justify-center bg-gray-100", children: /* @__PURE__ */ jsxs("span", { className: "text-center text-gray-400", children: [
              "Avatar ",
              avatar.name
            ] }) }) }),
            /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
              /* @__PURE__ */ jsx("h3", { className: "font-medium text-gray-900", children: avatar.name }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: "Avatar" }),
              /* @__PURE__ */ jsxs("div", { className: "mt-2 flex items-center justify-center space-x-2", children: [
                /* @__PURE__ */ jsxs("span", { className: "font-medium text-yellow-600", children: [
                  avatar.points_store,
                  " pts"
                ] }),
                /* @__PURE__ */ jsx("span", { className: "text-gray-400", children: "|" }),
                /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-500", children: avatar.adquirido ? "Adquirido" : "Disponible" })
              ] }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  disabled: avatar.adquirido,
                  onClick: (e) => {
                    e.stopPropagation();
                    handlePurchase(avatar.avatar_id);
                  },
                  className: `mt-2 w-full rounded-md py-1 text-sm font-semibold transition-colors ${avatar.adquirido ? "cursor-not-allowed bg-red-200 text-red-900" : "bg-green-300 text-green-900 hover:bg-green-400"}`,
                  children: avatar.estado_adquisicion
                }
              )
            ] })
          ]
        },
        avatar.avatar_id
      )) })
    ] }) })
  ] });
}
export {
  Dashboard as default
};
