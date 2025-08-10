import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { I as InputError } from "./input-error-BCtMt8Ki.js";
import * as SelectPrimitive from "@radix-ui/react-select";
import { SearchIcon, LoaderCircle } from "lucide-react";
import * as React from "react";
import { useState } from "react";
import { c as cn, n as normalizeString } from "./utils-qggO9Hcn.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectItem } from "./select-qcG6mW7O.js";
import { B as Button } from "./button-BqjjxT-O.js";
import { D as Dialog, e as DialogTrigger, a as DialogContent, c as DialogTitle, f as DialogDescription } from "./dialog-CITBOAxv.js";
import { I as Input } from "./input-B1uJ3yMO.js";
import { L as Label } from "./label-CC7KirIj.js";
import { u as useTranslations } from "./translator-csgEc0di.js";
import { useForm } from "@inertiajs/react";
import { useQuery } from "@tanstack/react-query";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "@radix-ui/react-dialog";
import "@radix-ui/react-label";
function SearchableSelect({
  children,
  placeholder = "Buscar...",
  searchPlaceholder = "Buscar...",
  onSearchChange,
  searchValue = "",
  className,
  ...props
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const searchInputRef = React.useRef(null);
  const handleSearchChange = (e) => {
    onSearchChange == null ? void 0 : onSearchChange(e.target.value);
  };
  const handleOpenChange = (open) => {
    if (!open) {
      if (!searchValue) {
        setIsOpen(false);
      }
    } else {
      setIsOpen(true);
    }
  };
  React.useEffect(() => {
    if (isOpen && searchInputRef.current) {
      const timer = setTimeout(() => {
        var _a;
        (_a = searchInputRef.current) == null ? void 0 : _a.focus();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);
  const handleInputKeyDown = (e) => {
    const allowedKeys = ["ArrowDown", "ArrowUp", "Enter", "Escape", "Tab"];
    if (!allowedKeys.includes(e.key)) {
      e.stopPropagation();
    }
  };
  return /* @__PURE__ */ jsxs(Select, { ...props, open: isOpen, onOpenChange: handleOpenChange, children: [
    /* @__PURE__ */ jsx(SelectTrigger, { className: "w-full", children: /* @__PURE__ */ jsx(SelectValue, { placeholder }) }),
    /* @__PURE__ */ jsx(SelectPrimitive.Portal, { children: /* @__PURE__ */ jsxs(
      SelectPrimitive.Content,
      {
        className: cn(
          "bg-popover text-popover-foreground animate-in fade-in-80 z-50 max-h-40 min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-md border shadow-md",
          className
        ),
        position: "popper",
        sideOffset: 4,
        onPointerDownOutside: (e) => {
          if (searchValue) {
            e.preventDefault();
          }
        },
        onEscapeKeyDown: (e) => {
          if (searchValue) {
            e.preventDefault();
            onSearchChange == null ? void 0 : onSearchChange("");
          } else {
            setIsOpen(false);
          }
        },
        onKeyDown: (e) => {
          if (searchValue) {
            e.stopPropagation();
          }
        },
        children: [
          /* @__PURE__ */ jsxs("div", { className: "relative px-3 py-2", onClick: (e) => e.stopPropagation(), children: [
            /* @__PURE__ */ jsx(SearchIcon, { className: "text-muted-foreground absolute top-1/2 left-5 h-4 w-4 -translate-y-1/2" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                ref: searchInputRef,
                type: "text",
                placeholder: searchPlaceholder,
                value: searchValue,
                onChange: handleSearchChange,
                onKeyDown: handleInputKeyDown,
                className: "border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-8 w-full rounded-md border px-8 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
                onClick: (e) => e.stopPropagation()
              }
            )
          ] }),
          /* @__PURE__ */ jsx(
            SelectPrimitive.Viewport,
            {
              className: "p-1",
              onClick: (e) => e.stopPropagation(),
              onKeyDown: (e) => {
                if (searchValue) {
                  e.stopPropagation();
                }
              },
              children
            }
          )
        ]
      }
    ) })
  ] });
}
function CreateEnrollmentDialog({ isOpen, onOpenChange }) {
  const { t } = useTranslations();
  const [studentSearch, setStudentSearch] = useState("");
  const [classroomSearch, setClassroomSearch] = useState("");
  const initialValues = {
    academic_year: (/* @__PURE__ */ new Date()).getFullYear(),
    status_last_enrollment: "active",
    enrollment_date: (/* @__PURE__ */ new Date()).toISOString(),
    student_id: 0,
    classroom_id: 0
  };
  const { data: students } = useQuery({
    queryKey: ["students"],
    queryFn: () => fetch("/admin/students-to-enrollments").then((response) => response.json())
  });
  const studentsFiltered = students == null ? void 0 : students.filter((student) => {
    var _a, _b, _c;
    const searchTerm = normalizeString(studentSearch);
    if (!searchTerm) return true;
    const fullName = [(_a = student.profile) == null ? void 0 : _a.first_name, (_b = student.profile) == null ? void 0 : _b.last_name, (_c = student.profile) == null ? void 0 : _c.second_last_name].filter(Boolean).join(" ").toLowerCase();
    return fullName.includes(searchTerm);
  });
  const { data: classrooms } = useQuery({
    queryKey: ["classrooms"],
    queryFn: () => fetch("/admin/get-classrooms").then((response) => response.json())
  });
  const classroomsFiltered = classrooms == null ? void 0 : classrooms.filter((classroom) => {
    const searchTerm = normalizeString(classroomSearch);
    if (!searchTerm) return true;
    const classroomInfo = [classroom.grade, classroom.section, classroom.level].filter(Boolean).join(" ").toLowerCase();
    return classroomInfo.includes(searchTerm);
  });
  const { data, setData, post, processing, errors, reset } = useForm(initialValues);
  const handleSubmit = (e) => {
    e.preventDefault();
    post(route("admin.enrollments.store"), {
      preserveScroll: true,
      preserveState: true,
      onSuccess: () => {
        reset();
        onOpenChange(false);
      }
    });
  };
  return /* @__PURE__ */ jsxs(Dialog, { open: isOpen, onOpenChange, children: [
    /* @__PURE__ */ jsx(DialogTrigger, { asChild: true, className: "w-fit", children: /* @__PURE__ */ jsx(Button, { variant: isOpen ? "info" : "outline-info", children: "Agregar matricula" }) }),
    /* @__PURE__ */ jsxs(DialogContent, { className: "sm:max-w-[700px]", children: [
      /* @__PURE__ */ jsx(DialogTitle, { children: "Agregar matricula" }),
      /* @__PURE__ */ jsx(DialogDescription, { children: "Complete el formulario para agregar una nueva matricula." }),
      /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "flex flex-col gap-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(Label, { children: "Año academico" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                type: "number",
                placeholder: "Año academico",
                value: data.academic_year,
                onChange: (e) => setData("academic_year", Number(e.target.value))
              }
            ),
            /* @__PURE__ */ jsx(InputError, { message: errors.academic_year })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(Label, { children: "Fecha de matricula" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                type: "date",
                placeholder: "Fecha de matricula",
                value: data.enrollment_date,
                onChange: (e) => setData("enrollment_date", e.target.value)
              }
            ),
            /* @__PURE__ */ jsx(InputError, { message: errors.enrollment_date })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(Label, { children: "Estudiante" }),
            /* @__PURE__ */ jsx(
              SearchableSelect,
              {
                value: data.student_id.toString(),
                searchValue: studentSearch,
                onSearchChange: (value) => {
                  setStudentSearch(value);
                },
                onValueChange: (value) => setData("student_id", Number(value)),
                placeholder: "Buscar estudiante...",
                searchPlaceholder: "Buscar por nombre...",
                children: studentsFiltered == null ? void 0 : studentsFiltered.map((student) => {
                  var _a, _b, _c;
                  return /* @__PURE__ */ jsx(SelectItem, { value: student.user_id.toString(), children: `${(_a = student == null ? void 0 : student.profile) == null ? void 0 : _a.first_name} ${(_b = student == null ? void 0 : student.profile) == null ? void 0 : _b.last_name} ${(_c = student == null ? void 0 : student.profile) == null ? void 0 : _c.second_last_name}` }, student.user_id);
                })
              }
            ),
            /* @__PURE__ */ jsx(InputError, { message: errors.student_id })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(Label, { children: "Clase" }),
            /* @__PURE__ */ jsx(
              SearchableSelect,
              {
                value: data.classroom_id.toString(),
                searchValue: classroomSearch,
                onSearchChange: (value) => {
                  setClassroomSearch(value);
                },
                onValueChange: (value) => setData("classroom_id", Number(value)),
                placeholder: "Buscar clase...",
                searchPlaceholder: "Buscar por nombre...",
                children: classroomsFiltered == null ? void 0 : classroomsFiltered.map((classroom) => /* @__PURE__ */ jsx(SelectItem, { value: classroom.id.toString(), children: `${t(classroom.grade)} ${classroom.section} ${t(classroom.level)}` }, classroom.id))
              }
            ),
            /* @__PURE__ */ jsx(InputError, { message: errors.classroom_id })
          ] })
        ] }),
        /* @__PURE__ */ jsx(Button, { type: "submit", className: "mt-2 w-full", disabled: processing, children: processing ? /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }),
          "Guardando..."
        ] }) : "Guardar matricula" })
      ] })
    ] })
  ] });
}
export {
  CreateEnrollmentDialog
};
