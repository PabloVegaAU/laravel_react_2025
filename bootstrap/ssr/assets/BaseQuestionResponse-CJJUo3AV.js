import { jsxs, jsx } from "react/jsx-runtime";
import { c as cn } from "./utils-CpIjqAVa.js";
import "clsx";
import "tailwind-merge";
function ResponseOption({ option, isSelected, isCorrect = false, onClick, disabled = false, className = "" }) {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      onClick: !disabled ? onClick : void 0,
      className: cn(
        "flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors",
        isSelected ? "border-primary bg-primary/5 hover:bg-primary/10 dark:border-primary/50 dark:bg-primary/10 dark:hover:bg-primary/20 dark:text-white" : "border-gray-200 bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700",
        disabled && "cursor-not-allowed opacity-70",
        className
      ),
      children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            className: cn(
              "flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border",
              isSelected ? "border-primary bg-primary/10" : "border-gray-300 bg-white"
            ),
            children: isSelected && /* @__PURE__ */ jsx("div", { className: cn("h-3 w-3 rounded-full", "bg-primary") })
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "flex-1", children: option.value })
      ]
    }
  );
}
function BaseQuestionResponse({ question, selectedOptions, onOptionSelect, children, className = "" }) {
  return /* @__PURE__ */ jsx("div", { className: cn("space-y-4", className), children });
}
export {
  BaseQuestionResponse,
  ResponseOption
};
