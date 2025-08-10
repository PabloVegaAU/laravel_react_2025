import { jsxs, jsx } from "react/jsx-runtime";
import { F as FlashMessages } from "./flash-messages-Brq5Zd2U.js";
import { B as Badge } from "./badge-65mno7eO.js";
import { C as Card, a as CardHeader, b as CardTitle, c as CardContent } from "./card-CN8XFMfu.js";
import { I as Image } from "./image-Bmp5thdH.js";
import { I as Input } from "./input-Dr5dPtfm.js";
import { L as Label } from "./label-GjpnCFkz.js";
import { A as AppLayout } from "./app-layout-Dq465f56.js";
import { u as useTranslations } from "./translator-csgEc0di.js";
import { g as getQuestionTypeBadge } from "./question-type-c-DbkR_Yi5.js";
import { Head } from "@inertiajs/react";
import { ArrowRight } from "lucide-react";
import "react";
import "sonner";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./utils-CpIjqAVa.js";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-label";
import "./button-B8Z_lz_J.js";
import "@radix-ui/react-dialog";
import "./use-mobile-navigation-cG7zaCET.js";
import "@radix-ui/react-tooltip";
import "zustand";
import "zustand/middleware";
import "./app-logo-icon-Dnok8BqH.js";
import "@radix-ui/react-dropdown-menu";
import "@radix-ui/react-avatar";
import "@tanstack/react-query";
function ApplicationFormResponseShow({ application_form_response }) {
  var _a, _b;
  const { t } = useTranslations();
  const hasValidQuestionData = (responseQuestion) => {
    return responseQuestion == null ? void 0 : responseQuestion.question;
  };
  const breadcrumbs = [
    { title: "Inicio", href: "/student/dashboard" },
    { title: "Sesiones de aprendizaje", href: "/student/learning-sessions" },
    { title: "Ficha de aplicación respuesta", href: "/student/application-form-response/" + application_form_response.id }
  ];
  return /* @__PURE__ */ jsxs(AppLayout, { breadcrumbs, children: [
    /* @__PURE__ */ jsx(Head, { title: t("session_learning.title", "Sesiones de Aprendizaje") }),
    /* @__PURE__ */ jsx(FlashMessages, {}),
    /* @__PURE__ */ jsx("div", { className: "relative flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4", children: /* @__PURE__ */ jsxs("div", { className: "space-y-6 py-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-2 rounded-xl bg-white p-4", children: [
          /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold tracking-tight", children: "Resultados de la evaluación" }),
          /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Revisa tus respuestas y calificaciones" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex items-center gap-4", children: /* @__PURE__ */ jsxs(Badge, { variant: "secondary", className: "text-base", children: [
          t("Score"),
          ":",
          /* @__PURE__ */ jsxs("span", { className: "font-semibold", children: [
            ((_a = application_form_response.application_form) == null ? void 0 : _a.score_max) || 0,
            " / ",
            application_form_response.score || 0
          ] })
        ] }) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "space-y-6", children: (_b = application_form_response.response_questions) == null ? void 0 : _b.map((responseQuestion, index) => {
        var _a2;
        if (!hasValidQuestionData(responseQuestion)) return null;
        const question = responseQuestion.question;
        const questionTypeId = (_a2 = question == null ? void 0 : question.question_type) == null ? void 0 : _a2.id;
        const selectedOptions = responseQuestion.selected_options || [];
        return /* @__PURE__ */ jsxs(Card, { className: "overflow-hidden", children: [
          /* @__PURE__ */ jsxs(CardHeader, { className: "p-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "mb-2 flex items-center gap-2", children: [
              /* @__PURE__ */ jsxs("span", { className: "text-muted-foreground text-sm font-medium", children: [
                "Pregunta ",
                index + 1
              ] }),
              getQuestionTypeBadge(question)
            ] }),
            /* @__PURE__ */ jsx(CardTitle, { className: "text-lg", children: question == null ? void 0 : question.name }),
            (question == null ? void 0 : question.description) && /* @__PURE__ */ jsx("p", { className: "text-muted-foreground mt-2 text-sm", children: question.description })
          ] }),
          /* @__PURE__ */ jsxs(CardContent, { className: "flex flex-col-reverse gap-4 md:flex-row md:items-center", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex-1 space-y-4", children: [
              responseQuestion.application_form_question.question.explanation_required && /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxs(Label, { children: [
                  t("Your") + " " + t("Explanation"),
                  ": "
                ] }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    type: "text",
                    name: `responses.${responseQuestion.application_form_question_id}.explanation`,
                    defaultValue: responseQuestion.explanation || "",
                    className: "w-full",
                    readOnly: true
                  }
                )
              ] }),
              selectedOptions.length > 0 ? /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxs(Label, { children: [
                  t("Your") + " " + t("Answer"),
                  ": "
                ] }),
                /* @__PURE__ */ jsx("div", { className: "space-y-3", children: questionTypeId === 3 ? (
                  // Preguntas de emparejamiento - Mejorado para móvil
                  /* @__PURE__ */ jsx("div", { className: "space-y-3", children: selectedOptions.map((selectedOption) => {
                    var _a3, _b2;
                    const leftOption = (_a3 = question.options) == null ? void 0 : _a3.find((opt) => opt.id === selectedOption.question_option_id);
                    const rightOption = (_b2 = question.options) == null ? void 0 : _b2.find((opt) => opt.id === selectedOption.paired_with_option_id);
                    return /* @__PURE__ */ jsx(
                      "div",
                      {
                        className: "group relative overflow-hidden rounded-lg border p-3 transition-all duration-200 ease-in-out hover:shadow-sm",
                        children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4", children: [
                          /* @__PURE__ */ jsx("div", { className: "min-w-0 flex-1", children: /* @__PURE__ */ jsx("span", { className: "text-foreground/90 font-medium break-words", children: (leftOption == null ? void 0 : leftOption.value) || "Opción no encontrada" }) }),
                          /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center sm:flex-shrink-0", children: /* @__PURE__ */ jsx(ArrowRight, { className: "text-muted-foreground h-4 w-4 rotate-90 sm:rotate-0" }) }),
                          /* @__PURE__ */ jsx("div", { className: "bg-background/50 min-w-0 flex-1 rounded p-2", children: /* @__PURE__ */ jsx("span", { className: "text-foreground/80 break-words", children: (rightOption == null ? void 0 : rightOption.value) || "No seleccionado" }) })
                        ] })
                      },
                      selectedOption.id
                    );
                  }) })
                ) : questionTypeId === 2 ? (
                  // Preguntas de ordenamiento - Mejorado para móvil
                  /* @__PURE__ */ jsx("div", { className: "space-y-3", children: selectedOptions.sort((a, b) => a.order - b.order).map((option, index2) => {
                    var _a3;
                    return /* @__PURE__ */ jsx(
                      "div",
                      {
                        className: "group relative overflow-hidden rounded-lg border p-4 transition-all duration-200 ease-in-out hover:shadow-sm",
                        children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
                          /* @__PURE__ */ jsx("div", { className: "bg-primary/10 text-primary flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-sm font-medium", children: index2 + 1 }),
                          /* @__PURE__ */ jsx("div", { className: "min-w-0 flex-1", children: /* @__PURE__ */ jsx("p", { className: "text-foreground text-sm break-words", children: (_a3 = option.question_option) == null ? void 0 : _a3.value }) })
                        ] })
                      },
                      option.id
                    );
                  }) })
                ) : (
                  // Opciones normales para otros tipos de preguntas
                  /* @__PURE__ */ jsx("div", { className: "space-y-3", children: selectedOptions.map((option) => {
                    var _a3;
                    return /* @__PURE__ */ jsx("div", { className: "rounded-lg border p-3 transition-shadow hover:shadow-sm", children: /* @__PURE__ */ jsx("div", { className: "flex items-start gap-2", children: /* @__PURE__ */ jsx("div", { className: "min-w-0 flex-1", children: /* @__PURE__ */ jsx("p", { className: "text-sm break-words", children: (_a3 = option.question_option) == null ? void 0 : _a3.value }) }) }) }, option.id);
                  }) })
                ) })
              ] }) : /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm", children: "No se proporcionó respuesta" })
            ] }),
            question.image && /* @__PURE__ */ jsx("div", { className: "w-full flex-1 md:w-auto", children: /* @__PURE__ */ jsx(Image, { src: question.image, alt: question.name }) })
          ] })
        ] }, responseQuestion.id);
      }) })
    ] }) })
  ] });
}
export {
  ApplicationFormResponseShow as default
};
