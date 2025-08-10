import { jsx } from "react/jsx-runtime";
import { c as cn } from "./utils-CpIjqAVa.js";
import { BaseQuestionResponse, ResponseOption } from "./BaseQuestionResponse-CJJUo3AV.js";
import "clsx";
import "tailwind-merge";
function TrueFalseResponse({ question, selectedOptions, onOptionSelect, disabled = false }) {
  var _a;
  const options = ((_a = question.application_form_question.question) == null ? void 0 : _a.options) || [];
  const isGraded = question.status === "graded";
  const isOptionCorrect = (optionId) => {
    if (!isGraded) return false;
    return question.selected_options.some(
      (opt) => opt.question_option_id === optionId && opt.is_correct
    );
  };
  const trueOption = options.find((opt) => opt.value.toLowerCase() === "verdadero" || opt.value.toLowerCase() === "true");
  const falseOption = options.find((opt) => opt.value.toLowerCase() === "falso" || opt.value.toLowerCase() === "false");
  const displayOptions = trueOption && falseOption ? [trueOption, falseOption] : options;
  return /* @__PURE__ */ jsx(BaseQuestionResponse, { question, selectedOptions, onOptionSelect, children: /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-3 md:grid-cols-2", children: displayOptions.map((option) => {
    const isSelected = selectedOptions.includes(option.id);
    const isCorrect = isOptionCorrect(option.id);
    const isTrueOption = option.value.toLowerCase() === "verdadero" || option.value.toLowerCase() === "true";
    return /* @__PURE__ */ jsx(
      ResponseOption,
      {
        option: {
          ...option,
          value: isTrueOption ? "Verdadero" : "Falso"
          // Estandarizar texto
        },
        isSelected,
        isCorrect,
        onClick: () => !disabled && onOptionSelect(option.id),
        disabled,
        className: cn(
          "transition-all duration-200",
          isSelected && "ring-primary/30 dark:ring-primary/50 ring-2",
          !disabled && (isTrueOption ? "hover:border-green-300 dark:hover:border-green-700" : "hover:border-red-300 dark:hover:border-red-700")
        )
      },
      option.id
    );
  }) }) });
}
export {
  TrueFalseResponse
};
