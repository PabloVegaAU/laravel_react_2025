import { jsxs, jsx } from "react/jsx-runtime";
import { I as InputError } from "./input-error-BCtMt8Ki.js";
import { B as Button } from "./button-BqjjxT-O.js";
import { I as Input } from "./input-B1uJ3yMO.js";
import { Check, X } from "lucide-react";
import "./utils-qggO9Hcn.js";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-slot";
import "class-variance-authority";
function BaseQuestionType({
  options,
  title,
  addButtonText,
  minOptions = 2,
  error,
  onAddOption,
  onRemoveOption,
  onUpdateOption,
  onSetCorrect,
  children,
  disabled = false,
  showCorrectOption = false
}) {
  const canAddMore = options.length === 0 || options.every((opt) => opt.value.trim() !== "");
  return /* @__PURE__ */ jsxs("div", { className: "text-foreground flex flex-col gap-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
      /* @__PURE__ */ jsx("h4", { className: "text-sm font-medium", children: title }),
      /* @__PURE__ */ jsx(InputError, { message: error })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-3", children: options.map((option, index) => /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2", children: [
      showCorrectOption && onSetCorrect && /* @__PURE__ */ jsxs(
        Button,
        {
          type: "button",
          variant: option.is_correct ? "default" : "outline",
          size: "icon",
          onClick: () => onSetCorrect(index),
          disabled,
          className: `h-9 w-9 shrink-0 transition-colors ${option.is_correct ? "bg-green-600 text-white hover:bg-green-700" : "hover:bg-muted"}`,
          title: option.is_correct ? "Respuesta correcta" : "Marcar como correcta",
          children: [
            /* @__PURE__ */ jsx(Check, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Marcar como correcta" })
          ]
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsx(
        Input,
        {
          value: option.value,
          onChange: (e) => onUpdateOption(index, e.target.value),
          placeholder: `Opción ${index + 1}`,
          className: "w-full",
          disabled
        }
      ) }),
      options.length > minOptions && /* @__PURE__ */ jsxs(
        Button,
        {
          type: "button",
          variant: "ghost",
          size: "icon",
          onClick: () => onRemoveOption(index),
          disabled,
          className: "text-destructive hover:bg-destructive/10 hover:text-destructive dark:hover:bg-destructive/20 h-9 w-9 shrink-0",
          title: "Eliminar opción",
          children: [
            /* @__PURE__ */ jsx(X, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Eliminar opción" })
          ]
        }
      )
    ] }, index)) }),
    /* @__PURE__ */ jsx("div", { className: "mt-2", children: /* @__PURE__ */ jsx(Button, { type: "button", variant: "outline", size: "sm", onClick: onAddOption, disabled: !canAddMore || disabled, children: addButtonText }) }),
    children && /* @__PURE__ */ jsx("div", { className: "mt-4", children })
  ] });
}
export {
  BaseQuestionType
};
