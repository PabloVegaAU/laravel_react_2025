import { jsxs, jsx } from "react/jsx-runtime";
import { useId, useEffect } from "react";
import { A as AppLayout } from "./app-layout-BsERFbVR.js";
import { u as useUserStore } from "./useUserStore-Db9ma-Ts.js";
import { Head } from "@inertiajs/react";
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
function PlaceholderPattern({ className }) {
  const patternId = useId();
  return /* @__PURE__ */ jsxs("svg", { className, fill: "none", children: [
    /* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsx("pattern", { id: patternId, x: "0", y: "0", width: "10", height: "10", patternUnits: "userSpaceOnUse", children: /* @__PURE__ */ jsx("path", { d: "M-3 13 15-5M-5 5l18-18M-1 21 17 3" }) }) }),
    /* @__PURE__ */ jsx("rect", { stroke: "none", fill: `url(#${patternId})`, width: "100%", height: "100%" })
  ] });
}
const breadcrumbs = [
  {
    title: "Dashboard",
    href: "admin/dashboard"
  }
];
function Dashboard() {
  const { setCurrentDashboardRole } = useUserStore();
  useEffect(() => {
    setCurrentDashboardRole("/admin/dashboard");
  }, []);
  return /* @__PURE__ */ jsxs(AppLayout, { breadcrumbs, children: [
    /* @__PURE__ */ jsx(Head, { title: "Dashboard" }),
    /* @__PURE__ */ jsxs("div", { className: "flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "grid auto-rows-min gap-4 md:grid-cols-3", children: [
        /* @__PURE__ */ jsx("div", { className: "border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border", children: /* @__PURE__ */ jsx(PlaceholderPattern, { className: "absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" }) }),
        /* @__PURE__ */ jsx("div", { className: "border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border", children: /* @__PURE__ */ jsx(PlaceholderPattern, { className: "absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" }) }),
        /* @__PURE__ */ jsx("div", { className: "border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border", children: /* @__PURE__ */ jsx(PlaceholderPattern, { className: "absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" }) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min", children: /* @__PURE__ */ jsx(PlaceholderPattern, { className: "absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" }) })
    ] })
  ] });
}
export {
  Dashboard as default
};
