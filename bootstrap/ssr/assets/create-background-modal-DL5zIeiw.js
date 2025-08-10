import { jsx, jsxs } from "react/jsx-runtime";
import { B as Button } from "./button-B8Z_lz_J.js";
import { D as Dialog, b as DialogContent, c as DialogHeader, d as DialogTitle, f as DialogFooter } from "./dialog-sRXsDe1Q.js";
import { I as Input } from "./input-Dr5dPtfm.js";
import { L as Label } from "./label-GjpnCFkz.js";
import { useForm, router } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./utils-CpIjqAVa.js";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-dialog";
import "lucide-react";
import "@radix-ui/react-label";
function CreateBackgroundModal({ isOpen, onClose, onSuccess }) {
  const [levels, setLevels] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { data, setData, errors, reset } = useForm({
    name: "",
    level_required: "",
    activo: true,
    points_store: "",
    image: null
  });
  const fetchLevels = async () => {
    try {
      const url = "/api/levels";
      const response = await fetch(url, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest"
        },
        credentials: "include"
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data2 = await response.json();
      setLevels(data2.levels || []);
    } catch (error) {
      console.error("Error fetching levels:", error);
      setLevels([]);
    }
  };
  useEffect(() => {
    if (isOpen) {
      fetchLevels();
      reset();
      setPreviewImage(null);
    }
  }, [isOpen]);
  const handleFileChange = (e) => {
    var _a;
    const file = (_a = e.target.files) == null ? void 0 : _a[0];
    if (file) {
      setData("image", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("level_required", data.level_required);
    formData.append("activo", data.activo ? "1" : "0");
    formData.append("points_store", data.points_store);
    if (data.image) {
      formData.append("image", data.image);
    }
    router.post("/admin/backgrounds", formData, {
      onBefore: () => {
        setIsLoading(true);
      },
      onSuccess: (response) => {
        const backgroundData = response.props.data || response;
        toast.success("Fondo creado exitosamente");
        onClose();
        onSuccess(backgroundData);
      },
      onError: (error) => {
        toast.error(error.message || "Error creando fondo");
      },
      onFinish: () => {
        setIsLoading(false);
      }
    });
  };
  return /* @__PURE__ */ jsx(Dialog, { open: isOpen, onOpenChange: (open) => !open && onClose(), children: /* @__PURE__ */ jsxs(DialogContent, { className: "sm:max-w-[500px]", children: [
    /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { children: "Crear Fondo" }) }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "name", children: "Nombre" }),
        /* @__PURE__ */ jsx(Input, { id: "name", value: data.name, onChange: (e) => setData("name", e.target.value), required: true }),
        errors.name && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-500", children: errors.name })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "level_required", children: "Nivel Requerido" }),
          /* @__PURE__ */ jsxs(
            "select",
            {
              id: "level_required",
              value: data.level_required,
              onChange: (e) => setData("level_required", e.target.value),
              className: "border-input bg-background ring-offset-background flex h-10 w-full rounded-md border px-3 py-2 text-sm",
              required: true,
              children: [
                /* @__PURE__ */ jsx("option", { value: "", children: "Seleccionar nivel" }),
                levels.map((level) => /* @__PURE__ */ jsxs("option", { value: level.id, children: [
                  "Nivel ",
                  level.level,
                  " - ",
                  level.name
                ] }, level.id))
              ]
            }
          ),
          errors.level_required && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-500", children: errors.level_required })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "points_store", children: "Costo (puntos)" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "points_store",
              type: "number",
              min: "0",
              value: data.points_store,
              onChange: (e) => setData("points_store", e.target.value),
              required: true
            }
          ),
          errors.points_store && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-500", children: errors.points_store })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "checkbox",
            id: "activo",
            checked: data.activo,
            onChange: (e) => setData("activo", e.target.checked),
            className: "h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          }
        ),
        /* @__PURE__ */ jsx(Label, { htmlFor: "activo", className: "text-sm font-medium text-gray-700", children: "Activo" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Label, { children: "Imagen" }),
        /* @__PURE__ */ jsx("div", { className: "mt-1 flex justify-center rounded-md border-2 border-dashed px-6 pt-5 pb-6", children: /* @__PURE__ */ jsxs("div", { className: "space-y-1 text-center", children: [
          previewImage ? /* @__PURE__ */ jsx("img", { src: previewImage, alt: "Preview", className: "h-32 w-full rounded-md object-cover" }) : /* @__PURE__ */ jsx("svg", { className: "mx-auto h-12 w-12 text-gray-400", stroke: "currentColor", fill: "none", viewBox: "0 0 48 48", children: /* @__PURE__ */ jsx(
            "path",
            {
              d: "M28 8H12a4 4 0 00-4 4v20m32-12v8v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28l4 4m4-24h8m-4-4v8m-12 4h.02",
              strokeWidth: 2,
              strokeLinecap: "round",
              strokeLinejoin: "round"
            }
          ) }),
          /* @__PURE__ */ jsxs("div", { className: "flex text-sm text-gray-600", children: [
            /* @__PURE__ */ jsxs("label", { htmlFor: "file-upload", className: "relative cursor-pointer text-indigo-600 hover:text-indigo-500", children: [
              /* @__PURE__ */ jsx("span", { children: "Cargar imagen" }),
              /* @__PURE__ */ jsx("input", { id: "file-upload", type: "file", className: "sr-only", onChange: handleFileChange, accept: "image/*" })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "pl-1", children: "o arrastra y suelta" })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500", children: "PNG, JPG, GIF hasta 2MB" })
        ] }) }),
        errors.image && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-500", children: errors.image })
      ] }),
      /* @__PURE__ */ jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsx(Button, { type: "button", variant: "outline", onClick: onClose, disabled: isLoading, children: "Cancelar" }),
        /* @__PURE__ */ jsx(Button, { type: "submit", disabled: isLoading, children: isLoading ? "Guardando..." : "Guardar" })
      ] })
    ] })
  ] }) });
}
export {
  CreateBackgroundModal
};
