import { jsxs, jsx } from "react/jsx-runtime";
import { useForm, Head } from "@inertiajs/react";
import { LoaderCircle } from "lucide-react";
import { I as InputError } from "./input-error-CyRLkAox.js";
import { T as TextLink } from "./text-link-CE_z1bmV.js";
import { B as Button } from "./button-B8Z_lz_J.js";
import { C as Checkbox } from "./checkbox-kbYJu5q1.js";
import { I as Input } from "./input-Dr5dPtfm.js";
import { L as Label } from "./label-GjpnCFkz.js";
import { A as AuthLayout } from "./auth-layout-DCIDIpDa.js";
import { u as useTranslations } from "./translator-csgEc0di.js";
import "./utils-CpIjqAVa.js";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "@radix-ui/react-checkbox";
import "@radix-ui/react-label";
import "./app-logo-icon-Dnok8BqH.js";
import "react";
import "./image-Bmp5thdH.js";
function Login({ status, canResetPassword }) {
  const { t } = useTranslations();
  const { data, setData, post, processing, errors, reset } = useForm({
    name: "",
    password: "",
    remember: false
  });
  const submit = (e) => {
    e.preventDefault();
    post(route("login"), {
      onFinish: () => reset("password")
    });
  };
  return /* @__PURE__ */ jsxs(AuthLayout, { title: t("Log in to your account"), description: t("Enter your email and password below to log in"), children: [
    /* @__PURE__ */ jsx(Head, { title: "Log in" }),
    /* @__PURE__ */ jsx("form", { className: "flex flex-col gap-6", onSubmit: submit, children: /* @__PURE__ */ jsxs("div", { className: "grid gap-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "name", children: t("DNI") }),
        /* @__PURE__ */ jsx(
          Input,
          {
            id: "name",
            type: "text",
            required: true,
            autoFocus: true,
            tabIndex: 1,
            autoComplete: "name",
            value: data.name,
            onChange: (e) => setData("name", e.target.value),
            placeholder: t("DNI")
          }
        ),
        /* @__PURE__ */ jsx(InputError, { message: errors.name })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "password", children: t("Password") }),
          canResetPassword && /* @__PURE__ */ jsxs(TextLink, { href: route("password.request"), className: "ml-auto text-sm", tabIndex: 5, children: [
            t("Forgot password"),
            "?"
          ] })
        ] }),
        /* @__PURE__ */ jsx(
          Input,
          {
            id: "password",
            type: "password",
            required: true,
            tabIndex: 2,
            autoComplete: "current-password",
            value: data.password,
            onChange: (e) => setData("password", e.target.value),
            placeholder: t("Password")
          }
        ),
        /* @__PURE__ */ jsx(InputError, { message: errors.password })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-3", children: [
        /* @__PURE__ */ jsx(Checkbox, { id: "remember", name: "remember", checked: data.remember, onClick: () => setData("remember", !data.remember), tabIndex: 3 }),
        /* @__PURE__ */ jsx(Label, { htmlFor: "remember", children: t("Remember me") })
      ] }),
      /* @__PURE__ */ jsxs(Button, { type: "submit", className: "mt-4 w-full", tabIndex: 4, disabled: processing, children: [
        processing && /* @__PURE__ */ jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }),
        t("Log In")
      ] })
    ] }) }),
    status && /* @__PURE__ */ jsx("div", { className: "mb-4 text-center text-sm font-medium text-green-600", children: status })
  ] });
}
export {
  Login as default
};
