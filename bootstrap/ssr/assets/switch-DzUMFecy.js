import { jsxs, jsx } from "react/jsx-runtime";
import { P as Popover, a as PopoverTrigger, b as PopoverContent } from "./popover-5aXgFmPv.js";
import { c as cn } from "./utils-CpIjqAVa.js";
import { XIcon, ChevronDownIcon } from "lucide-react";
import { useRef, useState, useEffect, forwardRef } from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
function MultiSelect({
  options,
  value,
  onChange,
  maxSelections,
  placeholder = "Seleccionar...",
  name,
  id,
  className,
  disabled,
  ...props
}) {
  const triggerRef = useRef(null);
  const [triggerWidth, setTriggerWidth] = useState(void 0);
  useEffect(() => {
    if (triggerRef.current) {
      setTriggerWidth(triggerRef.current.offsetWidth);
    }
  }, []);
  const toggle = (val) => {
    const selected = value.includes(val);
    let next;
    if (selected) {
      next = value.filter((v) => v !== val);
    } else {
      if (maxSelections && value.length >= maxSelections) {
        next = value;
      } else {
        next = [...value, val];
      }
    }
    onChange(next);
  };
  return /* @__PURE__ */ jsxs(Popover, { ...props, children: [
    /* @__PURE__ */ jsx(
      MultiSelectTrigger,
      {
        ref: triggerRef,
        className,
        id,
        value,
        options,
        placeholder,
        toggle,
        disabled
      }
    ),
    /* @__PURE__ */ jsx(
      MultiSelectContent,
      {
        options,
        value,
        toggle,
        triggerWidth,
        maxSelections,
        disabled
      }
    ),
    name && /* @__PURE__ */ jsx("input", { type: "hidden", name, id, value: JSON.stringify(value) })
  ] });
}
const MultiSelectTrigger = forwardRef(
  ({ className, id, value, options, placeholder, disabled, toggle }, ref) => {
    return /* @__PURE__ */ jsx(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(
      "div",
      {
        ref,
        id,
        className: cn(
          "border-input flex min-h-9 w-full items-center justify-between rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none",
          value.length === 0 ? "text-muted-foreground" : "",
          className
        ),
        "aria-haspopup": "listbox",
        "aria-expanded": "false",
        "aria-labelledby": id,
        role: "button",
        tabIndex: 0,
        children: [
          /* @__PURE__ */ jsx("div", { className: "flex min-w-0 flex-1 flex-wrap gap-1", children: value.length > 0 ? value.map((v) => {
            const opt = options.find((o) => o.value === v);
            return /* @__PURE__ */ jsxs("span", { className: "bg-muted flex items-center gap-1 rounded px-2 py-1 text-xs", children: [
              opt == null ? void 0 : opt.label,
              /* @__PURE__ */ jsx(
                "span",
                {
                  role: "button",
                  tabIndex: 0,
                  onClick: (e) => {
                    e.stopPropagation();
                    toggle(v);
                  },
                  onKeyDown: (e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      toggle(v);
                    }
                  },
                  className: "ml-1 flex cursor-pointer items-center justify-center rounded hover:bg-red-200 dark:hover:bg-red-700",
                  "aria-label": `Quitar ${opt == null ? void 0 : opt.label}`,
                  children: /* @__PURE__ */ jsx(XIcon, { className: "size-4 text-red-600" })
                }
              )
            ] }, v);
          }) : placeholder }),
          /* @__PURE__ */ jsx(ChevronDownIcon, { className: "size-4 opacity-50" })
        ]
      }
    ) });
  }
);
MultiSelectTrigger.displayName = "MultiSelectTrigger";
function MultiSelectContent({ options, value, toggle, triggerWidth, maxSelections, disabled }) {
  const reachedMax = maxSelections !== void 0 && value.length >= maxSelections;
  return /* @__PURE__ */ jsx(
    PopoverContent,
    {
      style: { width: triggerWidth },
      className: "bg-popover z-50 max-h-60 overflow-auto rounded-md border p-2 shadow-md",
      side: "bottom",
      align: "start",
      children: options.map((opt) => {
        const isSelected = value.includes(opt.value);
        const isDisabled = disabled || reachedMax && !isSelected;
        return /* @__PURE__ */ jsx(
          "label",
          {
            className: cn(
              "flex items-center justify-between gap-2 rounded px-2 py-1 text-sm select-none",
              isSelected ? "bg-accent text-accent-foreground" : "hover:bg-muted",
              isDisabled && "cursor-not-allowed opacity-50"
            ),
            children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "checkbox",
                  checked: isSelected,
                  onChange: () => toggle(opt.value),
                  className: cn(isDisabled ? "cursor-not-allowed" : ""),
                  disabled: isDisabled
                }
              ),
              opt.label
            ] })
          },
          opt.value
        );
      })
    }
  );
}
function Switch({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    SwitchPrimitive.Root,
    {
      "data-slot": "switch",
      className: cn(
        "peer data-[state=checked]:bg-primary data-[state=unchecked]:bg-input focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsx(
        SwitchPrimitive.Thumb,
        {
          "data-slot": "switch-thumb",
          className: cn(
            "bg-background dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground pointer-events-none block size-4 rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0"
          )
        }
      )
    }
  );
}
export {
  MultiSelect as M,
  Switch as S
};
