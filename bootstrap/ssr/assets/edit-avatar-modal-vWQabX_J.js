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
function EditAvatarModal({ isOpen, onClose, avatar: initialAvatar, onSuccess }) {
  var _a;
  const [previewImage, setPreviewImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [avatar, setAvatar] = useState(initialAvatar);
  const [levels, setLevels] = useState([]);
  useEffect(() => {
    setAvatar(initialAvatar);
  }, [initialAvatar]);
  if (!isOpen || !avatar) return null;
  const { data, setData, errors, reset } = useForm({
    name: avatar.name || "",
    price: typeof avatar.price === "string" ? parseFloat(avatar.price) : avatar.price || 0,
    is_active: avatar.is_active ?? true,
    image_url: null,
    required_level_id: ((_a = avatar.required_level) == null ? void 0 : _a.id) ?? avatar.level_required ?? null,
    _method: "PUT"
  });
  useEffect(() => {
    var _a2;
    if (avatar) {
      setData({
        name: avatar.name,
        price: typeof avatar.price === "string" ? parseFloat(avatar.price) : avatar.price || 0,
        is_active: avatar.is_active ?? true,
        image_url: null,
        required_level_id: ((_a2 = avatar.required_level) == null ? void 0 : _a2.id) ?? avatar.level_required ?? null,
        _method: "PUT"
      });
      setPreviewImage(avatar.image_url ? avatar.image_url : null);
    }
  }, [avatar, setData]);
  useEffect(() => {
    if (!isOpen) return;
    const fetchLevels = async () => {
      try {
        const res = await fetch("/api/levels", {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "X-Requested-With": "XMLHttpRequest"
          },
          credentials: "include"
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        setLevels(Array.isArray(json == null ? void 0 : json.levels) ? json.levels : []);
      } catch (err) {
        console.error("Error fetching levels:", err);
        setLevels([]);
      }
    };
    fetchLevels();
  }, [isOpen]);
  const handleFileChange = (e) => {
    var _a2;
    const file = (_a2 = e.target.files) == null ? void 0 : _a2[0];
    if (file) {
      setData("image_url", file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    }
  };
  const onSubmit = async (e) => {
    var _a2;
    e.preventDefault();
    if (!avatar) {
      toast.error("Error cargando información del avatar");
      onClose();
      return;
    }
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("price", data.price.toString());
      formData.append("is_active", data.is_active ? "1" : "0");
      formData.append("_method", "PUT");
      if (data.required_level_id) {
        formData.append("level_required", data.required_level_id.toString());
        formData.append("required_level_id", data.required_level_id.toString());
      } else {
        formData.append("level_required", "");
        formData.append("required_level_id", "");
      }
      if (data.image_url instanceof File) {
        formData.append("image_url", data.image_url);
      }
      const csrfToken = ((_a2 = document.querySelector('meta[name="csrf-token"]')) == null ? void 0 : _a2.getAttribute("content")) || "";
      const response = await fetch(`/admin/avatars/${avatar.id}`, {
        method: "POST",
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          "X-CSRF-TOKEN": csrfToken,
          Accept: "application/json"
        },
        body: formData
      });
      const responseData = await response.json().catch(() => ({}));
      if (!response.ok) {
        if (responseData == null ? void 0 : responseData.errors) {
          Object.values(responseData.errors).flat().forEach((msg) => toast.error(String(msg)));
          return;
        }
        throw new Error((responseData == null ? void 0 : responseData.message) || "Error actualizando avatar");
      }
      const avatarData = responseData.avatar || responseData;
      toast.success("Avatar actualizado correctamente");
      const updatedAvatar = {
        ...avatar,
        id: avatarData.id ?? avatar.id,
        name: avatarData.name ?? avatar.name,
        price: avatarData.price ?? avatar.price,
        is_active: avatarData.is_active ?? avatar.is_active ?? true,
        image_url: avatarData.image_url ?? avatar.image_url,
        required_level: avatarData.required_level ?? avatar.required_level,
        updated_at: avatarData.updated_at || (/* @__PURE__ */ new Date()).toISOString()
      };
      onSuccess(updatedAvatar);
      onClose();
    } catch (error) {
      console.error("Error actualizando avatar:", error);
      toast.error((error == null ? void 0 : error.message) || "Error actualizando avatar");
    } finally {
      setIsLoading(false);
    }
  };
  return /* @__PURE__ */ jsx(Dialog, { open: isOpen, onOpenChange: (open) => !open && onClose(), children: /* @__PURE__ */ jsxs(DialogContent, { className: "sm:max-w-[500px]", children: [
    /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { children: "Editar Avatar" }) }),
    /* @__PURE__ */ jsxs("form", { onSubmit, className: "space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "name", children: "Nombre *" }),
        /* @__PURE__ */ jsx(Input, { id: "name", value: data.name, onChange: (e) => setData("name", e.target.value), required: true }),
        errors.name && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-500", children: errors.name })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "price", children: "Precio *" }),
        /* @__PURE__ */ jsx("div", { className: "relative mt-1 rounded-md shadow-sm", children: /* @__PURE__ */ jsx(
          Input,
          {
            id: "price",
            type: "number",
            min: "0",
            step: "0.01",
            value: data.price,
            onChange: (e) => setData("price", parseFloat(e.target.value) || 0),
            className: "pl-7",
            required: true
          }
        ) }),
        errors.price && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-500", children: errors.price })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "required_level_id", children: "Nivel requerido" }),
        /* @__PURE__ */ jsxs(
          "select",
          {
            id: "required_level_id",
            value: data.required_level_id ?? "",
            onChange: (e) => setData("required_level_id", e.target.value ? parseInt(e.target.value) : null),
            className: "border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
            children: [
              /* @__PURE__ */ jsx("option", { value: "", children: "Ninguno (Disponible para todos los niveles)" }),
              levels.map((level) => /* @__PURE__ */ jsxs("option", { value: level.id, children: [
                "Nivel ",
                level.level,
                " - ",
                level.name
              ] }, level.id))
            ]
          }
        ),
        (errors.required_level_id || errors.level_required) && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-500", children: errors.required_level_id || errors.level_required })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "checkbox",
            id: "is_active",
            checked: data.is_active,
            onChange: (e) => setData("is_active", e.target.checked),
            className: "h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          }
        ),
        /* @__PURE__ */ jsx(Label, { htmlFor: "is_active", className: "text-sm font-medium text-gray-700", children: "Activo" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Label, { children: "Imagen del Avatar" }),
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
            /* @__PURE__ */ jsxs(
              Label,
              {
                htmlFor: "image_url",
                className: "relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 focus-within:outline-none hover:text-indigo-500",
                children: [
                  /* @__PURE__ */ jsx(Input, { id: "image_url", name: "image_url", type: "file", accept: "image/*", onChange: handleFileChange, className: "sr-only" }),
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
  EditAvatarModal
};
