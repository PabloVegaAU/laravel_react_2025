import { jsxs, jsx } from "react/jsx-runtime";
import { B as Button } from "./button-BqjjxT-O.js";
import { C as Card, a as CardHeader, b as CardTitle, c as CardContent } from "./card-BgnygZAf.js";
import { A as AppLayout } from "./app-layout-BsERFbVR.js";
import { u as useTranslations } from "./translator-csgEc0di.js";
import { c as cn } from "./utils-qggO9Hcn.js";
import { g as getQuestionTypeBadge, Q as QUESTION_TYPES } from "./question-type-c-CHH3NqXw.js";
import { Head, Link } from "@inertiajs/react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CheckCircle, XCircle, Link as Link$1 } from "lucide-react";
import "react";
import "@radix-ui/react-slot";
import "class-variance-authority";
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
import "./badge-DIxTRnmV.js";
const statusColors = {
  draft: "bg-gray-100 text-gray-800",
  scheduled: "bg-blue-100 text-blue-800",
  active: "bg-green-100 text-green-800",
  inactive: "bg-yellow-100 text-yellow-800",
  archived: "bg-purple-100 text-purple-800"
};
const breadcrumbs = [
  {
    title: "Fichas de Aplicación",
    href: "/teacher/application-forms"
  },
  {
    title: "Detalles de Ficha",
    href: ""
  }
];
function QuestionDisplay({
  question,
  index
}) {
  var _a, _b, _c, _d, _e, _f, _g, _h;
  const { t } = useTranslations();
  const q = question == null ? void 0 : question.question;
  if (!q) return null;
  const questionType = (_a = q.question_type) == null ? void 0 : _a.id;
  const options = q.options || [];
  const renderOptions = () => {
    if (!options.length || typeof questionType === "undefined") return null;
    switch (questionType) {
      case QUESTION_TYPES.SINGLE_CHOICE:
        return /* @__PURE__ */ jsxs("div", { className: "mt-3 space-y-2", children: [
          /* @__PURE__ */ jsx("div", { className: "text-muted-foreground text-sm font-medium", children: "Opciones:" }),
          /* @__PURE__ */ jsx("ul", { className: "space-y-1", children: options.map((option) => /* @__PURE__ */ jsxs(
            "li",
            {
              className: `flex items-center gap-2 text-sm ${option.is_correct ? "font-medium text-green-600" : "text-foreground"}`,
              children: [
                option.is_correct ? /* @__PURE__ */ jsx(CheckCircle, { className: "h-4 w-4 text-green-500" }) : /* @__PURE__ */ jsx("div", { className: "h-4 w-4" }),
                /* @__PURE__ */ jsx("span", { children: option.value ?? "Sin valor" })
              ]
            },
            option.id
          )) })
        ] });
      case QUESTION_TYPES.ORDERING:
        const orderedOptions = [...options].sort(
          (a, b) => (a.correct_order ?? Number.MAX_SAFE_INTEGER) - (b.correct_order ?? Number.MAX_SAFE_INTEGER)
        );
        return /* @__PURE__ */ jsxs("div", { className: "mt-3 space-y-2", children: [
          /* @__PURE__ */ jsx("div", { className: "text-muted-foreground text-sm font-medium", children: "Orden correcto:" }),
          /* @__PURE__ */ jsx("ol", { className: "list-decimal space-y-1 pl-5", children: orderedOptions.map((option) => /* @__PURE__ */ jsx("li", { className: "text-sm", children: option.value ?? "Sin valor" }, option.id)) })
        ] });
      case QUESTION_TYPES.MATCHING:
        const leftItems = options.filter((opt) => opt.pair_side === "left");
        const rightItems = options.filter((opt) => opt.pair_side === "right");
        return /* @__PURE__ */ jsxs("div", { className: "mt-3 space-y-3", children: [
          /* @__PURE__ */ jsx("div", { className: "text-muted-foreground text-sm font-medium", children: "Pares correctos:" }),
          /* @__PURE__ */ jsx("div", { className: "space-y-2", children: leftItems.map((left) => {
            const rightMatch = rightItems.find((r) => r.pair_key === left.pair_key);
            return /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm", children: [
              /* @__PURE__ */ jsx("span", { className: "font-medium", children: left.value ?? "Sin valor" }),
              /* @__PURE__ */ jsx(Link$1, { className: "text-muted-foreground h-4 w-4 flex-shrink-0" }),
              /* @__PURE__ */ jsx("span", { className: "truncate", children: (rightMatch == null ? void 0 : rightMatch.value) ?? "Sin coincidencia" })
            ] }, left.id);
          }) })
        ] });
      case QUESTION_TYPES.TRUE_FALSE: {
        const trueOption = options.find((opt) => ["verdadero", "true"].includes((opt.value ?? "").toLowerCase()));
        const isTrueCorrect = (trueOption == null ? void 0 : trueOption.is_correct) ?? false;
        return /* @__PURE__ */ jsxs("div", { className: "mt-3 space-y-2", children: [
          /* @__PURE__ */ jsx("div", { className: "text-muted-foreground text-sm font-medium", children: "Respuesta correcta:" }),
          /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2", children: isTrueCorrect ? /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 text-green-600", children: [
            /* @__PURE__ */ jsx(CheckCircle, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsx("span", { children: "Verdadero" })
          ] }) : /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 text-red-600", children: [
            /* @__PURE__ */ jsx(XCircle, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsx("span", { children: "Falso" })
          ] }) })
        ] });
      }
      case QUESTION_TYPES.OPEN_ANSWER:
        return null;
      default:
        return /* @__PURE__ */ jsxs("div", { className: "mt-3 text-sm text-amber-600", children: [
          "Tipo de pregunta no soportado: ",
          questionType
        ] });
    }
  };
  const borderColor = ((_b = q.capability) == null ? void 0 : _b.color) ? `border-s-${(_c = q.capability) == null ? void 0 : _c.color}-500` : "border-s-gray-500";
  const capabilityBgColor = ((_d = q.capability) == null ? void 0 : _d.color) ? `bg-${(_e = q.capability) == null ? void 0 : _e.color}-50` : "bg-gray-50";
  const capabilityTextColor = ((_f = q.capability) == null ? void 0 : _f.color) ? `text-${(_g = q.capability) == null ? void 0 : _g.color}-500` : "text-gray-500";
  return /* @__PURE__ */ jsx("div", { className: cn("rounded-lg border border-s-4 p-4", borderColor), children: /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between", children: [
      /* @__PURE__ */ jsxs("h4", { className: "font-medium", children: [
        index + 1,
        ". ",
        q.name || "Pregunta sin nombre"
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2", children: getQuestionTypeBadge(q) })
    ] }),
    q.description && /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm", children: q.description }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2 pt-1", children: [
      q.difficulty && /* @__PURE__ */ jsx("span", { className: "inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800", children: t(q.difficulty) }),
      /* @__PURE__ */ jsxs("span", { className: "text-muted-foreground text-sm", children: [
        question.score ?? 0,
        " puntos"
      ] }),
      ((_h = q == null ? void 0 : q.capability) == null ? void 0 : _h.name) && /* @__PURE__ */ jsx("span", { className: cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", capabilityBgColor, capabilityTextColor), children: q.capability.name })
    ] }),
    renderOptions()
  ] }) });
}
function ApplicationFormShow({ application_form }) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q;
  const { t } = useTranslations();
  const formatDate = (dateString) => {
    return format(new Date(dateString), "PPP", { locale: es });
  };
  return /* @__PURE__ */ jsxs(AppLayout, { breadcrumbs, children: [
    /* @__PURE__ */ jsx(Head, { title: `Ficha: ${application_form.name}` }),
    /* @__PURE__ */ jsx("div", { className: "flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-6", children: /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold tracking-tight", children: application_form.name }),
          /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: application_form.description })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(
            "span",
            {
              className: `inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${statusColors[application_form.status]}`,
              children: t(application_form.status)
            }
          ),
          /* @__PURE__ */ jsx(Button, { asChild: true, variant: "outline", size: "sm", children: /* @__PURE__ */ jsx(Link, { href: route("teacher.application-forms.edit", application_form.id), children: "Editar" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid gap-6 md:grid-cols-2", children: [
        /* @__PURE__ */ jsxs(Card, { children: [
          /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { children: "Información General" }) }),
          /* @__PURE__ */ jsxs(CardContent, { className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx("div", { className: "text-muted-foreground text-sm font-medium", children: "Área Curricular" }),
              /* @__PURE__ */ jsx("div", { children: ((_d = (_c = (_b = (_a = application_form.learning_session) == null ? void 0 : _a.teacher_classroom_curricular_area_cycle) == null ? void 0 : _b.curricular_area_cycle) == null ? void 0 : _c.curricular_area) == null ? void 0 : _d.name) || "No especificado" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx("div", { className: "text-muted-foreground text-sm font-medium", children: "Competencia" }),
              /* @__PURE__ */ jsx("div", { children: ((_f = (_e = application_form.learning_session) == null ? void 0 : _e.competency) == null ? void 0 : _f.name) || "No especificada" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx("div", { className: "text-muted-foreground text-sm font-medium", children: "Nivel/Sección" }),
              /* @__PURE__ */ jsx("div", { children: t((_i = (_h = (_g = application_form.learning_session) == null ? void 0 : _g.teacher_classroom_curricular_area_cycle) == null ? void 0 : _h.classroom) == null ? void 0 : _i.level) + " " + t((_l = (_k = (_j = application_form.learning_session) == null ? void 0 : _j.teacher_classroom_curricular_area_cycle) == null ? void 0 : _k.classroom) == null ? void 0 : _l.grade) + " " + ((_o = (_n = (_m = application_form.learning_session) == null ? void 0 : _m.teacher_classroom_curricular_area_cycle) == null ? void 0 : _n.classroom) == null ? void 0 : _o.section) })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs(Card, { children: [
          /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { children: "Período de Aplicación" }) }),
          /* @__PURE__ */ jsxs(CardContent, { className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx("div", { className: "text-muted-foreground text-sm font-medium", children: "Fecha de Inicio" }),
              /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsx("span", { children: formatDate(application_form.start_date) }) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx("div", { className: "text-muted-foreground text-sm font-medium", children: "Fecha de Fin" }),
              /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsx("span", { children: formatDate(application_form.end_date) }) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx("div", { className: "text-muted-foreground text-sm font-medium", children: "Puntaje Total" }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx("span", { className: "text-lg font-bold", children: application_form.score_max }),
                /* @__PURE__ */ jsx("span", { className: "text-muted-foreground text-sm", children: "puntos" })
              ] })
            ] })
          ] })
        ] })
      ] }),
      ((_p = application_form.learning_session) == null ? void 0 : _p.capabilities) && application_form.learning_session.capabilities.length > 0 && /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { children: "Capacidades" }) }),
        /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: application_form.learning_session.capabilities.map((capability) => /* @__PURE__ */ jsx(
          "div",
          {
            className: `rounded-full px-3 py-1 text-sm ${capability.color ? `bg-${capability.color}-100 text-${capability.color}-800` : "bg-gray-100 text-gray-800"}`,
            children: capability.name
          },
          capability.id
        )) }) })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsx(CardTitle, { children: "Preguntas" }),
          /* @__PURE__ */ jsxs("p", { className: "text-muted-foreground text-sm", children: [
            ((_q = application_form.questions) == null ? void 0 : _q.length) || 0,
            " preguntas en total"
          ] })
        ] }),
        /* @__PURE__ */ jsx(CardContent, { children: application_form.questions && application_form.questions.length > 0 ? /* @__PURE__ */ jsx("div", { className: "space-y-6", children: application_form.questions.map((question, index) => /* @__PURE__ */ jsx(QuestionDisplay, { question, index }, question.id)) }) : /* @__PURE__ */ jsx("div", { className: "rounded-lg border-2 border-dashed p-8 text-center", children: /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "No hay preguntas en esta ficha" }) }) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsx(Button, { asChild: true, variant: "outline", children: /* @__PURE__ */ jsx(Link, { href: route("teacher.application-forms.index"), children: "Volver al listado" }) }) })
    ] }) })
  ] });
}
export {
  ApplicationFormShow as default
};
