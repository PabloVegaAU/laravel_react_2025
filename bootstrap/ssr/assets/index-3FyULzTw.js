import { jsxs, jsx } from "react/jsx-runtime";
import { A as AppLayout } from "./app-layout-BsERFbVR.js";
import { u as useUserStore } from "./useUserStore-Db9ma-Ts.js";
import { Head, Link } from "@inertiajs/react";
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
const PhotoIcon = ({ className = "h-5 w-5" }) => /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className, children: /* @__PURE__ */ jsx(
  "path",
  {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
  }
) });
const UserCircleIcon = ({ className = "h-5 w-5" }) => /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className, children: /* @__PURE__ */ jsx(
  "path",
  {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
  }
) });
const TrophyIcon = ({ className = "h-5 w-5" }) => /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className, children: /* @__PURE__ */ jsx(
  "path",
  {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M9.497 14.25H7.5m4.007-4.242a4.5 4.5 0 01-1.507 1.093M9.497 9.75H12m-2.51 1.093a4.5 4.5 0 011.507-1.093m-1.507 1.093A4.49 4.49 0 017.5 9.75m8.382-3.976a4.5 4.5 0 011.653 1.13m-1.653-1.13a4.5 4.5 0 00-1.653-1.13m-13.5 0a4.49 4.49 0 00-1.652 1.13m1.652-1.13a4.5 4.5 0 011.653-1.13m13.5 0c.171.285.27.619.27.976 0 .358-.099.691-.27.976m0 0a4.5 4.5 0 01-1.653 1.13m-13.5 0a4.5 4.5 0 01-1.653-1.13m13.5 0c.171-.285.27-.618.27-.976 0-.358-.099-.691-.27-.976m0 0a4.5 4.5 0 00-1.653-1.13M12 3v.75m0 3.75a2.25 2.25 0 01-2.25 2.25M12 8.25a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z"
  }
) });
const SparklesIcon = ({ className = "h-5 w-5" }) => /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className, children: /* @__PURE__ */ jsx(
  "path",
  {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
  }
) });
const breadcrumbs = [
  { title: "Inicio", href: "/student/dashboard" },
  { title: "Mis Objetos", href: "#" }
];
function MyObjects() {
  const { user, setAvatar, setBackground } = useUserStore();
  const [activeTab, setActiveTab] = useState("todos");
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [achievements, setAchievements] = useState([]);
  const [renderKey, setRenderKey] = useState(0);
  const [puntos, setPuntos] = useState(null);
  const [isApplying, setIsApplying] = useState(false);
  const fetchStudentProfile = async (studentId) => {
    try {
      const response = await axios.post("/api/studentprofile", {
        p_student_id: studentId
      });
      if (response.data.success && response.data.data.length > 0) {
        setPuntos(response.data.data[0].puntos);
      }
    } catch (error) {
      console.error("Error al cargar el perfil del estudiante:", error);
      toast.error("Error al cargar los puntos del estudiante");
    }
  };
  useEffect(() => {
    setRenderKey((prev) => prev + 1);
    let cancelRequest = false;
    setItems([]);
    setAchievements([]);
    setIsLoading(true);
    const delay = setTimeout(() => {
      const fetchData = async () => {
        const studentId = user == null ? void 0 : user.id;
        if (!studentId) return;
        await fetchStudentProfile(Number(studentId));
        try {
          if (activeTab === "logros") {
            const res = await axios.post("/api/studentachievementslist", {
              p_student_id: Number(studentId)
            });
            if (res.data.success && !cancelRequest) {
              const achievementItems = res.data.data.map((achievement) => ({
                id: achievement.id,
                name: achievement.name,
                description: achievement.description,
                image: achievement.image || "/images/default-achievement.png",
                tipo: "logro",
                fecha_obtencion: achievement.assigned_at,
                es_premiun: false
              }));
              setAchievements(achievementItems);
            }
          } else {
            const endpoints = {
              avatares: `/api/studentavatarslist`,
              fondos: `/api/studentbackgroundslist`,
              premios: `/api/studentprizeshistory`
            };
            const allItems = [];
            if (activeTab === "todos" || activeTab === "avatares") {
              const { data } = await axios.post(endpoints.avatares, { p_student_id: Number(studentId) });
              if (data.success) {
                allItems.push(
                  ...data.data.map((item) => ({
                    id: item.avatar_id,
                    name: item.name,
                    image: item.image,
                    tipo: "avatar",
                    fecha_obtencion: item.fecha_obtencion || null
                  }))
                );
              }
            }
            if (activeTab === "todos" || activeTab === "fondos") {
              const { data } = await axios.post(endpoints.fondos, { p_student_id: Number(studentId) });
              if (data.success) {
                allItems.push(
                  ...data.data.map((item) => ({
                    ...item,
                    tipo: "fondo",
                    fecha_obtencion: item.fecha_obtencion || null
                  }))
                );
              }
            }
            if (activeTab === "todos" || activeTab === "premios") {
              const { data } = await axios.post(endpoints.premios, { p_student_id: Number(studentId) });
              if (data.success) {
                allItems.push(
                  ...data.data.map((item) => ({
                    ...item,
                    tipo: "premio",
                    fecha_obtencion: item.fecha_obtencion || null
                  }))
                );
              }
            }
            if (!cancelRequest) {
              setItems(allItems);
            }
          }
        } catch (error) {
          toast.error("Error al cargar los objetos");
          console.error(error);
        } finally {
          if (!cancelRequest) {
            setIsLoading(false);
          }
        }
      };
      fetchData();
    }, 100);
    return () => {
      clearTimeout(delay);
      cancelRequest = true;
    };
  }, [activeTab]);
  const getItemTypeLabel = (type) => {
    switch (type) {
      case "avatar":
        return "Avatar";
      case "fondo":
        return "Fondo";
      case "premio":
        return "premio";
      case "logro":
        return "Logro";
      default:
        return type;
    }
  };
  const getTypeIcon = (type) => {
    switch (type) {
      case "avatar":
        return /* @__PURE__ */ jsx(UserCircleIcon, { className: "h-5 w-5" });
      case "fondo":
        return /* @__PURE__ */ jsx(PhotoIcon, { className: "h-5 w-5" });
      case "premio":
        return /* @__PURE__ */ jsx(TrophyIcon, { className: "h-5 w-5" });
      case "logro":
        return /* @__PURE__ */ jsx(SparklesIcon, { className: "h-5 w-5" });
      default:
        return /* @__PURE__ */ jsx(SparklesIcon, { className: "h-5 w-5" });
    }
  };
  const handleItemClick = (item) => {
    setSelectedItem(item);
    setIsPreviewOpen(true);
  };
  const handleApplyItem = async (item) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
    if (!item || !(user == null ? void 0 : user.id)) {
      toast.error("Error: No se pudo identificar el usuario o el objeto");
      return;
    }
    const itemId = item.tipo === "fondo" ? item.background_id : item.id;
    if (itemId === void 0 || itemId === null) {
      console.error("Item has no valid ID:", item);
      toast.error(`Error: No se pudo identificar el ID del ${item.tipo}`);
      return;
    }
    try {
      setIsApplying(true);
      let endpoint = "";
      const requestData = new URLSearchParams();
      requestData.append("p_student_id", user.id.toString());
      if (item.tipo === "avatar") {
        endpoint = "/api/studentavatarapply";
        requestData.append("p_avatar_id", itemId.toString());
        setAvatar(item.image);
      } else if (item.tipo === "fondo") {
        endpoint = "/api/studentbackgroundapply";
        requestData.append("p_background_id", itemId.toString());
        setBackground(item.image);
      } else {
        toast.error("Tipo de objeto no soportado");
        return;
      }
      console.log("Sending request to:", endpoint);
      console.log("Item:", item);
      console.log("Request data:", Object.fromEntries(requestData.entries()));
      const response = await axios.post(endpoint, requestData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      });
      const result = ((_b = (_a = response.data) == null ? void 0 : _a.data) == null ? void 0 : _b[0]) || ((_c = response.data) == null ? void 0 : _c[0]);
      if ((result == null ? void 0 : result.error) === 0 && (result == null ? void 0 : result.mensa)) {
        toast.success(result.mensa);
        useUserStore.getState().setUser({
          ...user,
          [item.tipo]: item.image
        });
        setIsPreviewOpen(false);
      } else {
        throw new Error((result == null ? void 0 : result.mensa) || "Error al aplicar el objeto");
      }
    } catch (error) {
      console.error(`Error applying ${item.tipo}:`, error);
      const errorMessage = ((_g = (_f = (_e = (_d = error.response) == null ? void 0 : _d.data) == null ? void 0 : _e.data) == null ? void 0 : _f[0]) == null ? void 0 : _g.mensa) || ((_j = (_i = (_h = error.response) == null ? void 0 : _h.data) == null ? void 0 : _i[0]) == null ? void 0 : _j.mensa) || `Error al aplicar el ${item.tipo}`;
      toast.error(errorMessage);
    } finally {
      setIsApplying(false);
    }
  };
  const handleClosePreview = () => {
    setIsPreviewOpen(false);
    setTimeout(() => setSelectedItem(null), 200);
  };
  const getFilteredItems = () => {
    if (activeTab === "logros") {
      return [...achievements];
    }
    return items.filter((item) => {
      if (activeTab === "todos") return item.tipo !== "logro";
      if (activeTab === "avatares") return item.tipo === "avatar";
      if (activeTab === "fondos") return item.tipo === "fondo";
      if (activeTab === "premios") return item.tipo === "premio";
      return false;
    });
  };
  return /* @__PURE__ */ jsxs(AppLayout, { breadcrumbs, children: [
    /* @__PURE__ */ jsx(Head, { title: "Mis Objetos" }),
    /* @__PURE__ */ jsx("div", { className: "p-4w-full flex h-full flex-1 flex-col gap-4 space-y-8 overflow-x-auto rounded-xl px-4 py-6 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto w-full max-w-7xl space-y-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-8 flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-background rounded-lg border p-6 shadow-sm", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-foreground text-2xl font-bold", children: "Mis Objetos" }),
          /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm", children: "Gestiona tus avatares, fondos y premios" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex items-center space-x-4", children: /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-2 dark:border-yellow-800 dark:bg-yellow-950", children: [
          /* @__PURE__ */ jsx("span", { className: "font-medium text-yellow-900 dark:text-yellow-100", children: "Tus puntos: " }),
          /* @__PURE__ */ jsx("span", { className: "font-bold text-yellow-700 dark:text-yellow-300", children: puntos !== null ? `${puntos} pts` : "..." })
        ] }) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "bg-background mb-6 flex space-x-2 overflow-x-auto rounded-lg border p-6 shadow-sm", children: ["todos", "avatares", "fondos", "premios", "logros"].map((tab) => {
        const isActive = activeTab === tab;
        return /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => setActiveTab(tab),
            className: `flex items-center space-x-2 rounded-lg px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors ${isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`,
            children: [
              tab === "todos" && /* @__PURE__ */ jsx(SparklesIcon, { className: "h-4 w-4" }),
              tab === "avatares" && /* @__PURE__ */ jsx(UserCircleIcon, { className: "h-4 w-4" }),
              tab === "fondos" && /* @__PURE__ */ jsx(PhotoIcon, { className: "h-4 w-4" }),
              tab === "premios" && /* @__PURE__ */ jsx(TrophyIcon, { className: "h-4 w-4" }),
              tab === "logros" && /* @__PURE__ */ jsx(SparklesIcon, { className: "h-4 w-4" }),
              /* @__PURE__ */ jsx("span", { children: tab.charAt(0).toUpperCase() + tab.slice(1) })
            ]
          },
          tab
        );
      }) }),
      isLoading ? /* @__PURE__ */ jsx("div", { className: "flex h-64 items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "border-primary h-8 w-8 animate-spin rounded-full border-b-2" }) }) : getFilteredItems().length === 0 ? /* @__PURE__ */ jsxs("div", { className: "border-border flex h-64 flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 text-center", children: [
        /* @__PURE__ */ jsx(SparklesIcon, { className: "text-muted-foreground mx-auto h-12 w-12" }),
        /* @__PURE__ */ jsx("h3", { className: "text-foreground mt-2 text-sm font-medium", children: "No hay objetos" }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground mt-1 text-sm", children: activeTab === "todos" ? "No tienes objetos en tu colección." : `No tienes ${activeTab} en tu colección.` }),
        /* @__PURE__ */ jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsxs(
          Link,
          {
            href: route("student.store"),
            className: "bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:outline-primary inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2",
            children: [
              /* @__PURE__ */ jsx(SparklesIcon, { className: "mr-1.5 -ml-0.5 h-5 w-5" }),
              "Visitar la tienda"
            ]
          }
        ) })
      ] }) : /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6", children: getFilteredItems().map((item) => /* @__PURE__ */ jsxs(
        "div",
        {
          onClick: () => handleItemClick(item),
          className: "group bg-card hover:ring-primary/50 relative cursor-pointer overflow-hidden rounded-xl border p-3 shadow-sm transition-all hover:shadow-md hover:ring-2",
          children: [
            /* @__PURE__ */ jsx("div", { className: "bg-primary/10 text-primary absolute top-2 right-2 z-10 flex h-6 w-6 items-center justify-center rounded-full", children: getTypeIcon(item.tipo) }),
            /* @__PURE__ */ jsx("div", { className: "bg-muted relative mb-3 aspect-square w-full overflow-hidden rounded-lg", children: item.image ? /* @__PURE__ */ jsx(
              "img",
              {
                src: `${item.image}`,
                alt: item.name,
                className: "h-full w-full object-cover transition-transform duration-300 group-hover:scale-105",
                onError: (e) => {
                  const target = e.target;
                  target.onerror = null;
                  target.src = "/images/placeholder-item.png";
                  console.log("Error cargando imagen avatar:", item.image);
                }
              }
            ) : /* @__PURE__ */ jsx("div", { className: "text-muted-foreground flex h-full items-center justify-center", children: /* @__PURE__ */ jsx(PhotoIcon, { className: "h-12 w-12" }) }) }),
            /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
              /* @__PURE__ */ jsx("h3", { className: "text-foreground truncate text-sm font-medium", children: item.name }),
              /* @__PURE__ */ jsx("p", { className: "text-muted-foreground mt-1 text-xs", children: getItemTypeLabel(item.tipo) }),
              /* @__PURE__ */ jsxs("div", { className: "mt-2 flex items-center justify-center space-x-2", children: [
                item.precio !== void 0 && item.precio > 0 && /* @__PURE__ */ jsxs("span", { className: "flex items-center text-xs font-medium text-yellow-600 dark:text-yellow-400", children: [
                  item.precio.toLocaleString(),
                  " ",
                  /* @__PURE__ */ jsx("span", { className: "ml-0.5", children: "🪙" })
                ] }),
                item.nivel_desbloqueo && item.nivel_desbloqueo > 0 && /* @__PURE__ */ jsxs("span", { className: "text-muted-foreground text-xs", children: [
                  "Nv. ",
                  item.nivel_desbloqueo
                ] }),
                item.fecha_obtencion && /* @__PURE__ */ jsx("span", { className: "text-xs text-green-600 dark:text-green-400", children: "Obtenido" })
              ] })
            ] })
          ]
        },
        `${item.tipo}-${item.id || Math.random().toString(36).substr(2, 9)}`
      )) }, renderKey),
      isPreviewOpen && selectedItem && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4", children: /* @__PURE__ */ jsxs("div", { className: "bg-background relative w-full max-w-lg rounded-2xl border p-6 shadow-xl", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: handleClosePreview,
            className: "text-muted-foreground hover:bg-muted hover:text-foreground absolute top-4 right-4 rounded-full p-1",
            children: /* @__PURE__ */ jsx("svg", { className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) })
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center", children: [
          /* @__PURE__ */ jsx("div", { className: "bg-muted relative mb-6 h-48 w-full overflow-hidden rounded-xl", children: selectedItem.image ? /* @__PURE__ */ jsx(
            "img",
            {
              src: `${selectedItem.image}`,
              alt: selectedItem.name,
              className: "h-full w-full object-cover",
              onError: (e) => {
                const target = e.target;
                target.onerror = null;
                target.src = "/images/placeholder-item.png";
              }
            }
          ) : /* @__PURE__ */ jsx("div", { className: "text-muted-foreground flex h-full items-center justify-center", children: /* @__PURE__ */ jsx(PhotoIcon, {}) }) }),
          /* @__PURE__ */ jsxs("div", { className: "w-full text-center", children: [
            /* @__PURE__ */ jsxs("div", { className: "mb-1 flex items-center justify-center", children: [
              /* @__PURE__ */ jsx("span", { className: "text-foreground text-xl font-bold", children: selectedItem.name }),
              /* @__PURE__ */ jsx("span", { className: "bg-primary/10 text-primary ml-2 rounded-full px-2 py-0.5 text-xs font-medium", children: getItemTypeLabel(selectedItem.tipo) })
            ] }),
            selectedItem.description && /* @__PURE__ */ jsx("p", { className: "text-muted-foreground mb-4 text-sm", children: selectedItem.description }),
            /* @__PURE__ */ jsxs("div", { className: "border-border mt-4 grid grid-cols-2 gap-4 border-t pt-4", children: [
              selectedItem.precio !== void 0 && /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm font-medium", children: "Precio" }),
                /* @__PURE__ */ jsxs("p", { className: "mt-1 flex items-center justify-center text-lg font-bold text-yellow-600 dark:text-yellow-400", children: [
                  selectedItem.precio.toLocaleString(),
                  /* @__PURE__ */ jsx("span", { className: "ml-1", children: "🪙" })
                ] })
              ] }),
              selectedItem.nivel_desbloqueo && selectedItem.nivel_desbloqueo > 0 && /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm font-medium", children: "Nivel Requerido" }),
                /* @__PURE__ */ jsxs("p", { className: "text-foreground mt-1 text-lg font-bold", children: [
                  "Nv. ",
                  selectedItem.nivel_desbloqueo
                ] })
              ] }),
              selectedItem.fecha_obtencion && /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm font-medium", children: "Fecha de Obtención" }),
                /* @__PURE__ */ jsx("p", { className: "text-muted-foreground mt-1 text-sm", children: new Date(selectedItem.fecha_obtencion).toLocaleDateString("es-ES", {
                  year: "numeric",
                  month: "long",
                  day: "numeric"
                }) })
              ] }),
              selectedItem.es_premiun && /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm font-medium", children: "Tipo" }),
                /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm font-medium text-purple-600 dark:text-purple-400", children: "Premium" })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "mt-4 flex justify-between space-x-2", children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: handleClosePreview,
                  className: "bg-muted text-muted-foreground hover:bg-muted/80 focus:ring-primary flex-1 rounded-md px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-offset-2 focus:outline-none",
                  children: "Cerrar"
                }
              ),
              ((selectedItem == null ? void 0 : selectedItem.tipo) === "avatar" || (selectedItem == null ? void 0 : selectedItem.tipo) === "fondo") && /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => handleApplyItem(selectedItem),
                  disabled: isApplying,
                  className: "bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary flex-1 rounded-md px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:opacity-50",
                  children: isApplying ? "Aplicando..." : `Usar este ${selectedItem.tipo}`
                }
              )
            ] })
          ] })
        ] })
      ] }) })
    ] }) })
  ] });
}
export {
  MyObjects as default
};
