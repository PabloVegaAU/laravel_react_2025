import { jsxs, jsx } from "react/jsx-runtime";
import { B as Button } from "./button-BqjjxT-O.js";
import { I as Input } from "./input-B1uJ3yMO.js";
import { Link2, X } from "lucide-react";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./utils-qggO9Hcn.js";
import "clsx";
import "tailwind-merge";
function MatchingOptions({ options, onChange, disabled = false }) {
  const handleAddPair = () => {
    const pairIndex = Math.floor(options.length / 2);
    const newOptions = [
      ...options,
      {
        value: `Opción ${String.fromCharCode(65 + pairIndex)}`,
        is_correct: true,
        order: options.length,
        correct_order: 0,
        pair_key: `${pairIndex + 1}`,
        pair_side: "left",
        score: 1
      },
      {
        value: `Opción ${pairIndex + 1}`,
        is_correct: true,
        order: options.length + 1,
        correct_order: 1,
        pair_key: `${pairIndex + 1}`,
        pair_side: "right",
        score: 1
      }
    ];
    onChange(newOptions);
  };
  const handleRemovePair = (pairIndex) => {
    const firstIndex = pairIndex * 2;
    const newOptions = options.filter((_, i) => i < firstIndex || i > firstIndex + 1);
    const updatedOptions = newOptions.map((opt, i) => {
      const newPairIndex = Math.floor(i / 2) + 1;
      const isLeft = i % 2 === 0;
      return {
        ...opt,
        order: i,
        pair_key: `${newPairIndex}`,
        pair_side: isLeft ? "left" : "right",
        value: isLeft ? `Opción ${String.fromCharCode(65 + Math.floor(i / 2))}` : `Opción ${Math.floor(i / 2) + 1}`
      };
    });
    onChange(updatedOptions);
  };
  const handleUpdateOption = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = {
      ...newOptions[index],
      value,
      order: index
    };
    onChange(newOptions);
  };
  const pairs = [];
  for (let i = 0; i < options.length; i += 2) {
    pairs.push([options[i], options[i + 1]]);
  }
  return /* @__PURE__ */ jsxs("div", { className: "text-foreground space-y-6", children: [
    /* @__PURE__ */ jsx("div", { className: "space-y-4", children: pairs.map(([left, right], pairIndex) => /* @__PURE__ */ jsx("div", { className: "flex items-center gap-4", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-1 items-center gap-2", children: [
      /* @__PURE__ */ jsx(
        Input,
        {
          value: (left == null ? void 0 : left.value) || "",
          onChange: (e) => handleUpdateOption(pairIndex * 2, e.target.value),
          placeholder: `Opción ${String.fromCharCode(65 + pairIndex)}`,
          disabled,
          className: "w-full"
        }
      ),
      /* @__PURE__ */ jsx(Link2, { className: "text-muted-foreground dark:text-foreground/70 h-4 w-4 flex-shrink-0" }),
      /* @__PURE__ */ jsx(
        Input,
        {
          value: (right == null ? void 0 : right.value) || "",
          onChange: (e) => handleUpdateOption(pairIndex * 2 + 1, e.target.value),
          placeholder: `Opción ${pairIndex + 1}`,
          disabled,
          className: "w-full"
        }
      ),
      /* @__PURE__ */ jsxs(
        Button,
        {
          type: "button",
          variant: "ghost",
          size: "icon",
          onClick: () => handleRemovePair(pairIndex),
          disabled,
          className: "text-destructive hover:bg-destructive/10 hover:text-destructive dark:hover:bg-destructive/20 h-9 w-9 shrink-0",
          children: [
            /* @__PURE__ */ jsx(X, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Eliminar par" })
          ]
        }
      )
    ] }) }, pairIndex)) }),
    /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
      Button,
      {
        type: "button",
        variant: "outline",
        className: "dark:border-input dark:hover:bg-accent dark:hover:text-accent-foreground",
        size: "sm",
        onClick: handleAddPair,
        disabled: disabled || pairs.some((pair) => {
          var _a, _b;
          return !((_a = pair[0]) == null ? void 0 : _a.value) || !((_b = pair[1]) == null ? void 0 : _b.value);
        }),
        children: "Agregar par"
      }
    ) }),
    pairs.length < 2 && /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm", children: "Agrega al menos 2 pares para continuar" })
  ] });
}
export {
  MatchingOptions
};
