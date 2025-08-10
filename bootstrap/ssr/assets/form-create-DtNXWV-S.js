import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { B as Button } from "./button-B8Z_lz_J.js";
import { C as Checkbox } from "./checkbox-kbYJu5q1.js";
import { D as Dialog, a as DialogTrigger, b as DialogContent, c as DialogHeader, d as DialogTitle, e as DialogDescription } from "./dialog-sRXsDe1Q.js";
import { I as Input } from "./input-Dr5dPtfm.js";
import { L as Label } from "./label-GjpnCFkz.js";
import "react";
import { useForm } from "@inertiajs/react";
import { Loader2 } from "lucide-react";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./utils-CpIjqAVa.js";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-checkbox";
import "@radix-ui/react-dialog";
import "@radix-ui/react-label";
let count = 0;
function genId() {
  count = (count + 1) % Number.MAX_VALUE;
  return count.toString();
}
const toastTimeouts = /* @__PURE__ */ new Map();
const addToRemoveQueue = (toastId) => {
  if (toastTimeouts.has(toastId)) {
    return;
  }
  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({
      type: "REMOVE_TOAST",
      toastId
    });
  }, 1e3);
  toastTimeouts.set(toastId, timeout);
};
const reducer = (state, action) => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, 5)
      };
    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map(
          (t) => t.id === action.toast.id ? { ...t, ...action.toast } : t
        )
      };
    case "DISMISS_TOAST": {
      const { toastId } = action;
      if (toastId) {
        addToRemoveQueue(toastId);
      } else {
        state.toasts.forEach((toast2) => {
          addToRemoveQueue(toast2.id);
        });
      }
      return {
        ...state,
        toasts: state.toasts.map(
          (t) => t.id === toastId || toastId === void 0 ? {
            ...t,
            open: false
          } : t
        )
      };
    }
    case "REMOVE_TOAST":
      if (action.toastId === void 0) {
        return {
          ...state,
          toasts: []
        };
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId)
      };
  }
};
const listeners = [];
let memoryState = { toasts: [] };
function dispatch(action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}
function toast({ ...props }) {
  const id = genId();
  const update = (props2) => dispatch({
    type: "UPDATE_TOAST",
    toast: { ...props2, id }
  });
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id });
  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss();
      }
    }
  });
  return {
    id,
    dismiss,
    update
  };
}
function CreateAchievementDialog({ isOpen, onOpenChange }) {
  const { data, setData, post, processing, errors, reset } = useForm({
    name: "",
    description: "",
    image: "",
    activo: true
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    post(route("admin.achievements.store"), {
      onSuccess: () => {
        toast({
          title: "¡Éxito!",
          description: "El logro se ha creado correctamente"
        });
        onOpenChange(false);
        reset();
      },
      onError: (errors2) => {
        toast({
          title: "Error",
          description: "Ha ocurrido un error al crear el logro",
          variant: "destructive"
        });
        console.error("Error creating achievement:", errors2);
      }
    });
  };
  const handleFileChange = (e) => {
    var _a;
    const file = (_a = e.target.files) == null ? void 0 : _a[0];
    if (file) {
      setData("image", file);
    }
  };
  return /* @__PURE__ */ jsxs(Dialog, { open: isOpen, onOpenChange, children: [
    /* @__PURE__ */ jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsx(Button, { variant: "default", children: "Nuevo Logro" }) }),
    /* @__PURE__ */ jsxs(DialogContent, { className: "sm:max-w-[425px]", children: [
      /* @__PURE__ */ jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsx(DialogTitle, { children: "Crear Nuevo Logro" }),
        /* @__PURE__ */ jsx(DialogDescription, { children: "Completa los campos para crear un nuevo logro. Los campos marcados con * son obligatorios." })
      ] }),
      /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "name", children: "Nombre del logro *" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "name",
              value: data.name,
              onChange: (e) => setData("name", e.target.value),
              placeholder: "Ej: Mejor estudiante del mes",
              required: true,
              className: errors.name ? "border-red-500" : ""
            }
          ),
          errors.name && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-500", children: errors.name })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "description", children: "Descripción" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "description",
              value: data.description,
              onChange: (e) => setData("description", e.target.value),
              placeholder: "Describe el logro y cómo se obtiene",
              className: errors.description ? "border-red-500" : ""
            }
          ),
          errors.description && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-500", children: errors.description })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "image", children: "Imagen" }),
          /* @__PURE__ */ jsx(Input, { id: "image", type: "file", accept: "image/*", onChange: handleFileChange, className: "mt-1 block w-full" }),
          errors.image && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-red-500", children: errors.image })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
          /* @__PURE__ */ jsx(Checkbox, { id: "activo", checked: data.activo, onCheckedChange: (checked) => setData("activo", Boolean(checked)) }),
          /* @__PURE__ */ jsx(Label, { htmlFor: "activo", className: "text-sm leading-none font-medium", children: "Activo" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-end space-x-2 pt-4", children: [
          /* @__PURE__ */ jsx(Button, { type: "button", variant: "outline", onClick: () => onOpenChange(false), disabled: processing, children: "Cancelar" }),
          /* @__PURE__ */ jsx(Button, { type: "submit", disabled: processing, children: processing ? /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }),
            "Guardando..."
          ] }) : "Guardar Logro" })
        ] })
      ] })
    ] })
  ] });
}
export {
  CreateAchievementDialog
};
