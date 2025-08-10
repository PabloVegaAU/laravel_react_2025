import { jsxs, jsx } from "react/jsx-runtime";
import { B as Button } from "./button-B8Z_lz_J.js";
import { I as Input } from "./input-Dr5dPtfm.js";
import { GripVertical, X } from "lucide-react";
import { useState, useRef } from "react";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./utils-CpIjqAVa.js";
import "clsx";
import "tailwind-merge";
function OrderingOptions({ options, onChange, disabled = false }) {
  const [draggedItem, setDraggedItem] = useState(null);
  const dragOverItem = useRef(null);
  const handleAddOption = () => {
    const newOption = {
      value: `Opción ${options.length + 1}`,
      is_correct: true,
      order: options.length,
      correct_order: options.length,
      pair_key: null,
      pair_side: null,
      score: 1
    };
    onChange([...options, newOption]);
  };
  const handleRemoveOption = (index) => {
    const newOptions = options.filter((_, i) => i !== index);
    const updatedOptions = newOptions.map((opt, i) => ({
      ...opt,
      order: i,
      correct_order: i
    }));
    onChange(updatedOptions);
  };
  const handleUpdateOption = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = {
      ...newOptions[index],
      value,
      order: index,
      correct_order: index
    };
    onChange(newOptions);
  };
  const handleDragStart = (e, index) => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", e.currentTarget.innerHTML);
  };
  const handleDragOver = (e, index) => {
    e.preventDefault();
    dragOverItem.current = index;
  };
  const handleDrop = (e, index) => {
    e.preventDefault();
    if (draggedItem === null || dragOverItem.current === null) return;
    const newOptions = [...options];
    const draggedOption = newOptions[draggedItem];
    newOptions.splice(draggedItem, 1);
    newOptions.splice(dragOverItem.current, 0, draggedOption);
    const updatedOptions = newOptions.map((opt, i) => ({
      ...opt,
      order: i,
      correct_order: i
    }));
    onChange(updatedOptions);
    setDraggedItem(null);
    dragOverItem.current = null;
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsx("div", { className: "space-y-3", children: options.map((option, index) => /* @__PURE__ */ jsxs(
      "div",
      {
        draggable: !disabled,
        onDragStart: (e) => handleDragStart(e, index),
        onDragOver: (e) => handleDragOver(e, index),
        onDrop: (e) => handleDrop(e),
        className: `flex items-center gap-2 rounded-md border p-2 transition-colors ${draggedItem === index ? "opacity-50" : ""} dark:border-gray-700 dark:bg-gray-800/50 dark:hover:bg-gray-800/70`,
        children: [
          /* @__PURE__ */ jsx(GripVertical, { className: "text-muted-foreground dark:text-foreground/70 h-4 w-4 cursor-move" }),
          /* @__PURE__ */ jsxs("span", { className: "text-muted-foreground text-sm font-medium", children: [
            index + 1,
            "."
          ] }),
          /* @__PURE__ */ jsx(
            Input,
            {
              value: option.value,
              onChange: (e) => handleUpdateOption(index, e.target.value),
              placeholder: `Opción ${index + 1}`,
              disabled,
              className: "flex-1"
            }
          ),
          /* @__PURE__ */ jsxs(
            Button,
            {
              type: "button",
              variant: "ghost",
              size: "icon",
              onClick: () => handleRemoveOption(index),
              disabled: disabled || options.length <= 2,
              className: "text-destructive hover:bg-destructive/10 hover:text-destructive dark:hover:bg-destructive/20 h-9 w-9",
              children: [
                /* @__PURE__ */ jsx(X, { className: "h-4 w-4" }),
                /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Eliminar opción" })
              ]
            }
          )
        ]
      },
      index
    )) }),
    /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
      Button,
      {
        type: "button",
        variant: "outline",
        size: "sm",
        onClick: handleAddOption,
        disabled,
        className: "dark:border-input dark:hover:bg-accent dark:hover:text-accent-foreground",
        children: "Agregar opción"
      }
    ) }),
    options.length < 2 && /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm", children: "Agrega al menos 2 opciones para continuar" })
  ] });
}
export {
  OrderingOptions
};
