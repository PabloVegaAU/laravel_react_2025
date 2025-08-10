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
  { title: "Tienda de Puntos", href: "#" },
  { title: "Premios", href: "student/store/rewards" }
];
function Dashboard() {
  const { setUser } = useUserStore();
  const { props } = usePage();
  const [prizes, setPrizes] = useState([]);
  const [puntos, setPuntos] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("disponible");
  useEffect(() => {
    if (props.user) {
      setUser(props.user);
      fetchStudentProfile(props.user.id);
      fetchPrizes(props.user.id);
    }
  }, [props.user]);
  const fetchPrizes = async (studentId) => {
    try {
      setLoading(true);
      const response = await axios.post("/api/prizelistforpurchase", {
        p_student_id: studentId
      });
      if (response.data.success) {
        setPrizes(response.data.data || []);
      }
    } catch (error) {
      console.error("Error al obtener los premios:", error);
      toast.error("Error al cargar los premios");
    } finally {
      setLoading(false);
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
      console.error("❌ Error al cargar el perfil:", error);
      toast.error("Error al cargar los puntos del estudiante");
    }
  };
  const handlePurchase = async (prizeId) => {
    var _a;
    const confirm = window.confirm("¿Estás seguro de que deseas canjear este premio?");
    if (!confirm) return;
    try {
      const response = await axios.post("/api/prizepurchase", {
        p_student_id: props.user.id,
        p_prize_id: prizeId
      });
      const result = ((_a = response.data.data) == null ? void 0 : _a[0]) || {};
      if (result.error < 0) {
        toast.error(result.mensa);
      } else {
        toast.success(result.mensa);
        await Promise.all([fetchPrizes(props.user.id), fetchStudentProfile(props.user.id)]);
      }
    } catch (error) {
      console.error("❌ Error en el canje:", error);
      toast.error("Ocurrió un error inesperado al procesar el canje.");
    }
  };
  const filteredPrizes = prizes.filter((prize) => activeTab === "adquirido" ? prize.already_acquired : !prize.already_acquired);
  if (loading) {
    return /* @__PURE__ */ jsxs(AppLayout, { breadcrumbs, children: [
      /* @__PURE__ */ jsx(Head, { title: "Tienda de Puntos - Premios" }),
      /* @__PURE__ */ jsx("div", { className: "flex h-64 items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "h-8 w-8 animate-spin rounded-full border-b-2 border-blue-500" }) })
    ] });
  }
  return /* @__PURE__ */ jsxs(AppLayout, { breadcrumbs, children: [
    /* @__PURE__ */ jsx(Head, { title: "Tienda de Puntos - Premios" }),
    /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 py-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-6 flex items-center justify-between", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold", children: "Premios" }),
        /* @__PURE__ */ jsxs("div", { className: "rounded-lg bg-yellow-100 px-4 py-2", children: [
          /* @__PURE__ */ jsx("span", { className: "font-medium", children: "Tus puntos: " }),
          /* @__PURE__ */ jsx("span", { className: "font-bold text-yellow-700", children: puntos !== null ? `${puntos} pts` : "..." })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mb-6 flex space-x-2 border-b", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setActiveTab("disponible"),
            className: `px-4 py-2 font-medium ${activeTab === "disponible" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500 hover:text-gray-700"}`,
            children: "Disponible"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setActiveTab("adquirido"),
            className: `px-4 py-2 font-medium ${activeTab === "adquirido" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500 hover:text-gray-700"}`,
            children: "Adquirido"
          }
        )
      ] }),
      filteredPrizes.length === 0 ? /* @__PURE__ */ jsx("div", { className: "mt-8 rounded-lg bg-white p-8 text-center shadow", children: /* @__PURE__ */ jsx("p", { className: "text-gray-500", children: activeTab === "adquirido" ? "No has canjeado ningún premio aún." : "No hay premios disponibles para canjear." }) }) : /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4", children: filteredPrizes.map((prize) => /* @__PURE__ */ jsxs("div", { className: "overflow-hidden rounded-lg border bg-white shadow-sm transition-shadow hover:shadow-md", children: [
        /* @__PURE__ */ jsx("div", { className: "h-48 bg-gray-100", children: prize.image ? /* @__PURE__ */ jsx(
          "img",
          {
            src: prize.image.startsWith("http") ? prize.image : `${prize.image}`,
            alt: prize.name,
            className: "h-full w-full object-cover"
          }
        ) : /* @__PURE__ */ jsx("div", { className: "flex h-full items-center justify-center bg-gray-200 text-gray-400", children: /* @__PURE__ */ jsx("span", { children: "Sin imagen" }) }) }),
        /* @__PURE__ */ jsxs("div", { className: "p-4", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold", children: prize.name }),
          /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-gray-600", children: prize.description }),
          /* @__PURE__ */ jsxs("div", { className: "mt-3 flex items-center justify-between", children: [
            /* @__PURE__ */ jsxs("span", { className: "text-sm font-medium text-gray-900", children: [
              prize.points_cost,
              " pts"
            ] }),
            prize.already_acquired ? /* @__PURE__ */ jsx("span", { className: "rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800", children: "Canjeado" }) : /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => handlePurchase(prize.id),
                disabled: puntos !== null && (puntos < prize.points_cost || prize.stock <= 0 || !prize.is_active),
                className: `rounded-full px-4 py-1 text-sm font-medium text-white ${puntos !== null && puntos >= prize.points_cost && prize.stock > 0 && prize.is_active ? "bg-blue-500 hover:bg-blue-600" : "cursor-not-allowed bg-gray-400"}`,
                title: !prize.is_active ? "No disponible" : prize.stock <= 0 ? "Sin stock" : "",
                children: !prize.is_active ? "No disponible" : prize.stock <= 0 ? "Sin stock" : "Canjear"
              }
            )
          ] }),
          prize.fecha_adquisicion && /* @__PURE__ */ jsxs("p", { className: "mt-2 text-xs text-gray-500", children: [
            "Canjeado el: ",
            new Date(prize.fecha_adquisicion).toLocaleDateString("es-ES")
          ] })
        ] })
      ] }, prize.id)) })
    ] })
  ] });
}
export {
  Dashboard as default
};
