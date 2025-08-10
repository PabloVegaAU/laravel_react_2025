import { jsxs, jsx } from "react/jsx-runtime";
import { BaseQuestionResponse, ResponseOption } from "./BaseQuestionResponse-CqaGw6lD.js";
import "./utils-qggO9Hcn.js";
import "clsx";
import "tailwind-merge";
function SingleChoiceResponse({ question, selectedOptions, onOptionSelect, disabled = false }) {
  var _a;
  const options = ((_a = question.application_form_question.question) == null ? void 0 : _a.options) || [];
  return /* @__PURE__ */ jsxs(BaseQuestionResponse, { question, selectedOptions, onOptionSelect, children: [
    /* @__PURE__ */ jsx("div", { className: "space-y-3", children: options.map((option) => {
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
    }) }),
    question.explanation && /* @__PURE__ */ jsxs("div", { className: "mt-4 rounded-md bg-blue-50 p-4 text-sm text-blue-800", children: [
      /* @__PURE__ */ jsx("p", { className: "font-medium", children: "Tu explicación:" }),
      /* @__PURE__ */ jsx("p", { className: "mt-1", children: question.explanation })
    ] })
  ] });
}
export {
  SingleChoiceResponse
};
