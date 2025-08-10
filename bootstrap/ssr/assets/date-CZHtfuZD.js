const toUTCDateString = (date) => {
  return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())).toISOString().split("T")[0];
};
const parseDateString = (date) => {
  if (!date) return /* @__PURE__ */ new Date();
  if (date instanceof Date) return date;
  if (typeof date === "string") {
    try {
      if (date.includes("T")) {
        return new Date(date);
      }
      const [year, month, day] = date.split("-").map(Number);
      return new Date(year, month - 1, day);
    } catch (error) {
      console.error("Error parsing date:", error);
    }
  }
  return /* @__PURE__ */ new Date();
};
export {
  parseDateString as p,
  toUTCDateString as t
};
