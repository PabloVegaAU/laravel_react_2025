import { jsxs, jsx } from "react/jsx-runtime";
import { B as Button } from "./button-B8Z_lz_J.js";
import { C as Card, a as CardHeader, c as CardContent } from "./card-CN8XFMfu.js";
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
import "lucide-react";
import "@radix-ui/react-dialog";
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
  { title: "Premios", href: "student/store/rewards" }
];
function Dashboard() {
  const { setUser } = useUserStore();
  const { props } = usePage();
  const [prizes, setPrizes] = useState([]);
  const [puntos, setPuntos] = useState(null);
  const [loading, setLoading] = useState(true);
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
  if (loading) {
    return /* @__PURE__ */ jsxs(AppLayout, { breadcrumbs, children: [
      /* @__PURE__ */ jsx(Head, { title: "Tienda de Puntos - Premios" }),
      /* @__PURE__ */ jsx("div", { className: "flex h-64 items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "border-primary h-8 w-8 animate-spin rounded-full border-b-2" }) })
    ] });
  }
  return /* @__PURE__ */ jsxs(AppLayout, { breadcrumbs, children: [
    /* @__PURE__ */ jsx(Head, { title: "Tienda de Puntos - Premios" }),
    /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 py-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-8 flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-background rounded-lg border p-6 shadow-sm", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-foreground text-2xl font-bold", children: "Premios" }),
          /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm", children: "Gestiona tus premios" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex items-center space-x-4", children: /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-2 dark:border-yellow-800 dark:bg-yellow-950", children: [
          /* @__PURE__ */ jsx("span", { className: "font-medium text-yellow-900 dark:text-yellow-100", children: "Tus puntos: " }),
          /* @__PURE__ */ jsx("span", { className: "font-bold text-yellow-700 dark:text-yellow-300", children: puntos !== null ? `${puntos} pts` : "..." })
        ] }) })
      ] }),
      /* @__PURE__ */ jsx(PrizeGrid, { prizes, puntos, onPurchase: handlePurchase })
    ] })
  ] });
}
function PrizeGrid({ prizes, puntos, onPurchase }) {
  if (prizes.length === 0) {
    return /* @__PURE__ */ jsx("div", { className: "bg-card text-muted-foreground mt-8 rounded-lg p-8 text-center shadow", children: "No hay premios en esta categoría." });
  }
  return /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4", children: prizes.map((prize) => /* @__PURE__ */ jsxs(Card, { className: "overflow-hidden", children: [
    /* @__PURE__ */ jsx(CardHeader, { className: "p-0", children: prize.image ? /* @__PURE__ */ jsx("img", { src: prize.image, alt: prize.name, className: "h-48 w-full object-cover" }) : /* @__PURE__ */ jsx("div", { className: "bg-muted text-muted-foreground flex h-48 items-center justify-center", children: "Sin imagen" }) }),
    /* @__PURE__ */ jsxs(CardContent, { className: "p-4", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-foreground text-lg font-semibold", children: prize.name }),
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground mt-1 text-sm", children: prize.description }),
      /* @__PURE__ */ jsxs("div", { className: "mt-3 flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("span", { className: "text-foreground text-sm font-medium", children: [
          prize.points_cost,
          " pts"
        ] }),
        /* @__PURE__ */ jsx(
          Button,
          {
            onClick: () => onPurchase(prize.id),
            disabled: puntos !== null && (Number(puntos) < Number(prize.points_cost) || prize.stock <= 0 || !prize.is_active),
            variant: "default",
            children: !prize.is_active ? "No disponible" : prize.stock <= 0 ? "Sin stock" : "Canjear"
          }
        )
      ] })
    ] })
  ] }, prize.id)) });
}
export {
  Dashboard as default
};
