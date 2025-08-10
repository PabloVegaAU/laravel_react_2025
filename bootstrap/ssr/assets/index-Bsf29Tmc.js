import { jsxs, jsx } from "react/jsx-runtime";
import { I as InputError } from "./input-error-CyRLkAox.js";
import { F as FlashMessages } from "./flash-messages-Brq5Zd2U.js";
import { M as MultiSelect, S as Switch } from "./switch-DzUMFecy.js";
import { B as Button } from "./button-B8Z_lz_J.js";
import { P as Popover, a as PopoverTrigger, b as PopoverContent, C as Calendar } from "./popover-5aXgFmPv.js";
import { I as Input } from "./input-Dr5dPtfm.js";
import { L as Label } from "./label-GjpnCFkz.js";
import { S as Select, a as SelectTrigger, b as SelectValue, d as SelectContent, c as SelectItem } from "./select-DMPk8oWi.js";
import { T as Textarea } from "./textarea-ClDEq31t.js";
import { A as AppLayout } from "./app-layout-Dq465f56.js";
import { u as useTranslations } from "./translator-csgEc0di.js";
import { c as cn } from "./utils-CpIjqAVa.js";
import { usePage, useForm, Head, Link } from "@inertiajs/react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon, LoaderCircle } from "lucide-react";
import { useState, useEffect } from "react";
import "sonner";
import "@radix-ui/react-switch";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "react-day-picker";
import "@radix-ui/react-popover";
import "@radix-ui/react-label";
import "@radix-ui/react-select";
import "@radix-ui/react-dialog";
import "./use-mobile-navigation-cG7zaCET.js";
import "@radix-ui/react-tooltip";
import "zustand";
import "zustand/middleware";
import "./app-logo-icon-Dnok8BqH.js";
import "./image-Bmp5thdH.js";
import "@radix-ui/react-dropdown-menu";
import "@radix-ui/react-avatar";
import "@tanstack/react-query";
import "clsx";
import "tailwind-merge";
const breadcrumbs = [
  {
    title: "Sesiones de Aprendizaje",
    href: "teacher/learning-session"
  }
];
function LearningSessionEdit({ learning_session, teacher_classroom_curricular_area_cycles }) {
  var _a, _b;
  const { educational_institution, teacher_classroom_curricular_area_cycle } = learning_session;
  const { auth } = usePage().props;
  const { t } = useTranslations();
  const [classrooms, setClassrooms] = useState([]);
  const [curricularAreas, setCurricularAreas] = useState([]);
  const [competencies, setCompetencies] = useState([]);
  const [capabilities, setCapabilities] = useState([]);
  const dateLocale = es;
  const { data, setData, put, hasErrors, processing, errors } = useForm({
    redirect: ((learning_session == null ? void 0 : learning_session.application_form) ?? 0) === 0,
    educational_institution_id: educational_institution == null ? void 0 : educational_institution.id,
    status: learning_session.status,
    name: learning_session.name,
    application_date: learning_session.application_date,
    teacher_classroom_curricular_area_cycle_id: learning_session.teacher_classroom_curricular_area_cycle_id.toString(),
    classroom_id: teacher_classroom_curricular_area_cycle == null ? void 0 : teacher_classroom_curricular_area_cycle.classroom_id.toString(),
    curricular_area_cycle_id: teacher_classroom_curricular_area_cycle == null ? void 0 : teacher_classroom_curricular_area_cycle.curricular_area_cycle_id.toString(),
    competency_id: learning_session.competency_id.toString(),
    capability_ids: ((_a = learning_session.capabilities) == null ? void 0 : _a.map((capability) => capability.id.toString())) || [],
    performances: learning_session.performances,
    purpose_learning: learning_session.purpose_learning,
    start_sequence: learning_session.start_sequence || "",
    application_form_id: ((_b = learning_session == null ? void 0 : learning_session.application_form) == null ? void 0 : _b.id.toString()) || "",
    end_sequence: learning_session.end_sequence || ""
  });
  useEffect(() => {
    const validClassrooms = (teacher_classroom_curricular_area_cycles || []).flatMap((area) => area.classroom ? [area.classroom] : []);
    const uniqueClassrooms = Array.from(new Map(validClassrooms.map((item) => [item.id, item])).values());
    setClassrooms(uniqueClassrooms);
  }, [teacher_classroom_curricular_area_cycles]);
  useEffect(() => {
    const validCurricularAreas = (teacher_classroom_curricular_area_cycles || []).filter((area) => area.classroom_id === Number(data.classroom_id)).flatMap((area) => area.curricular_area_cycle ? [area.curricular_area_cycle] : []).filter((area) => area !== void 0);
    setCurricularAreas(validCurricularAreas);
    setData("curricular_area_cycle_id", "");
    setCompetencies([]);
    setCapabilities([]);
  }, [data.classroom_id]);
  useEffect(() => {
    var _a2, _b2, _c;
    setCompetencies(
      ((_c = (_b2 = (_a2 = teacher_classroom_curricular_area_cycles.find((area) => area.curricular_area_cycle_id === Number(data.curricular_area_cycle_id))) == null ? void 0 : _a2.curricular_area_cycle) == null ? void 0 : _b2.curricular_area) == null ? void 0 : _c.competencies) || []
    );
    setData("competency_id", "");
    setCapabilities([]);
  }, [data.curricular_area_cycle_id]);
  useEffect(() => {
    var _a2, _b2, _c, _d, _e;
    setCapabilities(
      ((_e = (_d = (_c = (_b2 = (_a2 = teacher_classroom_curricular_area_cycles.find((area) => area.curricular_area_cycle_id === Number(data.curricular_area_cycle_id))) == null ? void 0 : _a2.curricular_area_cycle) == null ? void 0 : _b2.curricular_area) == null ? void 0 : _c.competencies) == null ? void 0 : _d.find((competency) => competency.id === Number(data.competency_id))) == null ? void 0 : _e.capabilities) || []
    );
    setData("capability_ids", []);
  }, [data.competency_id]);
  useEffect(() => {
    const teacherClassroomAreaCycle = teacher_classroom_curricular_area_cycles.find(
      (area) => area.curricular_area_cycle_id === Number(data.curricular_area_cycle_id) && area.classroom_id === Number(data.classroom_id)
    );
    if (!teacherClassroomAreaCycle) {
      return;
    }
    setData("teacher_classroom_curricular_area_cycle_id", teacherClassroomAreaCycle.id.toString());
  }, [data.curricular_area_cycle_id, data.classroom_id]);
  useEffect(() => {
    var _a2, _b2, _c, _d, _e, _f, _g, _h;
    if (learning_session) {
      setData({
        ...data,
        name: learning_session.name,
        status: learning_session.status,
        application_date: learning_session.application_date,
        purpose_learning: learning_session.purpose_learning,
        performances: learning_session.performances,
        start_sequence: learning_session.start_sequence || "",
        end_sequence: learning_session.end_sequence || "",
        teacher_classroom_curricular_area_cycle_id: ((_a2 = learning_session.teacher_classroom_curricular_area_cycle_id) == null ? void 0 : _a2.toString()) || "",
        competency_id: ((_b2 = learning_session.competency_id) == null ? void 0 : _b2.toString()) || "",
        capability_ids: ((_c = learning_session.capabilities) == null ? void 0 : _c.map((c) => c.id.toString())) || [],
        application_form_id: ((_e = (_d = learning_session.application_form) == null ? void 0 : _d.id) == null ? void 0 : _e.toString()) || ""
      });
      if ((_f = learning_session.teacher_classroom_curricular_area_cycle) == null ? void 0 : _f.classroom_id) {
        setData("classroom_id", learning_session.teacher_classroom_curricular_area_cycle.classroom_id.toString());
      }
      if ((_g = learning_session.teacher_classroom_curricular_area_cycle) == null ? void 0 : _g.curricular_area_cycle_id) {
        setData("curricular_area_cycle_id", learning_session.teacher_classroom_curricular_area_cycle.curricular_area_cycle_id.toString());
      }
      if (learning_session.competency) {
        setData("competency_id", learning_session.competency.id.toString());
        setData("capability_ids", ((_h = learning_session.capabilities) == null ? void 0 : _h.map((c) => c.id.toString())) || []);
      }
    }
  }, []);
  const handleSubmit = (e) => {
    e.preventDefault();
    put(route("teacher.learning-sessions.update", learning_session.id), {
      preserveScroll: true,
      preserveState: true
    });
  };
  return /* @__PURE__ */ jsxs(AppLayout, { breadcrumbs, children: [
    /* @__PURE__ */ jsx(Head, { title: t("session_learning.title", "Sesiones de Aprendizaje") }),
    /* @__PURE__ */ jsx(FlashMessages, {}),
    /* @__PURE__ */ jsx("div", { className: "flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4", children: /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-6 md:grid-cols-3", children: [
        /* @__PURE__ */ jsxs(Label, { children: [
          "UGEL: ",
          educational_institution == null ? void 0 : educational_institution.ugel
        ] }),
        /* @__PURE__ */ jsxs(Label, { children: [
          "I.E: ",
          educational_institution == null ? void 0 : educational_institution.name
        ] }),
        /* @__PURE__ */ jsxs(Label, { children: [
          "Docente: ",
          auth.user.name
        ] })
      ] }),
      /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold", children: "I. DATOS GENERALES:" }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-6 md:grid-cols-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
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
          /* @__PURE__ */ jsx(Label, { htmlFor: "application_date", children: "Fecha de la sesión" }),
          /* @__PURE__ */ jsxs(Popover, { children: [
            /* @__PURE__ */ jsx(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(
              Button,
              {
                variant: "outline",
                className: cn("w-full justify-start text-left font-normal", !data.application_date && "text-muted-foreground"),
                children: [
                  /* @__PURE__ */ jsx(CalendarIcon, { className: "mr-2 h-4 w-4" }),
                  data.application_date ? format(data.application_date, "PPP", { locale: dateLocale }) : /* @__PURE__ */ jsx("span", { children: "Selecciona una fecha" })
                ]
              }
            ) }),
            /* @__PURE__ */ jsx(PopoverContent, { className: "w-auto p-0", children: /* @__PURE__ */ jsx(
              Calendar,
              {
                mode: "single",
                selected: data.application_date ? new Date(data.application_date) : void 0,
                onSelect: (date) => {
                  setData("application_date", date || /* @__PURE__ */ new Date());
                },
                disabled: { before: /* @__PURE__ */ new Date() },
                startMonth: /* @__PURE__ */ new Date()
              }
            ) })
          ] }),
          /* @__PURE__ */ jsx(InputError, { message: errors.application_date, className: "mt-1" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "classroom_id", children: "Aula" }),
          /* @__PURE__ */ jsxs(Select, { value: data.classroom_id, onValueChange: (value) => setData("classroom_id", value), children: [
            /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Selecciona un aula" }) }),
            /* @__PURE__ */ jsx(SelectContent, { children: classrooms.map((classroom) => /* @__PURE__ */ jsxs(SelectItem, { value: classroom.id.toString(), children: [
              t(classroom.level),
              " ",
              t(classroom.grade),
              " ",
              classroom.section
            ] }, classroom.id)) })
          ] }),
          /* @__PURE__ */ jsx(InputError, { message: errors.classroom_id, className: "mt-1" })
        ] })
      ] }),
      /* @__PURE__ */ jsx("h1", { className: "text-xl font-bold", children: "II. PROPÓSITOS Y EVIDENCIAS DE APRENDIZAJE" }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-6 md:grid-cols-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "curricular_area_cycle_id", children: "Área Curricular" }),
          /* @__PURE__ */ jsxs(Select, { value: data.curricular_area_cycle_id, onValueChange: (value) => setData("curricular_area_cycle_id", value), children: [
            /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Selecciona una área curricular" }) }),
            /* @__PURE__ */ jsx(SelectContent, { children: curricularAreas.map((area) => {
              var _a2, _b2;
              return /* @__PURE__ */ jsxs(SelectItem, { value: area.id.toString(), children: [
                (_a2 = area == null ? void 0 : area.curricular_area) == null ? void 0 : _a2.name,
                " - CICLO ",
                (_b2 = area == null ? void 0 : area.cycle) == null ? void 0 : _b2.name
              ] }, area.id);
            }) })
          ] }),
          /* @__PURE__ */ jsx(InputError, { message: errors.curricular_area_cycle_id, className: "mt-1" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "competency_id", children: "Competencia" }),
          /* @__PURE__ */ jsxs(Select, { value: data.competency_id, onValueChange: (value) => setData("competency_id", value), children: [
            /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Selecciona una competencia" }) }),
            /* @__PURE__ */ jsx(SelectContent, { children: competencies.map((competency) => /* @__PURE__ */ jsx(SelectItem, { value: competency.id.toString(), children: competency.name }, competency.id)) })
          ] }),
          /* @__PURE__ */ jsx(InputError, { message: errors.competency_id, className: "mt-1" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { children: "Capacidades" }),
          /* @__PURE__ */ jsx(
            MultiSelect,
            {
              options: capabilities.map((capability) => ({
                label: capability.name,
                value: capability.id.toString()
              })),
              value: data.capability_ids,
              onChange: (values) => setData("capability_ids", values),
              placeholder: "Selecciona una o más capacidades",
              id: "capability_ids",
              name: "capability_ids"
            }
          ),
          /* @__PURE__ */ jsx(InputError, { message: errors.capability_ids, className: "mt-1" })
        ] })
      ] }),
      /* @__PURE__ */ jsx("h2", { className: "text-lg font-bold", children: "DESEMPEÑOS (PRECIZADO)" }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-6 lg:grid-cols-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "performances", children: "Desempeños" }),
          /* @__PURE__ */ jsx(
            Textarea,
            {
              id: "performances",
              value: data.performances,
              onChange: (e) => setData("performances", e.target.value),
              placeholder: "Ej: Desempeños"
            }
          ),
          /* @__PURE__ */ jsx(InputError, { message: errors.performances, className: "mt-1" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "purpose_learning", children: "Propósito de la sesión" }),
          /* @__PURE__ */ jsx(
            Textarea,
            {
              id: "purpose_learning",
              value: data.purpose_learning,
              onChange: (e) => setData("purpose_learning", e.target.value),
              placeholder: "Ej: Evaluación de Matemáticas - Unidad 1"
            }
          ),
          /* @__PURE__ */ jsx(InputError, { message: errors.purpose_learning, className: "mt-1" })
        ] })
      ] }),
      /* @__PURE__ */ jsx("h2", { className: "text-lg font-bold", children: "III. SECUENCIA DIDÁCTICA" }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-8 items-center gap-6", children: [
          /* @__PURE__ */ jsx("div", { className: "col-span-2 flex size-full flex-col items-center justify-center gap-2", children: "INICIO" }),
          /* @__PURE__ */ jsxs("div", { className: "col-span-6 w-full space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "start_sequence", children: "Secuencia de inicio" }),
            /* @__PURE__ */ jsx(
              Textarea,
              {
                id: "start_sequence",
                value: data.start_sequence,
                onChange: (e) => setData("start_sequence", e.target.value),
                placeholder: "Ej: Secuencia de inicio"
              }
            ),
            /* @__PURE__ */ jsx(InputError, { message: errors.start_sequence, className: "mt-1" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-8 items-center gap-6", children: [
          /* @__PURE__ */ jsx("div", { className: "col-span-2 flex size-full flex-col items-center justify-center gap-2 border-6 border-emerald-600 bg-emerald-500", children: "DESARROLLO" }),
          /* @__PURE__ */ jsxs("div", { className: "col-span-6 w-full space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "application_form_ids", children: "Formularios de aplicación" }),
            /* @__PURE__ */ jsxs("div", { children: [
              (learning_session == null ? void 0 : learning_session.application_form) && /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 items-center gap-2 space-y-2", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex w-full flex-col gap-2", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
                    /* @__PURE__ */ jsx(Label, { children: "NOMBRE:" }),
                    /* @__PURE__ */ jsx("p", { children: learning_session.application_form.name })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
                    /* @__PURE__ */ jsx(Label, { children: "FECHA INICIO:" }),
                    /* @__PURE__ */ jsx("p", { children: format(learning_session.application_form.start_date, "dd/MM/yyyy") })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
                    /* @__PURE__ */ jsx(Label, { children: "FECHA FIN:" }),
                    /* @__PURE__ */ jsx("p", { children: format(learning_session.application_form.end_date, "dd/MM/yyyy") })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex w-full flex-col gap-2", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
                    /* @__PURE__ */ jsx(Label, { children: "ESTADO:" }),
                    /* @__PURE__ */ jsx("div", { children: t(learning_session.application_form.status) })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
                    /* @__PURE__ */ jsx(Label, { children: "ACCIONES:" }),
                    /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
                      /* @__PURE__ */ jsx(Link, { href: `/teacher/application-forms/${learning_session.application_form.id}`, children: /* @__PURE__ */ jsx(Button, { variant: "info", size: "sm", children: "Ver" }) }),
                      /* @__PURE__ */ jsx(Link, { href: `/teacher/application-forms/${learning_session.application_form.id}/edit`, children: /* @__PURE__ */ jsx(Button, { variant: "warning", size: "sm", children: "Editar" }) })
                    ] })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: cn("flex items-center space-x-2", data.application_form_id ? "hidden" : ""), children: [
                /* @__PURE__ */ jsx(Switch, { id: "redirect-to-form", checked: data.redirect, onCheckedChange: (checked) => setData("redirect", checked) }),
                /* @__PURE__ */ jsx(Label, { htmlFor: "redirect-to-form", children: "Crear Ficha luego de guardar" })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-8 items-center gap-6", children: [
          /* @__PURE__ */ jsx("div", { className: "col-span-2 flex size-full flex-col items-center justify-center gap-2", children: "CIERRE" }),
          /* @__PURE__ */ jsxs("div", { className: "col-span-6 w-full space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "end_sequence", children: "Secuencia de cierre" }),
            /* @__PURE__ */ jsx(
              Textarea,
              {
                id: "end_sequence",
                value: data.end_sequence,
                onChange: (e) => setData("end_sequence", e.target.value),
                placeholder: "Ej: Secuencia de cierre"
              }
            ),
            /* @__PURE__ */ jsx(InputError, { message: errors.end_sequence, className: "mt-1" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center", children: /* @__PURE__ */ jsxs(Button, { type: "submit", disabled: hasErrors || processing, children: [
        processing && /* @__PURE__ */ jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }),
        processing ? "Guardando..." : "Guardar Ficha de Aplicación"
      ] }) })
    ] }) })
  ] });
}
export {
  LearningSessionEdit as default
};
