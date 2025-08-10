import { jsx } from "react/jsx-runtime";
import { BaseQuestionType } from "./BaseQuestionType-vuBW0I6d.js";
import "./input-error-BCtMt8Ki.js";
import "./utils-qggO9Hcn.js";
import "clsx";
import "tailwind-merge";
import "./button-BqjjxT-O.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./input-B1uJ3yMO.js";
import "lucide-react";
function SingleChoiceOptions({ options, onChange, disabled = false }) {
  const handleAddOption = () => {
    const newOption = {
      value: `Opción ${options.length + 1}`,
      is_correct: options.length === 0,
      // Primera opción es correcta por defecto
      order: options.length + 1,
      score: options.length === 0 ? 1 : 0,
      correct_order: 0,
      pair_key: null,
      pair_side: null
    };
    onChange([...options, newOption]);
  };
  const handleRemoveOption = (index) => {
    const newOptions = options.filter((_, i) => i !== index);
    if (options[index].is_correct && newOptions.length > 0) {
      newOptions[0] = {
        ...newOptions[0],
        is_correct: true,
        score: 1
      };
    }
    const reorderedOptions = newOptions.map((opt, idx) => ({
      ...opt,
      order: idx + 1
    }));
    onChange(reorderedOptions);
  };
  const handleUpdateOption = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = {
      ...newOptions[index],
      value,
      order: newOptions[index].order ?? index + 1
    };
    onChange(newOptions);
  };
  const handleSetCorrect = (index) => {
    const newOptions = options.map((opt, i) => ({
      ...opt,
      is_correct: i === index,
      score: i === index ? 1 : 0
    }));
    onChange(newOptions);
  };
  return /* @__PURE__ */ jsx(
    BaseQuestionType,
    {
      options,
      title: "Opciones de respuesta",
      addButtonText: "Agregar opción",
      error: options.length < 2 ? "Debes agregar al menos 2 opciones" : void 0,
      onAddOption: handleAddOption,
      onRemoveOption: handleRemoveOption,
      onUpdateOption: handleUpdateOption,
      onSetCorrect: handleSetCorrect,
      showCorrectOption: true,
      onChange,
      disabled,
      children: /* @__PURE__ */ jsx("div", { className: "text-muted-foreground mt-2 text-sm", children: /* @__PURE__ */ jsx("p", { children: "Haz clic en el ícono de verificación para marcar la respuesta correcta." }) })
    }
  );
}
export {
  SingleChoiceOptions
};
