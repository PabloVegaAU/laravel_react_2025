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
function EditPrizeModal({ isOpen, onClose, prize: initialPrize, onSuccess }) {
  var _a, _b, _c;
  const [previewImage, setPreviewImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [prize, setPrize] = useState(initialPrize);
  const [levels, setLevels] = useState([]);
  useEffect(() => {
    setPrize(initialPrize);
  }, [initialPrize]);
  if (!isOpen || !prize) return null;
  const { data, setData, errors, setError } = useForm({
    name: prize.name || "",
    description: prize.description || "",
    points_cost: ((_a = prize.points_cost) == null ? void 0 : _a.toString()) || "0",
    stock: ((_b = prize.stock) == null ? void 0 : _b.toString()) || "1",
    available_until: prize.available_until || "",
    is_active: prize.is_active ?? true,
    image: null,
    level_required_id: ((_c = prize.required_level) == null ? void 0 : _c.id) ?? prize.level_required ?? null,
    // 👈 inicialización flexible
    _method: "PUT"
  });
  useEffect(() => {
    var _a2;
    if (prize) {
      setData({
        name: prize.name,
        description: prize.description || "",
        points_cost: prize.points_cost.toString(),
        stock: prize.stock.toString(),
        available_until: prize.available_until || "",
        is_active: prize.is_active,
        image: null,
        level_required_id: ((_a2 = prize.required_level) == null ? void 0 : _a2.id) ?? prize.level_required ?? null,
        _method: "PUT"
      });
      if (prize.image && typeof prize.image === "string") {
        const imageUrl = prize.image.startsWith("http") || prize.image.startsWith("/") ? prize.image : `${prize.image}`;
        setPreviewImage(imageUrl);
      } else {
        setPreviewImage(null);
      }
    }
  }, [prize, setData]);
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
      setData("image", file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    }
  };
  const onSubmit = async (e) => {
    var _a2;
    e.preventDefault();
    if (!prize) {
      toast.error("No se pudo cargar la información del premio");
      onClose();
      return;
    }
    setIsLoading(true);
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("points_cost", data.points_cost);
    formData.append("stock", data.stock);
    if (data.available_until) {
      formData.append("available_until", data.available_until);
    }
    formData.append("is_active", data.is_active ? "1" : "0");
    formData.append("_method", "PUT");
    if (data.image) {
      formData.append("image", data.image);
    }
    formData.append("level_required", ((_a2 = data.level_required_id) == null ? void 0 : _a2.toString()) || "");
    router.post(`/admin/prizes/${prize.id}`, formData, {
      onSuccess: (response) => {
        const prizeData = response.props.prize || response;
        const updatedPrize = {
          ...prize,
          id: (prizeData == null ? void 0 : prizeData.id) ?? prize.id,
          name: (prizeData == null ? void 0 : prizeData.name) ?? prize.name,
          description: (prizeData == null ? void 0 : prizeData.description) ?? prize.description,
          points_cost: (prizeData == null ? void 0 : prizeData.points_cost) ?? prize.points_cost,
          stock: (prizeData == null ? void 0 : prizeData.stock) ?? prize.stock,
          available_until: (prizeData == null ? void 0 : prizeData.available_until) ?? prize.available_until ?? null,
          is_active: (prizeData == null ? void 0 : prizeData.is_active) ?? prize.is_active,
          image: (prizeData == null ? void 0 : prizeData.image) || prize.image || "",
          created_at: prizeData.created_at || prize.created_at,
          updated_at: prizeData.updated_at || (/* @__PURE__ */ new Date()).toISOString(),
          level_required: (prizeData == null ? void 0 : prizeData.level_required) ?? prize.level_required ?? null,
          required_level: (prizeData == null ? void 0 : prizeData.required_level) ?? prize.required_level ?? null
        };
        toast.success("Premio actualizado exitosamente");
        onClose();
        onSuccess(updatedPrize);
      },
      onError: (error) => {
        toast.error(error.message || "Error al actualizar el premio");
      },
      onFinish: () => {
        setIsLoading(false);
      }
    });
  };
  return /* @__PURE__ */ jsx(Dialog, { open: isOpen, onOpenChange: (open) => !open && onClose(), children: /* @__PURE__ */ jsxs(DialogContent, { className: "sm:max-w-[500px]", children: [
    /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { children: "Editar Premio" }) }),
    /* @__PURE__ */ jsxs("form", { onSubmit, className: "space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "name", children: "Nombre *" }),
        /* @__PURE__ */ jsx(Input, { id: "name", value: data.name, onChange: (e) => setData("name", e.target.value), required: true }),
        errors.name && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-500", children: errors.name })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "description", children: "Descripción" }),
        /* @__PURE__ */ jsx(Input, { id: "description", value: data.description, onChange: (e) => setData("description", e.target.value) }),
        errors.description && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-500", children: errors.description })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "points_cost", children: "Costo en puntos *" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "points_cost",
              type: "number",
              min: "0",
              value: data.points_cost,
              onChange: (e) => setData("points_cost", e.target.value),
              required: true
            }
          ),
          errors.points_cost && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-500", children: errors.points_cost })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "stock", children: "Cantidad disponible *" }),
          /* @__PURE__ */ jsx(Input, { id: "stock", type: "number", min: "0", value: data.stock, onChange: (e) => setData("stock", e.target.value), required: true }),
          errors.stock && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-500", children: errors.stock })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "level_required_id", children: "Nivel requerido" }),
        /* @__PURE__ */ jsx(
          "select",
          {
            id: "level_required_id",
            value: data.level_required_id ?? "",
            onChange: (e) => setData("level_required_id", e.target.value ? parseInt(e.target.value) : null),
            className: "border-input bg-background ring-offset-background flex h-10 w-full rounded-md border px-3 py-2 text-sm",
            children: levels.map((level) => /* @__PURE__ */ jsxs("option", { value: level.id, children: [
              "Nivel ",
              level.level,
              " - ",
              level.name
            ] }, level.id))
          }
        ),
        errors.level_required && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-500", children: errors.level_required })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", style: { display: "none" }, children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "available_until", children: "Disponible hasta" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            id: "available_until",
            type: "datetime-local",
            value: data.available_until,
            onChange: (e) => setData("available_until", e.target.value)
          }
        ),
        errors.available_until && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-500", children: errors.available_until })
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
            /* @__PURE__ */ jsxs("label", { htmlFor: "file-upload-edit", className: "relative cursor-pointer text-indigo-600 hover:text-indigo-500", children: [
              /* @__PURE__ */ jsx("span", { children: "Cambiar imagen" }),
              /* @__PURE__ */ jsx("input", { id: "file-upload-edit", type: "file", className: "sr-only", onChange: handleFileChange, accept: "image/*" })
            ] }),
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
  EditPrizeModal
};
