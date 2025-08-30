import { jsxs, jsx } from "react/jsx-runtime";
import { useForm, Head } from "@inertiajs/react";
import { LoaderCircle } from "lucide-react";
import { I as InputError } from "./input-error-CyRLkAox.js";
import { B as Button } from "./button-B8Z_lz_J.js";
import { I as Input } from "./input-Dr5dPtfm.js";
import { L as Label } from "./label-GjpnCFkz.js";
import { A as AuthLayout } from "./auth-layout-DCIDIpDa.js";
import "./utils-CpIjqAVa.js";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "@radix-ui/react-label";
import "./app-logo-icon-Dnok8BqH.js";
import "react";
import "./image-Bmp5thdH.js";
function ConfirmPassword() {
  const { data, setData, post, processing, errors, reset } = useForm({
    password: ""
  });
  const submit = (e) => {
    e.preventDefault();
    post(route("password.confirm"), {
      onFinish: () => reset("password")
    });
  };
  return /* @__PURE__ */ jsxs(AuthLayout, { title: "Confirm your password", description: "This is a secure area of the application. Please confirm your password before continuing.", children: [
    /* @__PURE__ */ jsx(Head, { title: "Confirm password" }),
    /* @__PURE__ */ jsx("form", { onSubmit: submit, children: /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "password", children: "Password" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            id: "password",
            type: "password",
            name: "password",
            placeholder: "Password",
            autoComplete: "current-password",
            value: data.password,
            autoFocus: true,
            onChange: (e) => setData("password", e.target.value)
          }
        ),
        /* @__PURE__ */ jsx(InputError, { message: errors.password })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex items-center", children: /* @__PURE__ */ jsxs(Button, { className: "w-full", disabled: processing, children: [
        processing && /* @__PURE__ */ jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }),
        "Confirm password"
      ] }) })
    ] }) })
  ] });
}
export {
  ConfirmPassword as default
};
