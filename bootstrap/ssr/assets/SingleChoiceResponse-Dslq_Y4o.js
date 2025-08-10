import { jsx } from "react/jsx-runtime";
import { BaseQuestionResponse, ResponseOption } from "./BaseQuestionResponse-CJJUo3AV.js";
import "./utils-CpIjqAVa.js";
import "clsx";
import "tailwind-merge";
function SingleChoiceResponse({ question, selectedOptions, onOptionSelect, disabled = false }) {
  var _a;
  const options = ((_a = question.application_form_question.question) == null ? void 0 : _a.options) || [];
  return /* @__PURE__ */ jsx(BaseQuestionResponse, { question, selectedOptions, onOptionSelect, children: /* @__PURE__ */ jsx("div", { className: "space-y-3", children: options.map((option) => {
    const isSelected = selectedOptions.includes(option.id);
    return /* @__PURE__ */ jsx(
      ResponseOption,
      {
        option,
        isSelected,
        onClick: () => onOptionSelect(option.id),
        disabled
      },
      option.id
    );
  }) }) });
}
export {
  SingleChoiceResponse
};
