import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const getNestedError = (errors, path) => {
  if (!errors) return void 0;
  if (typeof errors === "object" && errors[path] && typeof errors[path] === "string") {
    return errors[path];
  }
  if (typeof errors === "string") {
    return errors;
  }
  const parts = path.split(".");
  let current = errors;
  for (const part of parts) {
    if (!current || current[part] === void 0) return void 0;
    current = current[part];
    if (typeof current === "string") {
      return current;
    }
  }
  return typeof current === "string" ? current : void 0;
};
const normalizeString = (str) => (str == null ? void 0 : str.toLowerCase()) || "";
export {
  cn as c,
  getNestedError as g,
  normalizeString as n
};
