import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { I as InputError } from "./input-error-BCtMt8Ki.js";
import { B as Button } from "./button-BqjjxT-O.js";
import { D as Dialog, e as DialogTrigger, a as DialogContent, c as DialogTitle, f as DialogDescription } from "./dialog-CITBOAxv.js";
import { I as Input } from "./input-B1uJ3yMO.js";
import { L as Label } from "./label-CC7KirIj.js";
import { useForm } from "@inertiajs/react";
import { LoaderCircle } from "lucide-react";
import "./utils-qggO9Hcn.js";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "@radix-ui/react-dialog";
import "@radix-ui/react-label";
function CreateTeacherDialog({ isOpen, onOpenChange }) {
  const initialValues = {
    /* USER */
    name: "",
    password: "",
    email: "",
    /* PROFILE */
    firstName: "",
    lastName: "",
    secondLastName: "",
    birthDate: "",
    phone: ""
  };
  const { data, setData, post, processing, errors, reset } = useForm(initialValues);
  const handleSubmit = (e) => {
    e.preventDefault();
    post(route("admin.teachers.store"), {
      preserveScroll: true,
      preserveState: true,
      onSuccess: () => {
        reset();
        onOpenChange(false);
      }
    });
  };
  return /* @__PURE__ */ jsxs(Dialog, { open: isOpen, onOpenChange, children: [
    /* @__PURE__ */ jsx(DialogTrigger, { asChild: true, className: "w-fit", children: /* @__PURE__ */ jsx(Button, { variant: isOpen ? "info" : "outline-info", children: "Agregar docente" }) }),
    /* @__PURE__ */ jsxs(DialogContent, { className: "sm:max-w-[700px]", children: [
      /* @__PURE__ */ jsx(DialogTitle, { children: "Agregar docente" }),
      /* @__PURE__ */ jsx(DialogDescription, { children: "Complete el formulario para agregar un nuevo docente." }),
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
        ] }) : "Guardar docente" })
      ] })
    ] })
  ] });
}
export {
  CreateTeacherDialog
};
