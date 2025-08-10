import { jsx } from "react/jsx-runtime";
import { MatchingResponse } from "./MatchingResponse-CvSLhhHI.js";
import { OrderingResponse } from "./OrderingResponse-Bp_CNo0z.js";
import { SingleChoiceResponse } from "./SingleChoiceResponse-CRhMaAMV.js";
import { TrueFalseResponse } from "./TrueFalseResponse-CV_Af6gm.js";
import "./utils-qggO9Hcn.js";
import "clsx";
import "tailwind-merge";
import "react";
import "lucide-react";
import "./BaseQuestionResponse-CqaGw6lD.js";
function QuestionResponse({
  question,
  response,
  onOptionSelect,
  onReorder,
  onMatchingPairSelect,
  disabled = false,
  onExplanationChange,
  error
}) {
  const questionType = question.application_form_question.question.question_type.id;
  switch (questionType) {
    case 1:
      if (!onOptionSelect) return /* @__PURE__ */ jsx("div", { children: "Error: onOptionSelect no fue proporcionado." });
      return /* @__PURE__ */ jsx(SingleChoiceResponse, { question, selectedOptions: response.selected_options, onOptionSelect, disabled });
    case 2:
      return /* @__PURE__ */ jsx(OrderingResponse, { question, order: response.order || [], onOrderChange: onReorder, disabled });
    case 3:
      return /* @__PURE__ */ jsx(
        MatchingResponse,
        {
          question,
          pairs: response.pairs || {},
          onPairSelect: (leftOptionId, rightOptionId) => onMatchingPairSelect(leftOptionId, rightOptionId),
          disabled
        }
      );
    case 4:
      if (!onOptionSelect) return /* @__PURE__ */ jsx("div", { children: "Error: onOptionSelect no fue proporcionado." });
      return /* @__PURE__ */ jsx(TrueFalseResponse, { question, selectedOptions: response.selected_options, onOptionSelect, disabled });
    case 5:
      return null;
    default:
      return /* @__PURE__ */ jsx("div", { children: "Tipo de pregunta no soportado." });
  }
}
export {
  QuestionResponse
};
