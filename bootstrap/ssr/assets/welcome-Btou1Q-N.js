import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { I as Image } from "./image-Bmp5thdH.js";
import { u as useTranslations } from "./translator-csgEc0di.js";
import { u as useUserStore } from "./useUserStore-Db9ma-Ts.js";
import { usePage, Head, Link } from "@inertiajs/react";
import { useEffect } from "react";
import "zustand";
import "zustand/middleware";
function Welcome() {
  const { t } = useTranslations();
  const { auth } = usePage().props;
  const { roles, fetchUserPermissions } = useUserStore();
  useEffect(() => {
    var _a;
    if ((_a = auth.user) == null ? void 0 : _a.id) fetchUserPermissions();
  }, []);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(Head, { title: "Welcome", children: [
      /* @__PURE__ */ jsx("link", { rel: "preconnect", href: "https://fonts.bunny.net" }),
      /* @__PURE__ */ jsx("link", { href: "https://fonts.bunny.net/css?family=instrument-sans:400,500,600", rel: "stylesheet" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex min-h-screen flex-col items-center bg-[#FDFDFC] p-6 text-[#1b1b18] lg:justify-center lg:p-8 dark:bg-[#0a0a0a]", children: [
      /* @__PURE__ */ jsx("header", { className: "mb-6 w-full max-w-[335px] text-sm not-has-[nav]:hidden lg:max-w-4xl", children: /* @__PURE__ */ jsx("nav", { className: "flex items-center justify-end gap-4", children: roles.length > 0 ? roles.map((role) => /* @__PURE__ */ jsxs(
        Link,
        {
          href: route(role + ".dashboard"),
          className: "inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] capitalize hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]",
          children: [
            t("dashboard"),
            " ",
            t(role)
          ]
        }
      )) : /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(
          Link,
          {
            href: route("login"),
            className: "inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]",
            children: "Log in"
          }
        ),
        /* @__PURE__ */ jsx(
          Link,
          {
            href: route("register"),
            className: "inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]",
            children: "Register"
          }
        )
      ] }) }) }),
      /* @__PURE__ */ jsx("div", { className: "flex w-full items-center justify-center opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0", children: /* @__PURE__ */ jsx("main", { className: "container flex w-full flex-col-reverse lg:max-w-4xl lg:flex-row", children: /* @__PURE__ */ jsx(Image, { src: "/images/home/ie.jpg", alt: "Welcome" }) }) })
    ] })
  ] });
}
export {
  Welcome as default
};
