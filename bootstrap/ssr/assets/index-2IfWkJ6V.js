import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { I as InputError } from "./input-error-CyRLkAox.js";
import { F as FlashMessages } from "./flash-messages-Brq5Zd2U.js";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import { c as cn, g as getNestedError } from "./utils-CpIjqAVa.js";
import { b as buttonVariants, B as Button } from "./button-B8Z_lz_J.js";
import { B as Badge } from "./badge-65mno7eO.js";
import { C as Card, a as CardHeader, b as CardTitle, c as CardContent } from "./card-CN8XFMfu.js";
import { I as Image } from "./image-Bmp5thdH.js";
import { I as Input } from "./input-Dr5dPtfm.js";
import { L as Label } from "./label-GjpnCFkz.js";
import { A as AppLayout } from "./app-layout-Dq465f56.js";
import { u as useTranslations } from "./translator-csgEc0di.js";
import { g as getQuestionTypeBadge } from "./question-type-c-DbkR_Yi5.js";
import { useForm, Head } from "@inertiajs/react";
import * as React from "react";
import { QuestionResponse } from "./QuestionResponse-BcNFbY3N.js";
import "sonner";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "@radix-ui/react-label";
import "lucide-react";
import "@radix-ui/react-dialog";
import "./use-mobile-navigation-cG7zaCET.js";
import "@radix-ui/react-tooltip";
import "zustand";
import "zustand/middleware";
import "./app-logo-icon-Dnok8BqH.js";
import "@radix-ui/react-dropdown-menu";
import "@radix-ui/react-avatar";
import "@tanstack/react-query";
import "./MatchingResponse-Daz_ZqOF.js";
import "./OrderingResponse-BwFXkwIq.js";
import "./SingleChoiceResponse-Dslq_Y4o.js";
import "./BaseQuestionResponse-CJJUo3AV.js";
import "./TrueFalseResponse-lisUmW4U.js";
function AlertDialog({
  ...props
}) {
  return /* @__PURE__ */ jsx(AlertDialogPrimitive.Root, { "data-slot": "alert-dialog", ...props });
}
function AlertDialogPortal({
  ...props
}) {
  return /* @__PURE__ */ jsx(AlertDialogPrimitive.Portal, { "data-slot": "alert-dialog-portal", ...props });
}
function AlertDialogOverlay({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    AlertDialogPrimitive.Overlay,
    {
      "data-slot": "alert-dialog-overlay",
      className: cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      ),
      ...props
    }
  );
}
function AlertDialogContent({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxs(AlertDialogPortal, { children: [
    /* @__PURE__ */ jsx(AlertDialogOverlay, {}),
    /* @__PURE__ */ jsx(
      AlertDialogPrimitive.Content,
      {
        "data-slot": "alert-dialog-content",
        className: cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
          className
        ),
        ...props
      }
    )
  ] });
}
function AlertDialogHeader({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "alert-dialog-header",
      className: cn("flex flex-col gap-2 text-center sm:text-left", className),
      ...props
    }
  );
}
function AlertDialogFooter({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "alert-dialog-footer",
      className: cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      ),
      ...props
    }
  );
}
function AlertDialogTitle({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    AlertDialogPrimitive.Title,
    {
      "data-slot": "alert-dialog-title",
      className: cn("text-lg font-semibold", className),
      ...props
    }
  );
}
function AlertDialogDescription({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    AlertDialogPrimitive.Description,
    {
      "data-slot": "alert-dialog-description",
      className: cn("text-muted-foreground text-sm", className),
      ...props
    }
  );
}
function AlertDialogAction({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    AlertDialogPrimitive.Action,
    {
      className: cn(buttonVariants(), className),
      ...props
    }
  );
}
function AlertDialogCancel({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    AlertDialogPrimitive.Cancel,
    {
      className: cn(buttonVariants({ variant: "outline" }), className),
      ...props
    }
  );
}
const breadcrumbs = [
  {
    title: "Fichas de aplicación respuesta",
    href: "/student/dashboard"
  }
];
function ApplicationFormResponseEdit({ application_form_response }) {
  const { t } = useTranslations();
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
    setShowSubmitDialog(true);
  };
  const handleConfirmSubmit = () => {
    setIsSubmitting(true);
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
      preserveScroll: true,
      onFinish: () => {
        setIsSubmitting(false);
      }
    });
  };
  const [showSubmitDialog, setShowSubmitDialog] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const disabled = application_form_response.status !== "in progress";
  const isGraded = application_form_response.status === "graded";
  return /* @__PURE__ */ jsxs(AppLayout, { breadcrumbs, children: [
    /* @__PURE__ */ jsx(Head, { title: t("Application Form Response") }),
    /* @__PURE__ */ jsx(FlashMessages, {}),
    /* @__PURE__ */ jsx("div", { className: "relative flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4", children: /* @__PURE__ */ jsx("form", { onSubmit: handleSubmit, children: /* @__PURE__ */ jsxs("div", { className: "space-y-6 py-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-2 rounded-xl bg-white p-4", children: [
          /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold tracking-tight", children: "Completa la ficha de aplicación" }),
          /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Responde todas las preguntas y revisa tus respuestas antes de enviar" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
          isGraded && /* @__PURE__ */ jsxs(Badge, { variant: "secondary", className: "text-base", children: [
            t("Score"),
            ":",
            " ",
            /* @__PURE__ */ jsxs("span", { className: "font-semibold", children: [
              application_form_response.application_form.score_max,
              " / ",
              application_form_response.score
            ] })
          ] }),
          !disabled && /* @__PURE__ */ jsx(Button, { type: "submit", disabled: processing, children: processing ? t("Sending...") : t("Submit answers") })
        ] })
      ] }),
      /* @__PURE__ */ jsx(AlertDialog, { open: showSubmitDialog, onOpenChange: setShowSubmitDialog, children: /* @__PURE__ */ jsxs(AlertDialogContent, { children: [
        /* @__PURE__ */ jsxs(AlertDialogHeader, { children: [
          /* @__PURE__ */ jsx(AlertDialogTitle, { children: "¿Estás seguro de enviar tus respuestas?" }),
          /* @__PURE__ */ jsx(AlertDialogDescription, { children: "Una vez que envíes el formulario, no podrás realizar cambios. Asegúrate de haber revisado todas tus respuestas antes de continuar." })
        ] }),
        /* @__PURE__ */ jsxs(AlertDialogFooter, { children: [
          /* @__PURE__ */ jsx(AlertDialogCancel, { disabled: isSubmitting, children: "Cancelar" }),
          /* @__PURE__ */ jsx(
            AlertDialogAction,
            {
              onClick: (e) => {
                e.preventDefault();
                handleConfirmSubmit();
              },
              disabled: isSubmitting,
              className: "bg-primary hover:bg-primary/90",
              children: isSubmitting ? "Enviando..." : "Sí, enviar respuestas"
            }
          )
        ] })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "space-y-8", children: application_form_response.response_questions.map((responseQuestion, index) => {
        var _a;
        const questionTypeId = responseQuestion.application_form_question.question.question_type.id;
        const canSelectOption = [1, 4].includes(questionTypeId);
        const image = (_a = responseQuestion.application_form_question.question) == null ? void 0 : _a.image;
        return /* @__PURE__ */ jsxs(Card, { children: [
          /* @__PURE__ */ jsxs(CardHeader, { className: "p-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "mb-2 flex items-center gap-2", children: [
              /* @__PURE__ */ jsx("span", { className: "text-muted-foreground text-sm font-medium", children: t("Question") + " " + (index + 1) }),
              getQuestionTypeBadge(responseQuestion.application_form_question.question)
            ] }),
            /* @__PURE__ */ jsx(CardTitle, { className: "text-lg", children: responseQuestion.application_form_question.question.name }),
            responseQuestion.application_form_question.question.description && /* @__PURE__ */ jsx("p", { className: "text-muted-foreground mt-2 text-sm", children: responseQuestion.application_form_question.question.description })
          ] }),
          /* @__PURE__ */ jsxs(CardContent, { className: "flex flex-col-reverse gap-4 md:flex-row md:items-center", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex-1 space-y-4", children: [
              responseQuestion.application_form_question.question.explanation_required && /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsx(Label, { children: t("Explanation") }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    type: "text",
                    name: `responses.${responseQuestion.application_form_question_id}.explanation`,
                    value: data.responses[responseQuestion.application_form_question_id].explanation || "",
                    onChange: (e) => handleExplanationChange(responseQuestion.application_form_question_id, e.target.value),
                    disabled,
                    required: true
                  }
                )
              ] }),
              responseQuestion.application_form_question.question.question_type_id !== 5 && /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsx(Label, { children: t("Options") }),
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
                /* @__PURE__ */ jsx(
                  InputError,
                  {
                    message: getNestedError(errors, `responses.${responseQuestion.application_form_question_id}.selected_options`),
                    className: "mt-2"
                  }
                )
              ] }) })
            ] }),
            image && /* @__PURE__ */ jsx("div", { className: "w-full flex-1 md:w-auto", children: /* @__PURE__ */ jsx(Image, { src: image, alt: image }) })
          ] })
        ] }, responseQuestion.id);
      }) })
    ] }) }) })
  ] });
}
export {
  ApplicationFormResponseEdit as default
};
