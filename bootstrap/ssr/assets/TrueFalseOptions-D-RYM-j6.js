import { jsx, jsxs } from "react/jsx-runtime";
import { L as Label } from "./label-GjpnCFkz.js";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { CircleIcon } from "lucide-react";
import { c as cn } from "./utils-CpIjqAVa.js";
import "@radix-ui/react-label";
import "clsx";
import "tailwind-merge";
function RadioGroup({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    RadioGroupPrimitive.Root,
    {
      "data-slot": "radio-group",
      className: cn("grid gap-3", className),
      ...props
    }
  );
}
function RadioGroupItem({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    RadioGroupPrimitive.Item,
    {
      "data-slot": "radio-group-item",
      className: cn(
        "border-input text-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 aspect-square size-4 shrink-0 rounded-full border shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsx(
        RadioGroupPrimitive.Indicator,
        {
          "data-slot": "radio-group-indicator",
          className: "relative flex items-center justify-center",
          children: /* @__PURE__ */ jsx(CircleIcon, { className: "fill-primary absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2" })
        }
      )
    }
  );
}
function TrueFalseOptions({ options, onChange, disabled = false }) {
  const handleSetCorrect = (isTrueCorrect) => {
    const trueOption2 = {
      value: "Verdadero",
      is_correct: isTrueCorrect,
      order: 0,
      correct_order: 0,
      pair_key: null,
      pair_side: null,
      score: isTrueCorrect ? 1 : 0
    };
    const falseOption2 = {
      value: "Falso",
      is_correct: !isTrueCorrect,
      order: 1,
      correct_order: 1,
      pair_key: null,
      pair_side: null,
      score: !isTrueCorrect ? 1 : 0
    };
    onChange([trueOption2, falseOption2]);
  };
  if (options.length === 0) {
    handleSetCorrect(true);
    return null;
  }
  const trueOption = options.find((opt) => opt.value === "Verdadero");
  options.find((opt) => opt.value === "Falso");
  const currentCorrect = (trueOption == null ? void 0 : trueOption.is_correct) ? "true" : "false";
  return /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsx("h4", { className: "text-sm font-medium", children: "Selecciona la respuesta correcta" }),
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm", children: "Marca cuál de las dos opciones es la respuesta correcta." })
    ] }),
    /* @__PURE__ */ jsxs(RadioGroup, { value: currentCorrect, onValueChange: (value) => handleSetCorrect(value === "true"), className: "space-y-3", disabled, children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
        /* @__PURE__ */ jsx(
          RadioGroupItem,
          {
            value: "true",
            id: "true-option",
            className: "data-[state=checked]:border-green-600 data-[state=checked]:bg-green-600 data-[state=checked]:text-white"
          }
        ),
        /* @__PURE__ */ jsx(Label, { htmlFor: "true-option", className: "text-foreground text-base font-normal", children: "Verdadero" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
        /* @__PURE__ */ jsx(
          RadioGroupItem,
          {
            value: "false",
            id: "false-option",
            className: "data-[state=checked]:border-green-600 data-[state=checked]:bg-green-600 data-[state=checked]:text-white"
          }
        ),
        /* @__PURE__ */ jsx(Label, { htmlFor: "false-option", className: "text-foreground text-base font-normal", children: "Falso" })
      ] })
    ] })
  ] });
}
export {
  TrueFalseOptions
};
