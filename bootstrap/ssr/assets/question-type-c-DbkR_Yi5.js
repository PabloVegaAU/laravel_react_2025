import { jsxs, jsx } from "react/jsx-runtime";
import { B as Badge } from "./badge-65mno7eO.js";
import { HelpCircle, AlignLeft, Check, X, Link2, ListOrdered, CheckSquare } from "lucide-react";
const QUESTION_TYPES = {
  /**
   * Pregunta de opción única.
   * El usuario debe seleccionar una respuesta correcta entre varias opciones.
   */
  SINGLE_CHOICE: 1,
  /**
   * Pregunta de ordenamiento.
   * El usuario debe ordenar las opciones en el orden correcto.
   */
  ORDERING: 2,
  /**
   * Pregunta de emparejamiento.
   * El usuario debe emparejar elementos de dos columnas.
   */
  MATCHING: 3,
  /**
   * Pregunta de verdadero/falso.
   * El usuario debe seleccionar entre verdadero o falso.
   */
  TRUE_FALSE: 4,
  /**
   * Pregunta de respuesta abierta.
   * El usuario debe responder con una respuesta abierta.
   */
  OPEN_ANSWER: 5
};
const getQuestionTypeIcon = (typeId) => {
  switch (typeId) {
    case 1:
      return /* @__PURE__ */ jsx(CheckSquare, { className: "h-3.5 w-3.5" });
    case 2:
      return /* @__PURE__ */ jsx(ListOrdered, { className: "h-3.5 w-3.5" });
    case 3:
      return /* @__PURE__ */ jsx(Link2, { className: "h-3.5 w-3.5" });
    case 4:
      return /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
        /* @__PURE__ */ jsx(Check, { className: "h-3.5 w-3.5" }),
        "/",
        /* @__PURE__ */ jsx(X, { className: "h-3.5 w-3.5" })
      ] });
    case 5:
      return /* @__PURE__ */ jsx(AlignLeft, { className: "h-3.5 w-3.5" });
    default:
      return /* @__PURE__ */ jsx(HelpCircle, { className: "h-3.5 w-3.5" });
  }
};
const getQuestionTypeBadge = (question) => {
  var _a, _b;
  if (!question) return null;
  return /* @__PURE__ */ jsxs(Badge, { variant: "outline", className: "gap-1 text-xs", children: [
    getQuestionTypeIcon(((_a = question == null ? void 0 : question.question_type) == null ? void 0 : _a.id) || 0),
    (_b = question == null ? void 0 : question.question_type) == null ? void 0 : _b.name
  ] });
};
export {
  QUESTION_TYPES as Q,
  getQuestionTypeBadge as g
};
