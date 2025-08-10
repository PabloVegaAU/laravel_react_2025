import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { I as InputError } from "./input-error-BCtMt8Ki.js";
import { B as Button } from "./button-BqjjxT-O.js";
import { C as Checkbox } from "./checkbox-B_r2H9BE.js";
import { D as Dialog, e as DialogTrigger, a as DialogContent, c as DialogTitle, f as DialogDescription } from "./dialog-CITBOAxv.js";
import { I as Input } from "./input-B1uJ3yMO.js";
import { L as Label } from "./label-CC7KirIj.js";
import { S as Select, a as SelectTrigger, b as SelectValue, d as SelectContent, c as SelectItem } from "./select-qcG6mW7O.js";
import { T as Textarea } from "./textarea-DQiokWve.js";
import { u as useTranslations } from "./translator-csgEc0di.js";
import { useForm } from "@inertiajs/react";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { PencilIcon, X, LoaderCircle } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { MatchingOptions } from "./MatchingOptions-D4dRcsQ7.js";
import { OrderingOptions } from "./OrderingOptions-CzBeIvT6.js";
import { SingleChoiceOptions } from "./SingleChoiceOptions-D8MJii43.js";
import { TrueFalseOptions } from "./TrueFalseOptions-CY2DJnPC.js";
import "./utils-qggO9Hcn.js";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "@radix-ui/react-checkbox";
import "@radix-ui/react-dialog";
import "@radix-ui/react-label";
import "@radix-ui/react-select";
import "./BaseQuestionType-vuBW0I6d.js";
import "@radix-ui/react-radio-group";
function EditQuestionDialog({
  isOpen,
  id,
  curricularAreas,
  competencies: allCompetencies,
  capabilities: allCapabilities,
  difficulties,
  questionTypes,
  onOpenChange,
  onSuccess
}) {
  const { t } = useTranslations();
  const [initialized, setInitialized] = useState(false);
  const queryClient = useQueryClient();
  const { data: question } = useQuery({
    queryKey: ["question", id],
    queryFn: () => fetch(`/teacher/questions/${id}/edit`).then((res) => res.json()),
    enabled: isOpen && !!id,
    staleTime: 1e3 * 60 * 5,
    // 5 minutos
    refetchOnWindowFocus: false
  });
  const initialValues = useMemo(
    () => ({
      name: "",
      description: "",
      difficulty: "medium",
      question_type_id: "1",
      capability_id: "",
      curricular_area_cycle_id: "",
      competency_id: "",
      options: [],
      help_message: "",
      explanation_required: false,
      image: null
    }),
    []
  );
  const { data, setData, post, processing, errors, reset } = useForm(initialValues);
  const { competenciesByCurricularArea, capabilitiesByCompetency } = useMemo(() => {
    const competenciesMap = allCompetencies.reduce((acc, competency) => {
      const areaId = competency.curricular_area_cycle_id.toString();
      if (!acc[areaId]) acc[areaId] = [];
      acc[areaId].push(competency);
      return acc;
    }, {});
    const capabilitiesMap = allCapabilities.reduce((acc, capability) => {
      var _a;
      const competencyId = ((_a = capability.competency_id) == null ? void 0 : _a.toString()) || "";
      if (competencyId) {
        if (!acc[competencyId]) acc[competencyId] = [];
        acc[competencyId].push(capability);
      }
      return acc;
    }, {});
    return { competenciesByCurricularArea: competenciesMap, capabilitiesByCompetency: capabilitiesMap };
  }, [allCompetencies, allCapabilities]);
  const filteredCompetencies = useMemo(() => {
    var _a, _b, _c;
    const areaId = data.curricular_area_cycle_id || ((_c = (_b = (_a = question == null ? void 0 : question.capability) == null ? void 0 : _a.competency) == null ? void 0 : _b.curricular_area_cycle_id) == null ? void 0 : _c.toString());
    return areaId ? competenciesByCurricularArea[areaId] || [] : [];
  }, [data.curricular_area_cycle_id, competenciesByCurricularArea, question]);
  const filteredCapabilities = useMemo(() => {
    var _a, _b;
    const compId = data.competency_id || ((_b = (_a = question == null ? void 0 : question.capability) == null ? void 0 : _a.competency_id) == null ? void 0 : _b.toString());
    return compId ? capabilitiesByCompetency[compId] || [] : [];
  }, [data.competency_id, capabilitiesByCompetency, question]);
  useEffect(() => {
    var _a, _b, _c, _d, _e, _f, _g;
    if (isOpen && question && !initialized) {
      const formData = {
        name: question.name,
        description: question.description || "",
        difficulty: question.difficulty,
        question_type_id: ((_a = question.question_type_id) == null ? void 0 : _a.toString()) || "",
        curricular_area_cycle_id: ((_d = (_c = (_b = question.capability) == null ? void 0 : _b.competency) == null ? void 0 : _c.curricular_area_cycle_id) == null ? void 0 : _d.toString()) || "",
        competency_id: ((_f = (_e = question.capability) == null ? void 0 : _e.competency_id) == null ? void 0 : _f.toString()) || "",
        capability_id: ((_g = question.capability_id) == null ? void 0 : _g.toString()) || "",
        options: Array.isArray(question.options) ? question.options : [],
        help_message: question.help_message || "",
        explanation_required: Boolean(question.explanation_required),
        image: question.image || null
      };
      setData(formData);
      setInitialized(true);
    }
  }, [isOpen, question, initialized, setData]);
  useEffect(() => {
    var _a, _b, _c, _d, _e;
    if (initialized && isOpen && question) {
      const currentAreaId = data.curricular_area_cycle_id;
      const questionAreaId = (_c = (_b = (_a = question.capability) == null ? void 0 : _a.competency) == null ? void 0 : _b.curricular_area_cycle_id) == null ? void 0 : _c.toString();
      const currentCompetencyId = data.competency_id;
      const questionCompetencyId = (_e = (_d = question.capability) == null ? void 0 : _d.competency_id) == null ? void 0 : _e.toString();
      if (currentAreaId && currentAreaId !== questionAreaId) {
        setData("competency_id", "");
        setData("capability_id", "");
      } else if (currentCompetencyId && currentCompetencyId !== questionCompetencyId) {
        setData("capability_id", "");
      }
    }
  }, [initialized, data.curricular_area_cycle_id, data.competency_id, setData, isOpen, question]);
  useEffect(() => {
    if (!isOpen) {
      reset();
      setInitialized(false);
    }
  }, [isOpen, reset]);
  const handleSubmit = (e) => {
    e.preventDefault();
    post(route("teacher.questions.update", id), {
      forceFormData: true,
      preserveScroll: true,
      preserveState: true,
      onSuccess: () => {
        onSuccess == null ? void 0 : onSuccess();
        reset();
        queryClient.invalidateQueries({ queryKey: ["question", id] });
      }
    });
  };
  return /* @__PURE__ */ jsxs(Dialog, { open: isOpen, onOpenChange, children: [
    /* @__PURE__ */ jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsx(PencilIcon, { className: "h-4 w-4", onClick: () => onOpenChange(true) }) }),
    /* @__PURE__ */ jsxs(DialogContent, { className: "max-h-[100vh] overflow-scroll sm:max-w-[700px]", children: [
      /* @__PURE__ */ jsx(DialogTitle, { children: "Editar Pregunta" }),
      /* @__PURE__ */ jsx(DialogDescription, { children: "Complete el formulario para edit una nueva pregunta." }),
      /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "flex flex-col gap-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "curricular_area_cycle_id", children: "Área Curricular *" }),
          /* @__PURE__ */ jsxs(Select, { value: data.curricular_area_cycle_id, onValueChange: (value) => setData("curricular_area_cycle_id", value), children: [
            /* @__PURE__ */ jsx(SelectTrigger, { id: "curricular_area_cycle_id", name: "curricular_area_cycle_id", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Selecciona un área curricular" }) }),
            /* @__PURE__ */ jsx(SelectContent, { children: curricularAreas.map((area) => /* @__PURE__ */ jsx(SelectItem, { value: area.id.toString(), children: area.name }, area.id)) })
          ] }),
          errors.curricular_area_cycle_id && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-500", children: errors.curricular_area_cycle_id })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "competency_id", children: "Competencia *" }),
          /* @__PURE__ */ jsxs(Select, { value: data.competency_id, onValueChange: (value) => setData("competency_id", value), disabled: !data.curricular_area_cycle_id, children: [
            /* @__PURE__ */ jsx(SelectTrigger, { id: "competency_id", name: "competency_id", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: !data.curricular_area_cycle_id ? "Primero selecciona un área curricular" : "Selecciona una competencia" }) }),
            /* @__PURE__ */ jsx(SelectContent, { children: filteredCompetencies.map((competency) => /* @__PURE__ */ jsx(SelectItem, { value: competency.id.toString(), children: competency.name }, competency.id)) })
          ] }),
          /* @__PURE__ */ jsx(InputError, { message: errors.competency_id })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "capability_id", children: "Capacidad *" }),
          /* @__PURE__ */ jsxs(Select, { value: data.capability_id, onValueChange: (value) => setData("capability_id", value), disabled: !data.competency_id, children: [
            /* @__PURE__ */ jsx(SelectTrigger, { id: "capability_id", name: "capability_id", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: !data.competency_id ? "Primero selecciona una competencia" : "Selecciona una capacidad" }) }),
            /* @__PURE__ */ jsx(SelectContent, { children: filteredCapabilities.map((capability) => /* @__PURE__ */ jsx(SelectItem, { value: capability.id.toString(), children: capability.name }, capability.id)) })
          ] }),
          /* @__PURE__ */ jsx(InputError, { message: errors.capability_id })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-6 sm:flex-row sm:gap-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-1 flex-col gap-2", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "question_type_id", children: "Tipo de Pregunta *" }),
            /* @__PURE__ */ jsxs(Select, { value: data.question_type_id, onValueChange: (value) => setData("question_type_id", value), required: true, children: [
              /* @__PURE__ */ jsx(SelectTrigger, { id: "question_type_id", name: "question_type_id", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Selecciona un tipo de pregunta" }) }),
              /* @__PURE__ */ jsx(SelectContent, { children: questionTypes.map((questionType) => /* @__PURE__ */ jsx(SelectItem, { value: questionType.id.toString(), children: questionType.name }, questionType.id)) })
            ] }),
            /* @__PURE__ */ jsx(InputError, { message: errors.question_type_id })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-1 flex-col gap-2", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "difficulty", children: "Dificultad *" }),
            /* @__PURE__ */ jsxs(Select, { value: data.difficulty, onValueChange: (value) => setData("difficulty", value), required: true, children: [
              /* @__PURE__ */ jsx(SelectTrigger, { id: "difficulty", name: "difficulty", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Selecciona la dificultad" }) }),
              /* @__PURE__ */ jsx(SelectContent, { children: difficulties.map((difficulty) => /* @__PURE__ */ jsx(SelectItem, { value: difficulty, children: t(difficulty) }, difficulty)) })
            ] }),
            /* @__PURE__ */ jsx(InputError, { message: errors.difficulty })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
            /* @__PURE__ */ jsx(
              Checkbox,
              {
                id: "explanation_required",
                name: "explanation_required",
                checked: data.explanation_required,
                onCheckedChange: (value) => setData("explanation_required", value)
              }
            ),
            /* @__PURE__ */ jsxs(Label, { htmlFor: "explanation_required", children: [
              "Explicación",
              /* @__PURE__ */ jsx("br", {}),
              "requerida"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "image", className: "self-start", children: "Imagen" }),
          /* @__PURE__ */ jsxs("div", { className: "flex w-full flex-col items-center gap-4", children: [
            data.image ? /* @__PURE__ */ jsxs("div", { className: "relative flex w-full max-w-xs justify-center", children: [
              /* @__PURE__ */ jsx("div", { className: "border-input relative h-48 w-full max-w-xs overflow-hidden rounded-md border", children: /* @__PURE__ */ jsx(
                "img",
                {
                  src: typeof data.image === "string" ? data.image : URL.createObjectURL(data.image),
                  alt: "Preview",
                  className: "h-full w-full object-contain p-2"
                }
              ) }),
              /* @__PURE__ */ jsx(
                Button,
                {
                  type: "button",
                  variant: "destructive",
                  size: "icon",
                  className: "absolute -top-2 -right-2 h-6 w-6 rounded-full",
                  onClick: (e) => {
                    e.preventDefault();
                    setData("image", null);
                    const input = document.getElementById("image");
                    if (input) input.value = "";
                  },
                  children: /* @__PURE__ */ jsx(X, { className: "h-3 w-3" })
                }
              )
            ] }) : /* @__PURE__ */ jsx("div", { className: "flex h-32 w-full max-w-xs items-center justify-center rounded-md border-2 border-dashed", children: /* @__PURE__ */ jsx("span", { className: "text-muted-foreground px-2 text-center", children: "Vista previa de la imagen aparecerá aquí" }) }),
            /* @__PURE__ */ jsx("div", { className: "w-full max-w-xs", children: /* @__PURE__ */ jsx(
              Input,
              {
                id: "image",
                name: "image",
                type: "file",
                accept: "image/*",
                className: "w-full",
                onChange: (e) => {
                  var _a;
                  const file = (_a = e.target.files) == null ? void 0 : _a[0];
                  if (file) {
                    setData("image", file);
                  }
                }
              }
            ) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "name", children: "Título" }),
          /* @__PURE__ */ jsx(Input, { id: "name", name: "name", type: "text", value: data.name, onChange: (e) => setData("name", e.target.value), required: true }),
          /* @__PURE__ */ jsx(InputError, { message: errors.name })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "description", children: "Descripción" }),
          /* @__PURE__ */ jsx(Textarea, { id: "description", name: "description", value: data.description, onChange: (e) => setData("description", e.target.value) }),
          /* @__PURE__ */ jsx(InputError, { message: errors.description })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
          /* @__PURE__ */ jsx(InputError, { message: errors.options }),
          data.question_type_id === "1" && /* @__PURE__ */ jsx(SingleChoiceOptions, { options: data.options, onChange: (newOptions) => setData("options", newOptions), disabled: processing }),
          data.question_type_id === "2" && /* @__PURE__ */ jsx(OrderingOptions, { options: data.options, onChange: (newOptions) => setData("options", newOptions), disabled: processing }),
          data.question_type_id === "3" && /* @__PURE__ */ jsx(MatchingOptions, { options: data.options, onChange: (newOptions) => setData("options", newOptions), disabled: processing }),
          data.question_type_id === "4" && /* @__PURE__ */ jsx(TrueFalseOptions, { options: data.options, onChange: (newOptions) => setData("options", newOptions), disabled: processing })
        ] }),
        /* @__PURE__ */ jsx(
          Button,
          {
            type: "submit",
            className: "mt-2 w-full",
            disabled: processing || !data.curricular_area_cycle_id || !data.competency_id || !data.capability_id || !data.question_type_id || !data.difficulty || !data.name.trim() || // Validación para selección única
            data.question_type_id === "1" && (data.options.length < 2 || !data.options.every((opt) => opt.value.trim()) || !data.options.some((opt) => opt.is_correct)) || // Validación para ordenar
            data.question_type_id === "2" && (data.options.length < 2 || !data.options.every((opt) => opt.value.trim())) || // Validación para emparejar
            data.question_type_id === "3" && (data.options.length < 2 || data.options.length % 2 !== 0 || !data.options.every((opt) => opt.value.trim()) || Array.from({ length: Math.ceil(data.options.length / 2) }).some((_, i) => {
              const first = data.options[i * 2];
              const second = data.options[i * 2 + 1];
              return !(first == null ? void 0 : first.value.trim()) || !(second == null ? void 0 : second.value.trim());
            })),
            children: processing ? /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }),
              "Guardando..."
            ] }) : "Guardar Pregunta"
          }
        )
      ] })
    ] })
  ] });
}
export {
  EditQuestionDialog
};
