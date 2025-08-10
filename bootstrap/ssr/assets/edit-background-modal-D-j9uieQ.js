import { jsx, jsxs } from "react/jsx-runtime";
import { B as Button } from "./button-BqjjxT-O.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogFooter } from "./dialog-CITBOAxv.js";
import { I as Input } from "./input-B1uJ3yMO.js";
import { L as Label } from "./label-CC7KirIj.js";
import { useForm } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./utils-qggO9Hcn.js";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-dialog";
import "lucide-react";
import "@radix-ui/react-label";
function EditBackgroundModal({ isOpen, onClose, background: initialBackground, onSuccess }) {
  const [levels, setLevels] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: initialBackground.name,
    level_required: initialBackground.level_required.level.toString(),
    points_store: typeof initialBackground.points_store === "number" ? initialBackground.points_store.toString() : initialBackground.points_store || "0",
    image: initialBackground.image || null
  });
  useEffect(() => {
    setFormData({
      name: initialBackground.name,
      level_required: initialBackground.level_required.level.toString(),
      points_store: typeof initialBackground.points_store === "number" ? initialBackground.points_store.toString() : initialBackground.points_store || "0",
      image: initialBackground.image || null
    });
    if (initialBackground.image) {
      const imageUrl = initialBackground.image.startsWith("http") || initialBackground.image.startsWith("/") ? initialBackground.image : `${initialBackground.image}`;
      setPreviewImage(imageUrl);
    } else {
      setPreviewImage(null);
    }
  }, [initialBackground]);
  if (!isOpen) return null;
  const { errors, reset } = useForm();
  const [formState, setFormState] = useState({
    level_required: initialBackground.level_required,
    calculated_level: initialBackground.level_required.level.toString()
  });
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      name: initialBackground.name,
      level_required: initialBackground.level_required.level.toString(),
      points_store: typeof initialBackground.points_store === "number" ? initialBackground.points_store.toString() : initialBackground.points_store || "0",
      image: initialBackground.image || null
    }));
  }, [initialBackground]);
  useEffect(() => {
    console.log("Form data updated:", formData);
  }, [formData]);
  const fetchLevels = async () => {
    try {
      const url = "/api/levels";
      console.log("Fetching levels from:", url);
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
      const data = await response.json();
      console.log("Levels API response:", data);
      setLevels(data.levels || []);
    } catch (error) {
      console.error("Error fetching levels:", error);
      setLevels([]);
    }
  };
  useEffect(() => {
    if (isOpen) {
      fetchLevels();
    }
  }, [isOpen]);
  const handleFileChange = (e) => {
    var _a;
    const file = (_a = e.target.files) == null ? void 0 : _a[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file
      }));
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    }
  };
  const handleSubmit = async (e) => {
    var _a;
    e.preventDefault();
    if (!formData.name || !formData.points_store) {
      toast.error("Por favor completa todos los campos requeridos");
      return;
    }
    const selectedLevel = levels.find((level) => level.id === parseInt(formData.level_required));
    if (!selectedLevel) {
      toast.error("Nivel no válido");
      return;
    }
    setIsLoading(true);
    try {
      const formDataToSend = new FormData();
      const csrfToken = ((_a = document.querySelector('meta[name="csrf-token"]')) == null ? void 0 : _a.getAttribute("content")) || "";
      formDataToSend.append("_token", csrfToken);
      formDataToSend.append("_method", "PUT");
      formDataToSend.append("name", formData.name);
      formDataToSend.append("level_required", selectedLevel.level.toString());
      formDataToSend.append("points_store", formData.points_store);
      if (formData.image && typeof formData.image !== "string") {
        formDataToSend.append("image", formData.image);
      }
      const updatedBackground = {
        ...initialBackground,
        name: formData.name,
        level_required: selectedLevel.level,
        level_name: selectedLevel.name,
        points_store: formData.points_store,
        image: typeof formData.image === "string" ? formData.image : initialBackground.image || ""
      };
      const response = await fetch(`/admin/backgrounds/${initialBackground.id}`, {
        method: "POST",
        body: formDataToSend,
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          Accept: "application/json",
          "X-CSRF-TOKEN": csrfToken
        },
        credentials: "include"
      });
      const responseData = await response.json();
      if (response.ok) {
        toast.success(responseData.message || "Fondo actualizado exitosamente");
        window.location.reload();
        if (onSuccess && typeof onSuccess === "function") {
          const updatedData = responseData.data || {};
          onSuccess({
            ...initialBackground,
            ...updatedData,
            name: updatedData.name || initialBackground.name,
            points_store: updatedData.points_store || initialBackground.points_store,
            image: updatedData.image || initialBackground.image,
            level_required: updatedData.level_required || initialBackground.level_required,
            updated_at: updatedData.updated_at || (/* @__PURE__ */ new Date()).toISOString()
          });
        }
        onClose();
      } else {
        toast.error(responseData.message || "Error al actualizar el fondo");
        console.error("Error updating background:", responseData);
      }
    } catch (error) {
      console.error("Error updating background:", error);
      toast.error("Error al procesar la solicitud");
    } finally {
      setIsLoading(false);
    }
  };
  return /* @__PURE__ */ jsx(Dialog, { open: isOpen, onOpenChange: (open) => !open && onClose(), children: /* @__PURE__ */ jsxs(DialogContent, { className: "sm:max-w-[500px]", children: [
    /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { children: "Editar Fondo" }) }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "name", children: "Nombre" }),
        /* @__PURE__ */ jsx(Input, { id: "name", value: formData.name, onChange: (e) => setFormData((prev) => ({ ...prev, name: e.target.value })), required: true }),
        errors.name && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-500", children: errors.name })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "level_required", children: "Nivel Requerido" }),
          /* @__PURE__ */ jsxs(
            "select",
            {
              id: "level_required",
              value: formData.level_required,
              onChange: (e) => {
                setFormData((prev) => ({ ...prev, level_required: e.target.value }));
              },
              className: "border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
              required: true,
              children: [
                /* @__PURE__ */ jsx("option", { value: "", children: "Seleccionar nivel" }),
                levels.map((level) => /* @__PURE__ */ jsxs("option", { value: level.id.toString(), children: [
                  "Nivel ",
                  level.level
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
              value: formData.points_store,
              onChange: (e) => setFormData((prev) => ({ ...prev, points_store: e.target.value })),
              placeholder: "Ej: 50",
              required: true
            }
          ),
          errors.points_store && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-500", children: errors.points_store })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Label, { children: "Imagen del Fondo" }),
        /* @__PURE__ */ jsx("div", { className: "mt-1 flex justify-center rounded-md border-2 border-dashed px-6 pt-5 pb-6", children: /* @__PURE__ */ jsxs("div", { className: "space-y-1 text-center", children: [
          previewImage ? /* @__PURE__ */ jsx("img", { src: previewImage, alt: "Preview", className: "h-32 w-full rounded-md object-cover" }) : /* @__PURE__ */ jsx("svg", { className: "mx-auto h-12 w-12 text-gray-400", stroke: "currentColor", fill: "none", viewBox: "0 0 48 48", children: /* @__PURE__ */ jsx("path", { d: "M28 8H12a4 4 0 00-4 4v20m32-12v8m-4-4h8m-4-4v8m-12 4h.02", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" }) }),
          /* @__PURE__ */ jsxs("div", { className: "flex text-sm text-gray-600", children: [
            /* @__PURE__ */ jsxs(
              Label,
              {
                htmlFor: "image",
                className: "relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 focus-within:outline-none hover:text-indigo-500",
                children: [
                  /* @__PURE__ */ jsx(Input, { id: "image", name: "image", type: "file", accept: "image/*", onChange: handleFileChange, className: "sr-only" }),
                  /* @__PURE__ */ jsx("span", { children: "Cambiar imagen" })
                ]
              }
            ),
            /* @__PURE__ */ jsx("p", { className: "pl-1", children: "o arrastra y suelta" })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500", children: "PNG, JPG, GIF hasta 2MB" })
        ] }) }),
        errors.image && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-500", children: errors.image })
      ] }),
      /* @__PURE__ */ jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsx(Button, { type: "button", variant: "outline", onClick: onClose, disabled: isLoading, children: "Cancelar" }),
        /* @__PURE__ */ jsx(Button, { type: "submit", disabled: isLoading, children: isLoading ? "Actualizando..." : "Actualizar" })
      ] })
    ] })
  ] }) });
}
export {
  EditBackgroundModal
};
