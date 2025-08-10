import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { I as InputError } from "./input-error-CyRLkAox.js";
import { B as Button } from "./button-B8Z_lz_J.js";
import { D as Dialog, a as DialogTrigger, b as DialogContent, d as DialogTitle, e as DialogDescription } from "./dialog-sRXsDe1Q.js";
import { I as Input } from "./input-Dr5dPtfm.js";
import { L as Label } from "./label-GjpnCFkz.js";
import { a as formatDateForInput } from "./formats-DYgp-paT.js";
import { useForm } from "@inertiajs/react";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { PencilIcon, LoaderCircle } from "lucide-react";
import { useState, useEffect } from "react";
import "./utils-CpIjqAVa.js";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "@radix-ui/react-dialog";
import "@radix-ui/react-label";
function EditTeacherDialog({ userId }) {
  var _a, _b, _c, _d, _e;
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const { data: user, isLoading } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => fetch(`/admin/students/${userId}/edit`).then((res) => res.json()),
    enabled: isOpen
  });
  const { data, setData, put, processing, errors, reset } = useForm({
    name: (user == null ? void 0 : user.name) ?? "",
    password: "",
    email: (user == null ? void 0 : user.email) ?? "",
    firstName: ((_a = user == null ? void 0 : user.profile) == null ? void 0 : _a.first_name) ?? "",
    lastName: ((_b = user == null ? void 0 : user.profile) == null ? void 0 : _b.last_name) ?? "",
    secondLastName: ((_c = user == null ? void 0 : user.profile) == null ? void 0 : _c.second_last_name) ?? "",
    birthDate: formatDateForInput((_d = user == null ? void 0 : user.profile) == null ? void 0 : _d.birth_date) ?? "",
    phone: ((_e = user == null ? void 0 : user.profile) == null ? void 0 : _e.phone) ?? ""
  });
  useEffect(() => {
    queryClient.resetQueries({ queryKey: ["user", userId] });
    reset();
  }, [queryClient, userId]);
  useEffect(() => {
    var _a2, _b2, _c2, _d2, _e2;
    if (user) {
      setData({
        name: user.name ?? "",
        password: "",
        email: user.email ?? "",
        firstName: ((_a2 = user.profile) == null ? void 0 : _a2.first_name) ?? "",
        lastName: ((_b2 = user.profile) == null ? void 0 : _b2.last_name) ?? "",
        secondLastName: ((_c2 = user.profile) == null ? void 0 : _c2.second_last_name) ?? "",
        birthDate: formatDateForInput((_d2 = user.profile) == null ? void 0 : _d2.birth_date) ?? "",
        phone: ((_e2 = user.profile) == null ? void 0 : _e2.phone) ?? ""
      });
    }
  }, [user]);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user) return;
    put(route("admin.teachers.update", user.id), {
      preserveScroll: true,
      preserveState: true,
      onSuccess: () => {
        queryClient.resetQueries({ queryKey: ["user", userId] });
        reset();
        setIsOpen(false);
      }
    });
  };
  return /* @__PURE__ */ jsxs(
    Dialog,
    {
      open: isOpen,
      onOpenChange: (open) => {
        setIsOpen(open);
      },
      children: [
        /* @__PURE__ */ jsx(DialogTrigger, { children: /* @__PURE__ */ jsx(Button, { variant: isOpen ? "info" : "outline-info", children: /* @__PURE__ */ jsx(PencilIcon, { className: "size-4" }) }) }),
        user && isOpen && !isLoading && /* @__PURE__ */ jsxs(DialogContent, { className: "sm:max-w-[700px]", children: [
          /* @__PURE__ */ jsx(DialogTitle, { children: "Editar docente" }),
          /* @__PURE__ */ jsx(DialogDescription, { children: "Complete el formulario para editar un docente." }),
          /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "flex flex-col gap-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
                /* @__PURE__ */ jsx(Label, { htmlFor: "name", children: "DNI (usuario)" }),
                /* @__PURE__ */ jsx(Input, { id: "name", name: "name", type: "text", value: data.name, onChange: (e) => setData("name", e.target.value) }),
                /* @__PURE__ */ jsx(InputError, { message: errors.name })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
                /* @__PURE__ */ jsx(Label, { htmlFor: "password", children: "Contraseña" }),
                /* @__PURE__ */ jsx(Input, { id: "password", name: "password", type: "password", value: data.password, onChange: (e) => setData("password", e.target.value) }),
                /* @__PURE__ */ jsx(InputError, { message: errors.password })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "email", children: "Correo electrónico" }),
              /* @__PURE__ */ jsx(Input, { id: "email", name: "email", type: "email", value: data.email, onChange: (e) => setData("email", e.target.value) }),
              /* @__PURE__ */ jsx(InputError, { message: errors.email })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-2", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
                /* @__PURE__ */ jsx(Label, { htmlFor: "firstName", children: "Nombre" }),
                /* @__PURE__ */ jsx(Input, { id: "firstName", name: "firstName", type: "text", value: data.firstName, onChange: (e) => setData("firstName", e.target.value) }),
                /* @__PURE__ */ jsx(InputError, { message: errors.firstName })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
                /* @__PURE__ */ jsx(Label, { htmlFor: "lastName", children: "Apellido Paterno" }),
                /* @__PURE__ */ jsx(Input, { id: "lastName", name: "lastName", type: "text", value: data.lastName, onChange: (e) => setData("lastName", e.target.value) }),
                /* @__PURE__ */ jsx(InputError, { message: errors.lastName })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
                /* @__PURE__ */ jsx(Label, { htmlFor: "secondLastName", children: "Apellido Materno" }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    id: "secondLastName",
                    name: "secondLastName",
                    type: "text",
                    value: data.secondLastName,
                    onChange: (e) => setData("secondLastName", e.target.value)
                  }
                ),
                /* @__PURE__ */ jsx(InputError, { message: errors.secondLastName })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
                /* @__PURE__ */ jsx(Label, { htmlFor: "birthDate", children: "Fecha de nacimiento" }),
                /* @__PURE__ */ jsx(Input, { id: "birthDate", name: "birthDate", type: "date", value: data.birthDate, onChange: (e) => setData("birthDate", e.target.value) }),
                /* @__PURE__ */ jsx(InputError, { message: errors.birthDate })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
                /* @__PURE__ */ jsx(Label, { htmlFor: "phone", children: "Teléfono" }),
                /* @__PURE__ */ jsx(Input, { id: "phone", name: "phone", type: "text", value: data.phone, onChange: (e) => setData("phone", e.target.value) }),
                /* @__PURE__ */ jsx(InputError, { message: errors.phone })
              ] })
            ] }),
            /* @__PURE__ */ jsx(Button, { type: "submit", className: "mt-2 w-full", disabled: processing, children: processing ? /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }),
              "Guardando..."
            ] }) : "Guardar cambios" })
          ] })
        ] })
      ]
    }
  );
}
export {
  EditTeacherDialog
};
