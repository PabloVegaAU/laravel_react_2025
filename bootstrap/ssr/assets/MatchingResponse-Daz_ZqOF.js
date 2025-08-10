import { jsxs, jsx } from "react/jsx-runtime";
import { c as cn } from "./utils-CpIjqAVa.js";
import { useState, useMemo, useCallback } from "react";
import "clsx";
import "tailwind-merge";
const MatchingResponse = ({
  question,
  pairs = {},
  onPairSelect,
  disabled = false,
  isCorrect = void 0
}) => {
  var _a, _b;
  const [selectedLeftId, setSelectedLeftId] = useState(null);
  const { leftOptions, rightOptions, optionMap } = useMemo(() => {
    var _a2, _b2;
    const allOptions = ((_b2 = (_a2 = question.application_form_question) == null ? void 0 : _a2.question) == null ? void 0 : _b2.options) || [];
    const map = new Map(allOptions.map((opt) => [opt.id, opt]));
    const left = allOptions.filter((opt) => opt.pair_side === "left").sort((a, b) => (a.pair_key || "").localeCompare(b.pair_key || ""));
    const right = allOptions.filter((opt) => opt.pair_side === "right").sort((a, b) => (a.pair_key || "").localeCompare(b.pair_key || ""));
    return { leftOptions: left, rightOptions: right, optionMap: map };
  }, [(_b = (_a = question.application_form_question) == null ? void 0 : _a.question) == null ? void 0 : _b.options, pairs]);
  const getPairedRightId = useCallback(
    (leftId) => {
      const pairedId = pairs[leftId] !== void 0 ? pairs[leftId] : null;
      return pairedId !== null && pairedId !== void 0 ? Number(pairedId) : null;
    },
    [pairs]
  );
  const isRightOptionPaired = useCallback(
    (rightId) => {
      return Object.values(pairs).some((id) => id !== null && Number(id) === rightId);
    },
    [pairs]
  );
  const handleLeftOptionClick = useCallback(
    (leftId) => {
      if (disabled) {
        return;
      }
      const pairedRightId = getPairedRightId(leftId);
      const isAlreadyPaired = pairedRightId !== null;
      if (isAlreadyPaired) {
        setSelectedLeftId(null);
        onPairSelect(leftId, null);
        return;
      }
      setSelectedLeftId(selectedLeftId === leftId ? null : leftId);
    },
    [disabled, selectedLeftId, getPairedRightId, onPairSelect]
  );
  const handleRightOptionClick = (rightId) => {
    if (disabled) {
      return;
    }
    if (selectedLeftId === null) {
      return;
    }
    const isPaired = isRightOptionPaired(rightId);
    const currentPair = Object.entries(pairs).find(([_, rId]) => rId === rightId);
    const pairedLeftId = currentPair ? Number(currentPair[0]) : null;
    if (isPaired && pairedLeftId === selectedLeftId) {
      delete pairs[selectedLeftId];
      onPairSelect(selectedLeftId, null);
      setSelectedLeftId(null);
      return;
    }
    if (isPaired && pairedLeftId !== null && pairedLeftId !== selectedLeftId) {
      delete pairs[pairedLeftId];
      onPairSelect(pairedLeftId, null);
    }
    pairs[selectedLeftId] = rightId;
    onPairSelect(selectedLeftId, rightId);
    setSelectedLeftId(null);
  };
  const renderLeftOptions = () => {
    return leftOptions.map((option) => {
      const isSelected = selectedLeftId === option.id;
      const pairedRightId = getPairedRightId(option.id);
      const isPaired = pairedRightId !== null && pairedRightId !== void 0;
      const pairedOption = pairedRightId ? optionMap.get(pairedRightId) : null;
      const pairInfo = isPaired && pairedOption ? /* @__PURE__ */ jsxs("div", { className: "mt-1 flex items-center text-sm", children: [
        /* @__PURE__ */ jsx("span", { className: "mr-1", children: "→" }),
        /* @__PURE__ */ jsx("span", { className: "font-medium", children: pairedOption.value }),
        /* @__PURE__ */ jsx("span", { className: "ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs", children: "Emparejado" })
      ] }) : null;
      return /* @__PURE__ */ jsx(
        "div",
        {
          className: cn(
            "mb-3 cursor-pointer overflow-hidden rounded-lg border shadow-sm transition-all",
            isSelected && "border-blue-500 bg-blue-50 ring-2 ring-blue-200",
            disabled && "cursor-not-allowed opacity-70",
            !disabled && "hover:bg-gray-50",
            "group relative flex flex-col justify-between"
          ),
          onClick: () => handleLeftOptionClick(option.id),
          children: /* @__PURE__ */ jsxs("div", { className: "p-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-gray-900", children: option.value }),
              isSelected && /* @__PURE__ */ jsx("div", { className: "flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-xs font-bold text-white", children: "✓" })
            ] }),
            pairInfo
          ] })
        },
        `left-${option.id}`
      );
    });
  };
  const renderRightOptions = () => {
    return rightOptions.map((option) => {
      const isPaired = isRightOptionPaired(option.id);
      const isSelected = selectedLeftId !== null && !isPaired;
      const pairEntry = Object.entries(pairs).find(([_, rId]) => rId === option.id);
      const pairedLeftId = pairEntry ? Number(pairEntry[0]) : null;
      const pairedOption = pairedLeftId ? optionMap.get(pairedLeftId) : null;
      const pairInfo = isPaired && pairedOption ? /* @__PURE__ */ jsxs("div", { className: "mt-1 flex items-center text-sm", children: [
        /* @__PURE__ */ jsx("span", { className: "mr-1", children: "←" }),
        /* @__PURE__ */ jsx("span", { children: pairedOption.value }),
        /* @__PURE__ */ jsx("span", { className: "ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs", children: "Emparejado" })
      ] }) : null;
      return /* @__PURE__ */ jsx(
        "div",
        {
          className: cn(
            "mb-3 cursor-pointer overflow-hidden rounded-lg border shadow-sm transition-all",
            isSelected && "border-blue-500 bg-blue-50 ring-2 ring-blue-200",
            disabled && "cursor-not-allowed opacity-70",
            !disabled && !isPaired && "hover:bg-gray-50",
            "group relative flex flex-col",
            isPaired ? "cursor-default" : "cursor-pointer"
          ),
          onClick: () => !isPaired && handleRightOptionClick(option.id),
          children: /* @__PURE__ */ jsxs("div", { className: "p-3", children: [
            /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ jsx("span", { className: cn("text-sm", isPaired ? "font-medium text-gray-900" : "text-gray-700"), children: option.value }) }),
            pairInfo
          ] })
        },
        `right-${option.id}`
      );
    });
  };
  return /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-4 md:grid-cols-2", children: [
    /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsx("h3", { className: "font-medium", children: "Opciones de la izquierda" }),
      /* @__PURE__ */ jsx("div", { className: "space-y-2", children: renderLeftOptions() })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsx("h3", { className: "font-medium", children: "Opciones de la derecha" }),
      /* @__PURE__ */ jsx("div", { className: "space-y-2", children: renderRightOptions() })
    ] })
  ] });
};
export {
  MatchingResponse
};
