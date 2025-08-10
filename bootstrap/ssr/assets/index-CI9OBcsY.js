import { jsxs, jsx } from "react/jsx-runtime";
import { F as FlashMessages } from "./flash-messages-Brq5Zd2U.js";
import { B as Badge } from "./badge-DIxTRnmV.js";
import { B as Button } from "./button-BqjjxT-O.js";
import { C as Card, a as CardHeader, b as CardTitle, c as CardContent } from "./card-BgnygZAf.js";
import { C as Checkbox } from "./checkbox-B_r2H9BE.js";
import { A as AppLayout } from "./app-layout-BsERFbVR.js";
import { u as useTranslations } from "./translator-csgEc0di.js";
import { c as cn } from "./utils-qggO9Hcn.js";
import { g as getQuestionTypeBadge } from "./question-type-c-CHH3NqXw.js";
import { useForm, Head } from "@inertiajs/react";
import { ArrowRight, LoaderCircle } from "lucide-react";
import "react";
import "sonner";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "@radix-ui/react-checkbox";
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
const breadcrumbs = [
  { title: "Inicio", href: "/teacher/dashboard" },
  { title: "Sesiones de aprendizaje", href: "/teacher/learning-sessions" },
  { title: "Respuestas de ficha de aplicación", href: "/teacher/application-form-responses" }
];
function ApplicationFormResponseEdit({ application_form_response }) {
  var _a, _b;
  const { t } = useTranslations();
  const hasValidQuestionData = (responseQuestion) => {
    return responseQuestion == null ? void 0 : responseQuestion.question;
  };
  const initValue = {
    response_questions: application_form_response.response_questions.map((responseQuestion) => ({
      id: responseQuestion.id,
      is_correct: responseQuestion.score > 0
    }))
  };
  const { data, setData, put, reset, processing } = useForm(initValue);
  const handleSubmit = (e) => {
    e.preventDefault();
    put(route("teacher.application-form-responses.update", application_form_response.id), {
      onSuccess: () => {
        reset();
      }
    });
  };
  return /* @__PURE__ */ jsxs(AppLayout, { breadcrumbs, children: [
    /* @__PURE__ */ jsx(Head, { title: t("session_learning.title", "Sesiones de Aprendizaje") }),
    /* @__PURE__ */ jsx(FlashMessages, {}),
    /* @__PURE__ */ jsx("form", { onSubmit: handleSubmit, className: "relative flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4", children: /* @__PURE__ */ jsxs("div", { className: "space-y-6 py-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold tracking-tight", children: "Resultados de la evaluación" }),
          /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Revisa respuestas y calificaciones" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "space-x-2", children: /* @__PURE__ */ jsxs(Badge, { variant: "outline", children: [
          "Puntaje: ",
          ((_a = application_form_response.application_form) == null ? void 0 : _a.score_max) || 0,
          " / ",
          application_form_response.score || 0
        ] }) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "space-y-6", children: (_b = application_form_response.response_questions) == null ? void 0 : _b.map((responseQuestion, index) => {
        var _a2, _b2;
        if (!hasValidQuestionData(responseQuestion)) return null;
        const question = responseQuestion.question;
        const questionTypeId = (_a2 = question == null ? void 0 : question.question_type) == null ? void 0 : _a2.id;
        const selectedOptions = responseQuestion.selected_options || [];
        const isCorrect = ((_b2 = data.response_questions.find((q) => q.id === responseQuestion.id)) == null ? void 0 : _b2.is_correct) || false;
        return /* @__PURE__ */ jsxs(Card, { className: "overflow-hidden", children: [
          /* @__PURE__ */ jsx(CardHeader, { className: "p-4", children: /* @__PURE__ */ jsx("div", { className: "flex items-start justify-between", children: /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("div", { className: "mb-2 flex items-center gap-2", children: [
              /* @__PURE__ */ jsxs("span", { className: "text-muted-foreground text-sm font-medium", children: [
                "Pregunta ",
                index + 1
              ] }),
              getQuestionTypeBadge(question)
            ] }),
            /* @__PURE__ */ jsx(CardTitle, { className: "text-lg", children: question == null ? void 0 : question.name }),
            (question == null ? void 0 : question.description) && /* @__PURE__ */ jsx("p", { className: "text-muted-foreground mt-2 text-sm", children: question.description })
          ] }) }) }),
          /* @__PURE__ */ jsxs(CardContent, { className: "flex items-center gap-4", children: [
            /* @__PURE__ */ jsx("div", { className: "flex-1 space-y-4 p-6", children: /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
              (responseQuestion == null ? void 0 : responseQuestion.explanation) && /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm", children: responseQuestion == null ? void 0 : responseQuestion.explanation }) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h4", { className: "mb-2 font-medium", children: "Respuesta:" }),
                selectedOptions.length > 0 ? /* @__PURE__ */ jsx("div", { className: "space-y-2", children: questionTypeId === 3 ? (
                  // Mejor visualización para preguntas de emparejamiento
                  /* @__PURE__ */ jsx("div", { className: "space-y-3", children: selectedOptions.map((selectedOption) => {
                    var _a3, _b3;
                    const leftOption = (_a3 = question == null ? void 0 : question.options) == null ? void 0 : _a3.find((opt) => opt.id === selectedOption.question_option_id);
                    const rightOption = (_b3 = question == null ? void 0 : question.options) == null ? void 0 : _b3.find((opt) => opt.id === selectedOption.paired_with_option_id);
                    return /* @__PURE__ */ jsx(
                      "div",
                      {
                        className: "group relative overflow-hidden rounded-lg border p-3 transition-all duration-200 ease-in-out",
                        children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2 sm:flex-row sm:items-center", children: [
                          /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsx("span", { className: "text-foreground/90 font-medium", children: (leftOption == null ? void 0 : leftOption.value) || "Opción no encontrada" }) }),
                          /* @__PURE__ */ jsx(ArrowRight, { className: "text-muted-foreground mx-2 hidden h-4 w-4 flex-shrink-0 sm:block" }),
                          /* @__PURE__ */ jsx("div", { className: "bg-background/50 flex-1 rounded p-2", children: /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsx("span", { className: "text-foreground/80", children: (rightOption == null ? void 0 : rightOption.value) || "No seleccionado" }) }) })
                        ] })
                      },
                      selectedOption.id
                    );
                  }) })
                ) : (
                  // Mejor visualización para preguntas de ordenamiento
                  questionTypeId === 2 ? /* @__PURE__ */ jsx("div", { className: "space-y-3", children: selectedOptions.sort((a, b) => (a.selected_order || 0) - (b.selected_order || 0)).map((option, index2) => {
                    var _a3;
                    return /* @__PURE__ */ jsx(
                      "div",
                      {
                        className: "group relative overflow-hidden rounded-lg border p-4 transition-all duration-200 ease-in-out",
                        children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
                          /* @__PURE__ */ jsx("div", { className: "flex flex-shrink-0 flex-col items-center", children: /* @__PURE__ */ jsx("div", { className: "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium", children: index2 + 1 }) }),
                          /* @__PURE__ */ jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsx("p", { className: "text-foreground text-sm", children: (_a3 = option.question_option) == null ? void 0 : _a3.value }) })
                        ] })
                      },
                      option.id
                    );
                  }) }) : (
                    // Mostrar opciones normales para otros tipos de preguntas
                    selectedOptions.map((option) => {
                      var _a3;
                      return /* @__PURE__ */ jsx("div", { className: "rounded border p-3", children: /* @__PURE__ */ jsx("div", { className: "flex items-start gap-2", children: /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("p", { className: "text-sm", children: (_a3 = option.question_option) == null ? void 0 : _a3.value }) }) }) }, option.id);
                    })
                  )
                ) }) : /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm", children: "No se proporcionó respuesta" })
              ] })
            ] }) }),
            /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
              Checkbox,
              {
                id: `is_correct_${responseQuestion.id}`,
                className: cn(
                  "size-5 md:size-10 lg:size-20",
                  processing && "cursor-not-allowed opacity-50",
                  "data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-red-500"
                ),
                checked: isCorrect,
                onCheckedChange: (e) => {
                  setData(
                    "response_questions",
                    data.response_questions.map(
                      (question2) => question2.id === responseQuestion.id ? { ...question2, is_correct: e } : question2
                    )
                  );
                },
                disabled: processing
              }
            ) })
          ] })
        ] }, responseQuestion.id);
      }) }),
      /* @__PURE__ */ jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxs(Button, { type: "submit", className: "mt-4 w-full", disabled: processing, children: [
        processing && /* @__PURE__ */ jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }),
        "Guardar"
      ] }) })
    ] }) })
  ] });
}
export {
  ApplicationFormResponseEdit as default
};
