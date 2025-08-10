import { jsxs, jsx } from "react/jsx-runtime";
import { A as AppLayout } from "./app-layout-BsERFbVR.js";
import { u as useUserStore } from "./useUserStore-Db9ma-Ts.js";
import { usePage, Head } from "@inertiajs/react";
import axios from "axios";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "lucide-react";
import "./utils-qggO9Hcn.js";
import "clsx";
import "tailwind-merge";
import "./button-BqjjxT-O.js";
import "@radix-ui/react-dialog";
import "@radix-ui/react-tooltip";
import "./app-logo-icon-ZHVQJC4L.js";
import "./image-Bmp5thdH.js";
import "@radix-ui/react-dropdown-menu";
import "@radix-ui/react-avatar";
import "@tanstack/react-query";
import "zustand";
import "zustand/middleware";
const breadcrumbs = [
  {
    title: "Tienda de Puntos",
    href: "#"
  },
  {
    title: "Fondos",
    href: "student/store/backgrounds"
  }
];
function Dashboard() {
  const { setUser } = useUserStore();
  const { props } = usePage();
  const [backgrounds, setBackgrounds] = useState([]);
  const [puntos, setPuntos] = useState(null);
  useEffect(() => {
    if (props.user) {
      setUser({
        ...props.user,
        id: Number(props.user.id)
      });
      fetchStudentProfile(props.user.id);
      fetchBackgrounds(props.user.id);
    }
  }, [props.user]);
  const fetchBackgrounds = async (studentId) => {
    try {
      const response = await axios.post("/api/backgroundlistforpurchase", {
        p_student_id: studentId
      });
      if (response.data.success) setBackgrounds(response.data.data);
    } catch (error) {
      console.error("Error al obtener los fondos:", error);
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
  const handlePurchase = async (backgroundId) => {
    const confirm = window.confirm("¿Estás seguro de que deseas adquirir este fondo?");
    if (!confirm) return;
    try {
      const response = await axios.post("/api/backgroundpurchase", {
        p_student_id: props.user.id,
        p_background_id: backgroundId
      });
      const result = response.data.data[0];
      if (result.error < 0) {
        toast.error(result.mensa);
      } else {
        toast.success(result.mensa);
        await Promise.all([fetchBackgrounds(props.user.id), fetchStudentProfile(props.user.id)]);
      }
    } catch (error) {
      console.error("❌ Error en la compra:", error);
      toast.error("Ocurrió un error inesperado al procesar la compra.");
    }
  };
  return /* @__PURE__ */ jsxs(AppLayout, { breadcrumbs, children: [
    /* @__PURE__ */ jsx(Head, { title: "Tienda de Puntos - Fondos" }),
    /* @__PURE__ */ jsx("div", { className: "w-full space-y-8 px-4 py-6 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto w-full max-w-7xl space-y-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-8 flex items-center justify-between", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-gray-800", children: "Tienda de Fondos" }),
        /* @__PURE__ */ jsx("div", { className: "flex items-center space-x-4", children: /* @__PURE__ */ jsxs("div", { className: "rounded-lg bg-yellow-100 px-4 py-2", children: [
          /* @__PURE__ */ jsx("span", { className: "font-medium", children: "Tus puntos: " }),
          /* @__PURE__ */ jsx("span", { className: "font-bold text-yellow-700", children: puntos !== null ? `${puntos} pts` : "..." })
        ] }) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6", children: backgrounds.map((background) => /* @__PURE__ */ jsxs("div", { className: "rounded-xl bg-white p-3 shadow-sm transition-shadow hover:shadow-md", children: [
        /* @__PURE__ */ jsx("div", { className: "mb-3 flex aspect-square items-center justify-center overflow-hidden rounded-lg bg-gray-100", children: /* @__PURE__ */ jsx("div", { className: "h-full w-full bg-cover bg-center bg-no-repeat", style: { backgroundImage: `url(${background.image})` }, children: !background.image && /* @__PURE__ */ jsx("div", { className: "flex h-full w-full items-center justify-center bg-gray-100", children: /* @__PURE__ */ jsxs("span", { className: "text-gray-400", children: [
          "Fondo ",
          background.name
        ] }) }) }) }),
        /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-medium text-gray-900", children: background.name }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: "Fondo" }),
          /* @__PURE__ */ jsxs("div", { className: "mt-2 flex items-center justify-center space-x-2", children: [
            /* @__PURE__ */ jsxs("span", { className: "font-medium text-yellow-600", children: [
              background.points_store,
              " pts"
            ] }),
            /* @__PURE__ */ jsx("span", { className: "text-gray-400", children: "|" }),
            /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-500", children: background.adquirido ? "Adquirido" : "Disponible" })
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              disabled: background.adquirido,
              onClick: () => handlePurchase(background.background_id),
              className: `mt-2 w-full rounded-md py-1 text-sm font-semibold ${background.adquirido ? "cursor-not-allowed bg-red-200 text-red-900" : "bg-green-300 text-green-900 hover:bg-green-400"}`,
              children: background.estado_adquisicion
            }
          )
        ] })
      ] }, background.background_id)) })
    ] }) })
  ] });
}
export {
  Dashboard as default
};
