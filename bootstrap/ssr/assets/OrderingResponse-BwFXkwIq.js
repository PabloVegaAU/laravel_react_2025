import { jsxs, jsx } from "react/jsx-runtime";
import { c as cn } from "./utils-CpIjqAVa.js";
import { GripVertical } from "lucide-react";
import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import "clsx";
import "tailwind-merge";
function OrderingResponse({ question, order = [], onOrderChange, disabled = false }) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const dragItem = useRef(null);
  const dragOverItem = useRef(null);
  useEffect(() => {
    if (order.length === 0) onOrderChange(orderedOptions.map((opt) => opt.id));
  }, []);
  const questionOptions = useMemo(() => {
    var _a;
    return ((_a = question.application_form_question.question) == null ? void 0 : _a.options) || [];
  }, [question]);
  const orderedOptions = useMemo(() => {
    const validOptions = order.map((id) => questionOptions.find((opt) => opt.id === id)).filter((opt) => !!opt);
    const missingOptions = questionOptions.filter((opt) => !order.includes(opt.id));
    return [...validOptions, ...missingOptions];
  }, [order, questionOptions]);
  const handleDragStart = useCallback(
    (e, index) => {
      e.dataTransfer.effectAllowed = "move";
      dragItem.current = index;
      setIsDragging(true);
      const element = e.currentTarget;
      element.classList.add("opacity-50");
      e.dataTransfer.setDragImage(new Image(), 0, 0);
    },
    [orderedOptions]
  );
  const handleDragEnter = useCallback((e, index) => {
    e.preventDefault();
    dragOverItem.current = index;
    setDragOverIndex(index);
  }, []);
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);
  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      const element = e.currentTarget;
      element.classList.remove("opacity-50");
      if (dragItem.current === null || dragOverItem.current === null) {
        setIsDragging(false);
        setDragOverIndex(null);
        return;
      }
      if (dragItem.current !== dragOverItem.current) {
        const newOrder = orderedOptions.map((opt) => opt.id);
        const [movedItem] = newOrder.splice(dragItem.current, 1);
        newOrder.splice(dragOverItem.current, 0, movedItem);
        onOrderChange(newOrder);
      }
      dragItem.current = null;
      dragOverItem.current = null;
      setIsDragging(false);
      setDragOverIndex(null);
    },
    [orderedOptions, onOrderChange]
  );
  const handleDragEnd = useCallback((e) => {
    const element = e.currentTarget;
    element.classList.remove("opacity-50");
    setIsDragging(false);
    setDragOverIndex(null);
    dragItem.current = null;
    dragOverItem.current = null;
  }, []);
  return /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
    orderedOptions.map((option, index) => {
      const isBeingDragged = isDragging && dragItem.current === index;
      const isDragOver = dragOverIndex === index && dragItem.current !== index;
      return /* @__PURE__ */ jsxs(
        "div",
        {
          draggable: !disabled,
          onDragStart: (e) => handleDragStart(e, index),
          onDragEnter: (e) => handleDragEnter(e, index),
          onDragOver: handleDragOver,
          onDragEnd: handleDragEnd,
          onDrop: handleDrop,
          className: cn(
            "flex items-center gap-3 rounded-lg border p-3 transition-all duration-200",
            disabled ? "cursor-not-allowed opacity-80" : "cursor-grab active:cursor-grabbing",
            isBeingDragged && "opacity-50",
            isDragOver && "bg-blue-50 ring-2 ring-blue-400",
            isDragging && !isBeingDragged && "transition-transform duration-200",
            isDragOver && dragItem.current !== null && dragItem.current < index && "translate-y-2",
            isDragOver && dragItem.current !== null && dragItem.current > index && "-translate-y-2"
          ),
          style: {
            transform: isDragOver && dragItem.current !== null ? `translateY(${dragItem.current < index ? "4px" : dragItem.current > index ? "-4px" : "0"})` : "none"
          },
          children: [
            !disabled && /* @__PURE__ */ jsx("span", { className: "cursor-grab touch-none active:cursor-grabbing", children: /* @__PURE__ */ jsx(GripVertical, { className: "h-4 w-4 text-gray-400" }) }),
            /* @__PURE__ */ jsx("span", { className: "flex-1 select-none", children: option.value })
          ]
        },
        option.id
      );
    }),
    orderedOptions.length === 0 && /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: "No hay opciones disponibles" })
  ] });
}
export {
  OrderingResponse
};
