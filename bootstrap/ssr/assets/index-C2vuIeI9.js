import { jsxs, jsx } from "react/jsx-runtime";
import { F as FlashMessages } from "./flash-messages-Brq5Zd2U.js";
import { B as Badge } from "./badge-65mno7eO.js";
import { C as Card, a as CardHeader, b as CardTitle, c as CardContent } from "./card-CN8XFMfu.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-BeW_tWiO.js";
import { A as AppLayout } from "./app-layout-Dq465f56.js";
import { b as formatDateTime, f as formatDate, c as formatTimeDifference } from "./formats-DYgp-paT.js";
import { u as useTranslations } from "./translator-csgEc0di.js";
import { Head } from "@inertiajs/react";
import { Award, CheckCircle, AlertCircle, Trophy, Clock, XCircle, Medal } from "lucide-react";
import { useMemo } from "react";
import "sonner";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./utils-CpIjqAVa.js";
import "clsx";
import "tailwind-merge";
import "./button-B8Z_lz_J.js";
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
function LearningSessionShow({ learning_session }) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r;
  const { t } = useTranslations();
  const breadcrumbs = [
    {
      title: "Inicio",
      href: "/student/dashboard"
    },
    {
      title: t("Learning Sessions"),
      href: "/student/learning-sessions"
    },
    {
      title: learning_session.name,
      href: "/student/learning-sessions/" + learning_session.id
    }
  ];
  const sortedResponses = useMemo(() => {
    var _a2;
    if (!((_a2 = learning_session.application_form) == null ? void 0 : _a2.responses)) return [];
    return [...learning_session.application_form.responses].sort((a, b) => {
      const scoreA = parseFloat(String(a.score) || "0");
      const scoreB = parseFloat(String(b.score) || "0");
      if (scoreA !== scoreB) {
        return scoreB - scoreA;
      }
      if (a.submitted_at && b.submitted_at) {
        return new Date(a.submitted_at).getTime() - new Date(b.submitted_at).getTime();
      }
      if (a.submitted_at && !b.submitted_at) return -1;
      if (!a.submitted_at && b.submitted_at) return 1;
      return 0;
    });
  }, [(_a = learning_session.application_form) == null ? void 0 : _a.responses]);
  const getStatusIcon = (status) => {
    switch (status) {
      case "submitted":
        return /* @__PURE__ */ jsx(CheckCircle, { className: "h-4 w-4 text-green-500" });
      case "graded":
        return /* @__PURE__ */ jsx(Award, { className: "h-4 w-4 text-blue-500" });
      case "pending":
        return /* @__PURE__ */ jsx(AlertCircle, { className: "h-4 w-4 text-yellow-500" });
      default:
        return /* @__PURE__ */ jsx(XCircle, { className: "h-4 w-4 text-gray-400" });
    }
  };
  const getStatusBadge = (status) => {
    const variants = {
      submitted: "default",
      graded: "secondary",
      pending: "outline"
    };
    return /* @__PURE__ */ jsx(Badge, { variant: variants[status] || "outline", children: t(status) });
  };
  const getRankingIcon = (index) => {
    switch (index) {
      case 0:
        return /* @__PURE__ */ jsx(Trophy, { className: "h-5 w-5 text-yellow-500" });
      case 1:
        return /* @__PURE__ */ jsx(Medal, { className: "h-5 w-5 text-gray-400" });
      case 2:
        return /* @__PURE__ */ jsx(Award, { className: "h-5 w-5 text-amber-600" });
      default:
        return /* @__PURE__ */ jsxs("span", { className: "text-sm font-semibold text-gray-500", children: [
          "#",
          index + 1
        ] });
    }
  };
  const getScoreColor = (score, maxScore2) => {
    const percentage = score / maxScore2 * 100;
    if (percentage >= 90) return "text-green-600 font-bold";
    if (percentage >= 70) return "text-blue-600 font-semibold";
    if (percentage >= 50) return "text-yellow-600";
    return "text-red-600";
  };
  const hasApplicationForm = !!learning_session.application_form;
  const hasResponses = hasApplicationForm && (((_c = (_b = learning_session.application_form) == null ? void 0 : _b.responses) == null ? void 0 : _c.length) ?? 0) > 0;
  const maxScore = hasApplicationForm ? parseFloat(String(((_d = learning_session == null ? void 0 : learning_session.application_form) == null ? void 0 : _d.score_max) || "20")) : 20;
  return /* @__PURE__ */ jsxs(AppLayout, { breadcrumbs, children: [
    /* @__PURE__ */ jsx(Head, { title: t("Learning Session") }),
    /* @__PURE__ */ jsx(FlashMessages, {}),
    /* @__PURE__ */ jsxs("div", { className: "flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-6", children: [
      /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsxs(CardTitle, { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Award, { className: "h-5 w-5" }),
          learning_session.name
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "text-sm text-gray-600", children: [
          /* @__PURE__ */ jsxs("p", { children: [
            /* @__PURE__ */ jsx("strong", { children: "Área curricular:" }),
            " ",
            (_g = (_f = (_e = learning_session.teacher_classroom_curricular_area_cycle) == null ? void 0 : _e.curricular_area_cycle) == null ? void 0 : _f.curricular_area) == null ? void 0 : _g.name
          ] }),
          /* @__PURE__ */ jsxs("p", { children: [
            /* @__PURE__ */ jsx("strong", { children: "Grado:" }),
            " ",
            t((_i = (_h = learning_session.teacher_classroom_curricular_area_cycle) == null ? void 0 : _h.classroom) == null ? void 0 : _i.grade),
            " Sección",
            " ",
            (_k = (_j = learning_session.teacher_classroom_curricular_area_cycle) == null ? void 0 : _j.classroom) == null ? void 0 : _k.section,
            " -",
            " ",
            t((_m = (_l = learning_session.teacher_classroom_curricular_area_cycle) == null ? void 0 : _l.classroom) == null ? void 0 : _m.level)
          ] }),
          /* @__PURE__ */ jsxs("p", { children: [
            /* @__PURE__ */ jsx("strong", { children: "Fecha de aplicación:" }),
            " ",
            formatDateTime(String(learning_session.application_date))
          ] })
        ] })
      ] }) }),
      hasApplicationForm ? /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsxs(CardTitle, { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(CheckCircle, { className: "h-5 w-5 text-green-500" }),
          "Ficha de Evaluación: ",
          (_n = learning_session.application_form) == null ? void 0 : _n.name
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-4 text-sm", children: [
          /* @__PURE__ */ jsxs("span", { children: [
            "Puntuación máxima: ",
            /* @__PURE__ */ jsxs("strong", { children: [
              (_o = learning_session.application_form) == null ? void 0 : _o.score_max,
              " pts"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("span", { children: [
            "Estado: ",
            /* @__PURE__ */ jsx(Badge, { variant: "default", children: (_p = learning_session.application_form) == null ? void 0 : _p.status })
          ] }),
          /* @__PURE__ */ jsxs("span", { children: [
            "Período: ",
            formatDate(String(((_q = learning_session == null ? void 0 : learning_session.application_form) == null ? void 0 : _q.start_date) || "")),
            " -",
            " ",
            formatDate(String(((_r = learning_session == null ? void 0 : learning_session.application_form) == null ? void 0 : _r.end_date) || ""))
          ] })
        ] })
      ] }) }) : /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(CardContent, { className: "pt-6", children: /* @__PURE__ */ jsxs("div", { className: "text-center text-gray-500", children: [
        /* @__PURE__ */ jsx(AlertCircle, { className: "mx-auto mb-2 h-8 w-8" }),
        /* @__PURE__ */ jsx("p", { children: "No hay ficha de evaluación asociada a esta sesión de aprendizaje." })
      ] }) }) }),
      hasResponses ? /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsxs(CardTitle, { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Trophy, { className: "h-5 w-5" }),
            "Tabla de Puntuaciones"
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600", children: "Ordenado por puntuación (mayor a menor) y fecha de envío (primero en enviar)" })
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { children: [
          /* @__PURE__ */ jsxs(Table, { children: [
            /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
              /* @__PURE__ */ jsx(TableHead, { className: "w-16", children: "Puesto" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Estudiante" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Puntuación" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Estado" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Fecha de inicio" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Fecha de Envío" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Fecha de Calificación" }),
              /* @__PURE__ */ jsx(TableHead, { className: "w-24", children: "Tiempo" })
            ] }) }),
            /* @__PURE__ */ jsx(TableBody, { children: sortedResponses.map((response, index) => {
              var _a2, _b2, _c2;
              const score = Number(response.score);
              const scorePercentage = (score / maxScore * 100).toFixed(1);
              return /* @__PURE__ */ jsxs(TableRow, { className: index < 3 ? "bg-gradient-to-r from-yellow-50 to-transparent" : "", children: [
                /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center", children: getRankingIcon(index) }) }),
                /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx("div", { className: "font-medium", children: `${(_a2 = response.student.profile) == null ? void 0 : _a2.first_name} ${(_b2 = response.student.profile) == null ? void 0 : _b2.last_name} ${(_c2 = response.student.profile) == null ? void 0 : _c2.second_last_name}` }) }),
                /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
                  /* @__PURE__ */ jsx("span", { className: `text-lg font-bold ${getScoreColor(score, maxScore)}`, children: score.toFixed(2) }),
                  /* @__PURE__ */ jsxs("span", { className: "text-xs text-gray-500", children: [
                    scorePercentage,
                    "% de ",
                    maxScore
                  ] })
                ] }) }),
                /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                  getStatusIcon(response.status),
                  getStatusBadge(response.status)
                ] }) }),
                /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                  response.started_at && /* @__PURE__ */ jsx(Clock, { className: "h-4 w-4 text-gray-400" }),
                  /* @__PURE__ */ jsx("span", { className: response.started_at ? "text-green-600" : "text-gray-400", children: formatDateTime(response.started_at) })
                ] }) }),
                /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                  response.submitted_at && /* @__PURE__ */ jsx(Clock, { className: "h-4 w-4 text-gray-400" }),
                  /* @__PURE__ */ jsx("span", { className: response.submitted_at ? "text-green-600" : "text-gray-400", children: formatDateTime(response.submitted_at) })
                ] }) }),
                /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx("span", { className: response.graded_at ? "text-blue-600" : "text-gray-400", children: formatDateTime(response.graded_at) }) }),
                /* @__PURE__ */ jsx(TableCell, { children: response.submitted_at && response.started_at && /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "text-xs", children: formatTimeDifference(response.started_at, response.submitted_at) }) })
              ] }, response.id);
            }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-6 grid grid-cols-2 gap-4 md:grid-cols-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "rounded-lg bg-blue-50 p-4 text-center", children: [
              /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-blue-600", children: sortedResponses.length }),
              /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-600", children: "Total de Respuestas" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "rounded-lg bg-green-50 p-4 text-center", children: [
              /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-green-600", children: sortedResponses.filter((r) => r.status === "submitted").length }),
              /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-600", children: "Enviadas" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "rounded-lg bg-yellow-50 p-4 text-center", children: [
              /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-yellow-600", children: sortedResponses.length > 0 ? (sortedResponses.reduce((sum, r) => sum + parseFloat(String(r.score || "0")), 0) / sortedResponses.length).toFixed(2) : "0" }),
              /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-600", children: "Promedio" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "rounded-lg bg-purple-50 p-4 text-center", children: [
              /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-purple-600", children: sortedResponses.length > 0 ? Math.max(...sortedResponses.map((r) => parseFloat(String(r.score || "0")))).toFixed(2) : "0" }),
              /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-600", children: "Mejor Puntuación" })
            ] })
          ] })
        ] })
      ] }) : hasApplicationForm ? /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(CardContent, { className: "pt-6", children: /* @__PURE__ */ jsxs("div", { className: "text-center text-gray-500", children: [
        /* @__PURE__ */ jsx(Clock, { className: "mx-auto mb-2 h-8 w-8" }),
        /* @__PURE__ */ jsx("p", { children: "Aún no hay respuestas de estudiantes para esta ficha de evaluación." })
      ] }) }) }) : null
    ] })
  ] });
}
export {
  LearningSessionShow as default
};
