import { jsxs, jsx } from "react/jsx-runtime";
import { I as InputError } from "./input-error-BCtMt8Ki.js";
import { F as FlashMessages } from "./flash-messages-Brq5Zd2U.js";
import { B as Badge } from "./badge-DIxTRnmV.js";
import { B as Button } from "./button-BqjjxT-O.js";
import { C as Card, a as CardHeader, b as CardTitle, c as CardContent } from "./card-BgnygZAf.js";
import { I as Input } from "./input-B1uJ3yMO.js";
import { A as AppLayout } from "./app-layout-BsERFbVR.js";
import { c as cn, g as getNestedError } from "./utils-qggO9Hcn.js";
import { useForm, Head } from "@inertiajs/react";
import { QuestionResponse } from "./QuestionResponse-DANEXV-o.js";
import "react";
import "sonner";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "lucide-react";
import "@radix-ui/react-dialog";
import "@radix-ui/react-tooltip";
import "./useUserStore-Db9ma-Ts.js";
import "zustand";
import "zustand/middleware";
import "./app-logo-icon-ZHVQJC4L.js";
import "./image-Bmp5thdH.js";
import "@radix-ui/react-dropdown-menu";
import "@radix-ui/react-avatar";
import "@tanstack/react-query";
import "clsx";
import "tailwind-merge";
import "./MatchingResponse-CvSLhhHI.js";
import "./OrderingResponse-Bp_CNo0z.js";
import "./SingleChoiceResponse-CRhMaAMV.js";
import "./BaseQuestionResponse-CqaGw6lD.js";
import "./TrueFalseResponse-CV_Af6gm.js";
const breadcrumbs = [
  {
    title: "Fichas de aplicación respuesta",
    href: "student/dashboard"
  }
];
function ApplicationFormResponseEdit({ application_form_response }) {
  console.log(application_form_response);
  const initialResponses = application_form_response.response_questions.reduce(
    (acc, responseQuestion) => {
      const { application_form_question, id, explanation } = responseQuestion;
      const selectedOptions = responseQuestion.selected_options || [];
      const questionType = application_form_question.question.question_type.id;
      const selectedOptionIds = selectedOptions.map((opt) => opt.question_option_id).filter(Boolean);
      const response = {
        id,
        application_form_question_id: application_form_question.id,
        question_id: application_form_question.question_id,
        explanation: explanation || "",
        selected_options: selectedOptionIds,
        order: [],
        pairs: {}
      };
      if (questionType === 2) {
        const hasOrder = selectedOptions.some((opt) => opt.selected_order !== null);
        let orderedOptions = [];
        if (hasOrder) {
          orderedOptions = [...selectedOptions].sort((a, b) => (a.selected_order ?? 0) - (b.selected_order ?? 0));
        } else {
          orderedOptions = [...selectedOptions].sort((a, b) => (a.id || 0) - (b.id || 0));
          if (orderedOptions.length > 0) {
            response.order = orderedOptions.map((opt) => opt.question_option_id);
            response.selected_options = [...response.order];
          }
        }
      } else if (questionType === 3) {
        const pairs = {};
        selectedOptions.forEach((opt) => {
          if (opt.paired_with_option_id) {
            pairs[opt.question_option_id] = opt.paired_with_option_id;
            if (!response.selected_options.includes(opt.question_option_id)) {
              response.selected_options.push(opt.question_option_id);
            }
            if (!response.selected_options.includes(opt.paired_with_option_id)) {
              response.selected_options.push(opt.paired_with_option_id);
            }
          }
        });
        response.pairs = pairs;
      }
      acc[responseQuestion.application_form_question_id] = response;
      return acc;
    },
    {}
  );
  const { data, setData, put, errors, processing } = useForm({
    responses: initialResponses
  });
  const updateResponse = (questionId, newResponse) => {
    const currentResponses = data.responses || {};
    const currentResponse = data.responses && data.responses[questionId] || {
      selected_options: [],
      pairs: {}
    };
    const updatedResponses = {
      ...currentResponses,
      [questionId]: {
        ...currentResponse,
        ...newResponse
      }
    };
    setData("responses", updatedResponses);
  };
  const handleMatchingPairSelect = (application_form_question_id, leftId, rightId) => {
    if (!(data == null ? void 0 : data.responses)) return;
    const responseEntry = Object.entries(data.responses).find(([_, r]) => r.application_form_question_id === application_form_question_id);
    if (!responseEntry) return;
    const [responseKey, currentResponse] = responseEntry;
    const currentPairs = currentResponse.pairs ? { ...currentResponse.pairs } : {};
    const updatedPairs = { ...currentPairs };
    if (rightId === null) {
      if (leftId in updatedPairs) {
        delete updatedPairs[leftId];
      }
    } else {
      updatedPairs[leftId] = rightId;
    }
    const selectedOptions = Object.entries(updatedPairs).flatMap(([lId, rId]) => [Number(lId), rId]);
    updateResponse(application_form_question_id, {
      ...currentResponse,
      // Mantener el resto de la respuesta
      pairs: updatedPairs,
      selected_options: selectedOptions
    });
  };
  const handleReorder = (application_form_question_id, newOrder) => {
    const question = application_form_response.response_questions.find((q) => q.application_form_question_id === application_form_question_id);
    if (!question) {
      return;
    }
    updateResponse(application_form_question_id, {
      order: newOrder,
      selected_options: [...newOrder]
      // Mantener sincronizado con las opciones seleccionadas
    });
  };
  const handleOptionSelect = (application_form_question_id, optionId) => {
    var _a;
    const question = (_a = application_form_response.response_questions.find((q) => q.application_form_question_id === application_form_question_id)) == null ? void 0 : _a.application_form_question.question;
    if (!question) return;
    const questionTypeId = question.question_type.id;
    const isSingle = [1, 4].includes(questionTypeId);
    const currentResponse = data.responses && data.responses[application_form_question_id] || {
      selected_options: []
    };
    let newSelectedOptions = [];
    if (isSingle) {
      newSelectedOptions = [optionId];
    } else {
      const currentSelected = currentResponse.selected_options || [];
      newSelectedOptions = currentSelected.includes(optionId) ? currentSelected.filter((id) => id !== optionId) : [...currentSelected, optionId];
    }
    updateResponse(application_form_question_id, {
      selected_options: newSelectedOptions,
      // Para preguntas de ordenamiento, actualizar el orden también
      ...questionTypeId === 2 && { order: newSelectedOptions }
    });
  };
  const handleExplanationChange = (application_form_question_id, explanation) => {
    updateResponse(application_form_question_id, {
      explanation
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedResponses = { ...data.responses };
    Object.entries(updatedResponses).forEach(([questionIdStr, response]) => {
      var _a, _b;
      const questionId = Number(questionIdStr);
      const question = application_form_response.response_questions.find((q) => q.application_form_question_id === questionId);
      if (((_a = question == null ? void 0 : question.application_form_question.question) == null ? void 0 : _a.question_type.id) === 2) {
        if (!response.order || response.order.length === 0) {
          if (response.selected_options && response.selected_options.length > 0) {
            updatedResponses[questionId] = {
              ...response,
              order: [...response.selected_options],
              selected_options: [...response.selected_options]
              // Aseguramos que esté definido
            };
          }
        } else if (response.order.length !== ((_b = response.selected_options) == null ? void 0 : _b.length)) {
          updatedResponses[questionId] = {
            ...response,
            selected_options: [...response.order]
          };
        }
      }
    });
    setData("responses", updatedResponses);
    put(route("student.application-form-responses.update", application_form_response.id), {
      preserveScroll: true
    });
  };
  const disabled = application_form_response.status !== "pending";
  const isGraded = application_form_response.status === "graded";
  return /* @__PURE__ */ jsxs(AppLayout, { breadcrumbs, children: [
    /* @__PURE__ */ jsx(Head, { title: "Ficha de aplicación" }),
    /* @__PURE__ */ jsx(FlashMessages, {}),
    /* @__PURE__ */ jsx("div", { className: "relative flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4", children: /* @__PURE__ */ jsx("form", { onSubmit: handleSubmit, children: /* @__PURE__ */ jsxs("div", { className: "space-y-6 py-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold", children: application_form_response.application_form.name }),
          /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: application_form_response.application_form.description })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
          isGraded && /* @__PURE__ */ jsx(Badge, { variant: isGraded ? "secondary" : "outline", className: "text-base", children: /* @__PURE__ */ jsxs("p", { children: [
            "Puntaje:",
            " ",
            /* @__PURE__ */ jsxs("span", { className: "font-semibold", children: [
              application_form_response.application_form.score_max,
              " / ",
              application_form_response.score
            ] })
          ] }) }),
          !disabled && /* @__PURE__ */ jsx(Button, { type: "submit", disabled: processing, children: processing ? "Enviando..." : "Enviar respuestas" })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "space-y-8", children: application_form_response.response_questions.map((responseQuestion) => {
        var _a;
        const questionTypeId = responseQuestion.application_form_question.question.question_type.id;
        const canSelectOption = [1, 4].includes(questionTypeId);
        const image = (_a = responseQuestion.application_form_question.question) == null ? void 0 : _a.image;
        return /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col justify-between gap-4 lg:flex-row-reverse", children: [
          image && /* @__PURE__ */ jsx("div", { className: "w-full p-4 lg:w-1/3", children: /* @__PURE__ */ jsx("img", { src: image, alt: "icon" }) }),
          /* @__PURE__ */ jsxs("div", { className: cn(!image ? "w-full" : "w-full lg:w-2/3"), children: [
            /* @__PURE__ */ jsx(CardHeader, { className: "mb-4 flex items-start justify-between gap-4", children: /* @__PURE__ */ jsxs("div", { className: "flex-1 space-y-4", children: [
              /* @__PURE__ */ jsx(CardTitle, { children: responseQuestion.application_form_question.question.name }),
              responseQuestion.application_form_question.question.description && /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm", children: responseQuestion.application_form_question.question.description })
            ] }) }),
            /* @__PURE__ */ jsxs(CardContent, { children: [
              /* @__PURE__ */ jsx(
                QuestionResponse,
                {
                  question: responseQuestion,
                  response: data.responses[responseQuestion.application_form_question_id],
                  onOptionSelect: canSelectOption ? (optionId) => handleOptionSelect(responseQuestion.application_form_question_id, optionId) : void 0,
                  onReorder: (optionIds) => handleReorder(responseQuestion.application_form_question_id, optionIds),
                  onMatchingPairSelect: (leftId, rightId) => handleMatchingPairSelect(responseQuestion.application_form_question_id, leftId, rightId),
                  disabled
                }
              ),
              responseQuestion.application_form_question.question.explanation_required && /* @__PURE__ */ jsx(
                Input,
                {
                  type: "text",
                  name: `responses.${responseQuestion.application_form_question_id}.explanation`,
                  value: data.responses[responseQuestion.application_form_question_id].explanation || "",
                  onChange: (e) => handleExplanationChange(responseQuestion.application_form_question_id, e.target.value),
                  disabled
                }
              ),
              /* @__PURE__ */ jsx(
                InputError,
                {
                  message: getNestedError(errors, `responses.${responseQuestion.application_form_question_id}.selected_options`),
                  className: "mt-2"
                }
              )
            ] })
          ] })
        ] }) }, responseQuestion.id);
      }) })
    ] }) }) })
  ] });
}
export {
  ApplicationFormResponseEdit as default
};
