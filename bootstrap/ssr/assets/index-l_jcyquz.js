import { jsxs, jsx } from "react/jsx-runtime";
import { I as InputError } from "./input-error-BCtMt8Ki.js";
import { B as Badge } from "./badge-DIxTRnmV.js";
import { B as Button } from "./button-BqjjxT-O.js";
import { P as Popover, a as PopoverTrigger, b as PopoverContent, C as Calendar$1 } from "./popover-DVAkeKRI.js";
import { C as Checkbox } from "./checkbox-B_r2H9BE.js";
import { I as Input } from "./input-B1uJ3yMO.js";
import { L as Label } from "./label-CC7KirIj.js";
import { S as Select, a as SelectTrigger, b as SelectValue, d as SelectContent, c as SelectItem } from "./select-qcG6mW7O.js";
import { T as Textarea } from "./textarea-DQiokWve.js";
import { A as AppLayout } from "./app-layout-BsERFbVR.js";
import { u as useTranslations } from "./translator-csgEc0di.js";
import { c as cn, g as getNestedError } from "./utils-qggO9Hcn.js";
import { g as getQuestionTypeBadge } from "./question-type-c-CHH3NqXw.js";
import { useForm, Head, Link } from "@inertiajs/react";
import { format, startOfDay, endOfDay } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar } from "lucide-react";
import { useEffect } from "react";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "react-day-picker";
import "@radix-ui/react-popover";
import "@radix-ui/react-checkbox";
import "@radix-ui/react-label";
import "@radix-ui/react-select";
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
  {
    title: "Fichas de Aplicación",
    href: "/teacher/application-forms"
  },
  {
    title: "Editar Ficha",
    href: "/teacher/application-forms/create"
  }
];
function ApplicationFormEdit({ application_form, questions }) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r;
  const { t } = useTranslations();
  const defaultStartDate = /* @__PURE__ */ new Date();
  const defaultEndDate = /* @__PURE__ */ new Date();
  defaultEndDate.setDate(defaultStartDate.getDate() + 7);
  const dateLocale = es;
  const { data, setData, put, processing, errors } = useForm({
    name: (application_form == null ? void 0 : application_form.name) || "",
    description: (application_form == null ? void 0 : application_form.description) || "",
    start_date: (application_form == null ? void 0 : application_form.start_date) ? format(new Date(application_form.start_date), "yyyy-MM-dd") : format(defaultStartDate, "yyyy-MM-dd"),
    end_date: (application_form == null ? void 0 : application_form.end_date) ? format(new Date(application_form.end_date), "yyyy-MM-dd") : format(defaultEndDate, "yyyy-MM-dd"),
    status: (application_form == null ? void 0 : application_form.status) || "draft",
    score_max: (application_form == null ? void 0 : application_form.score_max) || 0,
    questions: ((_a = application_form == null ? void 0 : application_form.questions) == null ? void 0 : _a.map((q) => {
      var _a2;
      return {
        id: q.question.id,
        name: q.question.name || "Pregunta sin nombre",
        description: q.question.description || "",
        question_type_id: q.question.question_type_id || 1,
        capability_id: q.question.capability_id,
        difficulty: q.question.difficulty || "medium",
        level: q.question.level || "primary",
        score: q.score,
        points_store: q.points_store,
        order: q.order,
        options: ((_a2 = q.question.options) == null ? void 0 : _a2.map((opt) => ({
          id: opt.id,
          value: opt.value,
          is_correct: opt.is_correct
        }))) || []
      };
    })) || []
  });
  useEffect(() => {
    const totalScore = data.questions.reduce((sum, q) => {
      return sum + (Number(q.score) || 0);
    }, 0);
    setData("score_max", Number(totalScore.toFixed(2)));
  }, [data.questions]);
  const handleDateSelect = (date, field) => {
    if (!date) return;
    setData(field, format(date, "yyyy-MM-dd"));
    if (field === "start_date" && date > new Date(data.end_date)) {
      const newEndDate = new Date(date);
      newEndDate.setDate(newEndDate.getDate() + 7);
      setData("end_date", format(newEndDate, "yyyy-MM-dd"));
    }
  };
  const handleQuestionToggle = (questionId, isChecked) => {
    var _a2;
    const currentQuestions = [...data.questions || []];
    if (isChecked) {
      const question = questions.find((q) => q.id === questionId);
      if (!question) return;
      const existingQuestionIndex = currentQuestions.findIndex((q) => q.id === questionId);
      if (existingQuestionIndex >= 0) {
        const updatedQuestions = [...currentQuestions];
        updatedQuestions[existingQuestionIndex] = {
          ...updatedQuestions[existingQuestionIndex],
          score: 1
        };
        setData("questions", updatedQuestions);
      } else {
        const newQuestion = {
          id: questionId,
          name: question.name || "Pregunta sin nombre",
          description: question.description || "",
          question_type_id: question.question_type_id || 1,
          capability_id: question.capability_id,
          difficulty: question.difficulty || "medium",
          level: question.level || "primary",
          score: 1,
          points_store: 0,
          order: currentQuestions.length + 1,
          options: ((_a2 = question.options) == null ? void 0 : _a2.map((opt) => ({
            id: opt.id,
            value: opt.value,
            is_correct: opt.is_correct
          }))) || []
        };
        setData("questions", [...currentQuestions, newQuestion]);
      }
    } else {
      const filteredQuestions = currentQuestions.filter((q) => q.id !== questionId).map((q, index) => ({ ...q, order: index }));
      setData("questions", filteredQuestions);
    }
  };
  const handleOrderChange = (questionId, newOrder) => {
    if (isNaN(newOrder) || newOrder < 0) return;
    const currentQuestions = [...data.questions || []];
    const questionIndex = currentQuestions.findIndex((q) => q.id === questionId);
    if (questionIndex === -1) return;
    const reorderedQuestions = [...currentQuestions];
    const [movedQuestion] = reorderedQuestions.splice(questionIndex, 1);
    movedQuestion.order = Math.max(0, newOrder);
    reorderedQuestions.forEach((q) => {
      if (q.order >= newOrder && q.id !== questionId) {
        q.order++;
      }
    });
    reorderedQuestions.splice(newOrder, 0, movedQuestion);
    reorderedQuestions.sort((a, b) => a.order - b.order);
    const orderedQuestions = reorderedQuestions.map((q, index) => ({
      ...q,
      order: index
    }));
    setData("questions", orderedQuestions);
    const currentQuestion = data.questions.find((q) => q.id === questionId);
    if (!currentQuestion) return;
    const otherQuestions = data.questions.filter((q) => q.id !== questionId);
    const sortedQuestions = [...otherQuestions].sort((a, b) => a.order - b.order);
    const insertIndex = Math.min(newOrder - 1, sortedQuestions.length);
    sortedQuestions.splice(insertIndex, 0, {
      ...currentQuestion,
      order: newOrder
    });
    const updatedQuestions = sortedQuestions.map((q, index) => ({
      ...q,
      order: index + 1
    }));
    setData("questions", updatedQuestions);
  };
  const handleScoreChange = (question, value) => {
    const scoreValue = parseFloat(value) || 0;
    const multiplier = {
      easy: 0.5,
      medium: 1,
      hard: 1.5
    }[question.difficulty] || 0;
    const pointsStoreValue = scoreValue * multiplier;
    setData(
      "questions",
      data.questions.map((q) => q.id === question.id ? { ...q, score: scoreValue, points_store: pointsStoreValue } : q)
    );
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== void 0) {
        formData.append(key, value);
      }
    });
    if (data.start_date) {
      formData.set("start_date", startOfDay(new Date(data.start_date)).toISOString());
    }
    if (data.end_date) {
      formData.set("end_date", endOfDay(new Date(data.end_date)).toISOString());
    }
    const submit = () => put(route("teacher.application-forms.update", application_form == null ? void 0 : application_form.id), formData);
    submit();
  };
  return /* @__PURE__ */ jsxs(AppLayout, { breadcrumbs, children: [
    /* @__PURE__ */ jsx(Head, { title: "Editar Ficha de Aplicación" }),
    /* @__PURE__ */ jsx("div", { className: "flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-6", children: /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-6 md:grid-cols-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "teacher_classroom_curricular_area_id", children: "Área Curricular" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              defaultValue: t((_e = (_d = (_c = (_b = application_form == null ? void 0 : application_form.learning_session) == null ? void 0 : _b.teacher_classroom_curricular_area_cycle) == null ? void 0 : _c.curricular_area_cycle) == null ? void 0 : _d.curricular_area) == null ? void 0 : _e.name) + " - " + t((_h = (_g = (_f = application_form == null ? void 0 : application_form.learning_session) == null ? void 0 : _f.teacher_classroom_curricular_area_cycle) == null ? void 0 : _g.classroom) == null ? void 0 : _h.level) + " " + ((_k = (_j = (_i = application_form == null ? void 0 : application_form.learning_session) == null ? void 0 : _i.teacher_classroom_curricular_area_cycle) == null ? void 0 : _j.classroom) == null ? void 0 : _k.grade) + " " + ((_n = (_m = (_l = application_form == null ? void 0 : application_form.learning_session) == null ? void 0 : _l.teacher_classroom_curricular_area_cycle) == null ? void 0 : _m.classroom) == null ? void 0 : _n.section)
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "competency_id", children: "Competencia" }),
          /* @__PURE__ */ jsx(Input, { defaultValue: (_p = (_o = application_form == null ? void 0 : application_form.learning_session) == null ? void 0 : _o.competency) == null ? void 0 : _p.name })
        ] })
      ] }),
      /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold", children: "Ficha de Aplicación" }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-6 md:grid-cols-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "col-span-2 space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "name", children: "Título" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "name",
              value: data.name,
              onChange: (e) => setData("name", e.target.value),
              placeholder: "Ej: Evaluación de Matemáticas - Unidad 1"
            }
          ),
          /* @__PURE__ */ jsx(InputError, { message: errors.name, className: "mt-1" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { children: "Fecha de Inicio" }),
          /* @__PURE__ */ jsxs(Popover, { children: [
            /* @__PURE__ */ jsx(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Button, { variant: "outline", className: cn("w-full justify-start text-left font-normal", !data.start_date && "text-muted-foreground"), children: [
              /* @__PURE__ */ jsx(Calendar, { className: "mr-2 h-4 w-4" }),
              data.start_date ? format(new Date(data.start_date), "PPP", { locale: dateLocale }) : /* @__PURE__ */ jsx("span", { children: "Selecciona una fecha" })
            ] }) }),
            /* @__PURE__ */ jsx(PopoverContent, { className: "w-auto p-0", children: /* @__PURE__ */ jsx(
              Calendar$1,
              {
                mode: "single",
                selected: data.start_date ? new Date(data.start_date) : void 0,
                onSelect: (date) => handleDateSelect(date, "start_date"),
                disabled: { before: /* @__PURE__ */ new Date() },
                fromMonth: /* @__PURE__ */ new Date()
              }
            ) })
          ] }),
          /* @__PURE__ */ jsx(InputError, { message: errors.start_date, className: "mt-1" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { children: "Fecha de Fin" }),
          /* @__PURE__ */ jsxs(Popover, { children: [
            /* @__PURE__ */ jsx(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Button, { variant: "outline", className: cn("w-full justify-start text-left font-normal", !data.end_date && "text-muted-foreground"), children: [
              /* @__PURE__ */ jsx(Calendar, { className: "mr-2 h-4 w-4" }),
              data.end_date ? format(new Date(data.end_date), "PPP", { locale: dateLocale }) : /* @__PURE__ */ jsx("span", { children: "Selecciona una fecha" })
            ] }) }),
            /* @__PURE__ */ jsx(PopoverContent, { className: "w-auto p-0", children: /* @__PURE__ */ jsx(
              Calendar$1,
              {
                mode: "single",
                selected: data.end_date ? new Date(data.end_date) : void 0,
                onSelect: (date) => handleDateSelect(date, "end_date"),
                disabled: { before: data.start_date ? new Date(data.start_date) : /* @__PURE__ */ new Date() },
                fromMonth: data.start_date ? new Date(data.start_date) : /* @__PURE__ */ new Date()
              }
            ) })
          ] }),
          /* @__PURE__ */ jsx(InputError, { message: errors.end_date, className: "mt-1" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "score_max", children: "Puntaje Máximo" }),
          /* @__PURE__ */ jsxs("div", { className: "border-input bg-background ring-offset-background flex h-10 w-full rounded-md border px-3 py-2 text-sm", children: [
            data.score_max,
            " puntos"
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm", children: "Puntaje total basado en las preguntas seleccionadas" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "status", children: "Estado" }),
          /* @__PURE__ */ jsxs(Select, { value: data.status, onValueChange: (value) => setData("status", value), children: [
            /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Selecciona un estado" }) }),
            /* @__PURE__ */ jsxs(SelectContent, { children: [
              data.status === "draft" && /* @__PURE__ */ jsx(SelectItem, { value: "draft", children: "Borrador" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "active", children: "Activo" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "inactive", children: "Inactivo" })
            ] })
          ] }),
          /* @__PURE__ */ jsx(InputError, { message: errors.status, className: "mt-1" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "description", children: "Descripción" }),
        /* @__PURE__ */ jsx(
          Textarea,
          {
            id: "description",
            value: data.description,
            onChange: (e) => setData("description", e.target.value),
            placeholder: "Describe el propósito y contenido de esta ficha de aplicación...",
            className: "min-h-[120px]"
          }
        ),
        /* @__PURE__ */ jsx(InputError, { message: errors.description, className: "mt-1" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(Label, { className: "text-xl font-bold", children: "Capacidades" }) }),
        /* @__PURE__ */ jsx("div", { className: "space-y-4", children: (_r = (_q = application_form.learning_session) == null ? void 0 : _q.capabilities) == null ? void 0 : _r.map((capability) => /* @__PURE__ */ jsx("div", { className: cn("rounded-lg p-2", "bg-" + capability.color + "-500"), children: /* @__PURE__ */ jsx("span", { children: capability.name }) }, capability.id)) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold", children: "Preguntas" }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-4 lg:grid-cols-2", children: questions.map((question, index) => {
          const questionInForm = data.questions.find((q) => q.id === question.id);
          const isChecked = !!questionInForm;
          return /* @__PURE__ */ jsxs(
            "div",
            {
              style: {
                borderLeft: `4px solid ${question.capability.color}`
              },
              className: `dark:bg-opacity-20 hover:dark:bg-opacity-30 flex items-start gap-4 rounded-lg border border-gray-200 p-4 transition-all duration-200 ease-in-out hover:shadow-md dark:border-gray-700`,
              children: [
                /* @__PURE__ */ jsx("div", { className: "flex-shrink-0 pt-1", children: /* @__PURE__ */ jsx(
                  Checkbox,
                  {
                    id: `question-${question.id}`,
                    checked: isChecked,
                    onCheckedChange: (checked) => handleQuestionToggle(question.id, checked)
                  }
                ) }),
                /* @__PURE__ */ jsxs("div", { className: "flex-1 space-y-2", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
                      /* @__PURE__ */ jsx(Label, { htmlFor: `question-${question.id}`, className: "text-base", children: question.name }),
                      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm", children: question.description })
                    ] }),
                    getQuestionTypeBadge(question)
                  ] }),
                  (question.image || question.explanation_required) && /* @__PURE__ */ jsxs("div", { className: "flex gap-8", children: [
                    question.image && /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "gap-1 text-xs", children: "Tiene imagen" }),
                    question.explanation_required && /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "gap-1 text-xs", children: "Tiene explicación requerida" })
                  ] }),
                  isChecked && /* @__PURE__ */ jsxs("div", { className: "mt-2 grid grid-cols-1 gap-4 md:grid-cols-3", children: [
                    /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                      /* @__PURE__ */ jsx(Label, { htmlFor: `order-${question.id}`, children: "Orden" }),
                      /* @__PURE__ */ jsx(
                        Input,
                        {
                          id: `order-${question.id}`,
                          type: "number",
                          min: "1",
                          value: (questionInForm == null ? void 0 : questionInForm.order) || "",
                          onChange: (e) => {
                            const newOrder = parseInt(e.target.value) || 1;
                            handleOrderChange(question.id, newOrder);
                          },
                          className: "w-20"
                        }
                      ),
                      /* @__PURE__ */ jsx(InputError, { message: getNestedError(errors, `questions.${index}.order`), className: "mt-1" })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                      /* @__PURE__ */ jsx(Label, { htmlFor: `score-${question.id}`, children: "Puntaje" }),
                      /* @__PURE__ */ jsx(
                        Input,
                        {
                          id: `score-${question.id}`,
                          type: "number",
                          min: "0",
                          step: "0.25",
                          value: (questionInForm == null ? void 0 : questionInForm.score) || 1,
                          onChange: (e) => handleScoreChange(question, e.target.value),
                          className: "w-24"
                        }
                      ),
                      /* @__PURE__ */ jsx(InputError, { message: getNestedError(errors, `questions.${index}.score`), className: "mt-1" })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                      /* @__PURE__ */ jsx(Label, { htmlFor: `points-${question.id}`, children: "P. tienda" }),
                      /* @__PURE__ */ jsx(
                        Input,
                        {
                          id: `points-${question.id}`,
                          type: "number",
                          min: "0",
                          step: "0.25",
                          value: (questionInForm == null ? void 0 : questionInForm.points_store) || 0,
                          className: "w-24"
                        }
                      ),
                      /* @__PURE__ */ jsx(InputError, { message: getNestedError(errors, `questions.${index}.points_store`), className: "mt-1" }),
                      " "
                    ] })
                  ] })
                ] })
              ]
            },
            question.id
          );
        }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-4 pt-4", children: [
        /* @__PURE__ */ jsx(Link, { href: route("teacher.application-forms.index"), children: /* @__PURE__ */ jsx(Button, { type: "button", variant: "outline", children: "Cancelar" }) }),
        /* @__PURE__ */ jsx(Button, { type: "submit", disabled: processing, children: processing ? "Guardando..." : "Actualizar Ficha" })
      ] })
    ] }) })
  ] });
}
export {
  ApplicationFormEdit as default
};
