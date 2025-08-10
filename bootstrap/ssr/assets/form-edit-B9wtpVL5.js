import { jsxs, jsx } from "react/jsx-runtime";
import { I as InputError } from "./input-error-CyRLkAox.js";
import { B as Button } from "./button-B8Z_lz_J.js";
import { C as Checkbox } from "./checkbox-kbYJu5q1.js";
import { D as Dialog, a as DialogTrigger, b as DialogContent, c as DialogHeader, d as DialogTitle } from "./dialog-sRXsDe1Q.js";
import { I as Input } from "./input-Dr5dPtfm.js";
import { L as Label } from "./label-GjpnCFkz.js";
import { useForm } from "@inertiajs/react";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { Pencil } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import "./utils-CpIjqAVa.js";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "@radix-ui/react-checkbox";
import "@radix-ui/react-dialog";
import "@radix-ui/react-label";
function EditAchievementDialog({ isOpen, onOpenChange, achievementId, onSuccess }) {
  const queryClient = useQueryClient();
  const [preview, setPreview] = useState(null);
  const { data: achievement, isFetching } = useQuery({
    queryKey: ["achievement", achievementId],
    queryFn: async () => await fetch(route("admin.achievements.edit", achievementId)).then((res) => res.json()),
    enabled: isOpen && !!achievementId,
    staleTime: 1e3 * 60 * 5,
    // 5 minutos
    refetchOnWindowFocus: false
  });
  const initialValues = useMemo(
    () => ({
      name: achievement == null ? void 0 : achievement.name,
      description: achievement == null ? void 0 : achievement.description,
      image: achievement == null ? void 0 : achievement.image,
      activo: achievement == null ? void 0 : achievement.activo,
      _method: "PUT"
    }),
    []
  );
  const { data, setData, post, processing, errors, reset } = useForm(initialValues);
  useEffect(() => {
    if (isOpen && achievement) {
      const formData = {
        name: achievement.name,
        description: achievement.description,
        image: achievement.image,
        activo: achievement.activo,
        _method: "PUT"
      };
      setData(formData);
      setPreview(achievement.image);
    }
  }, [isOpen, achievement, setData]);
  const handleFileChange = (e) => {
    var _a;
    const file = (_a = e.target.files) == null ? void 0 : _a[0];
    if (file) {
      setData("image", file);
      setPreview(URL.createObjectURL(file));
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    post(route("admin.achievements.update", achievementId), {
      forceFormData: true,
      preserveScroll: true,
      preserveState: true,
      only: ["achievements", "flash", "errors"],
      onSuccess: () => {
        onOpenChange(false);
        onSuccess == null ? void 0 : onSuccess();
        reset();
        queryClient.invalidateQueries({ queryKey: ["achievement", achievementId] });
      }
    });
  };
  return /* @__PURE__ */ jsxs(Dialog, { open: isOpen, onOpenChange, children: [
    /* @__PURE__ */ jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "icon", className: "h-8 w-8 p-0", children: /* @__PURE__ */ jsx(Pencil, { className: "h-4 w-4" }) }) }),
    /* @__PURE__ */ jsxs(DialogContent, { children: [
      /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { children: "Editar Logro" }) }),
      isFetching ? /* @__PURE__ */ jsx("div", { className: "flex justify-center py-8", children: /* @__PURE__ */ jsx("div", { className: "border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" }) }) : /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "name", children: "Nombre" }),
          /* @__PURE__ */ jsx(Input, { id: "name", value: data.name, onChange: (e) => setData("name", e.target.value), placeholder: "Nombre del logro" }),
          /* @__PURE__ */ jsx(InputError, { message: errors.name })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "description", children: "Descripción" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "description",
              value: data.description,
              onChange: (e) => setData("description", e.target.value),
              placeholder: "Descripción del logro"
            }
          ),
          /* @__PURE__ */ jsx(InputError, { message: errors.description })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-6", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "image", children: "Imagen" }),
              /* @__PURE__ */ jsx(Input, { id: "image", type: "file", accept: "image/*", onChange: handleFileChange, className: "cursor-pointer" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(Checkbox, { id: "activo", checked: data.activo ?? false, onCheckedChange: (checked) => setData("activo", Boolean(checked)) }),
              /* @__PURE__ */ jsx(Label, { htmlFor: "activo", children: "Activo" })
            ] })
          ] }),
          preview && /* @__PURE__ */ jsx("div", { className: "mt-2 flex items-center justify-center", children: /* @__PURE__ */ jsx("img", { src: preview, alt: "Vista previa", className: "h-32 w-32 rounded-md object-cover" }) }),
          /* @__PURE__ */ jsx(InputError, { message: errors.image })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-end space-x-2 pt-4", children: [
          /* @__PURE__ */ jsx(Button, { type: "button", variant: "outline", onClick: () => onOpenChange(false), disabled: processing, children: "Cancelar" }),
          /* @__PURE__ */ jsx(Button, { type: "submit", disabled: processing, children: processing ? "Guardando..." : "Guardar cambios" })
        ] })
      ] })
    ] })
  ] });
}
export {
  EditAchievementDialog
};
