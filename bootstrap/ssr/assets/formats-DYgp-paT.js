function formatDateForInput(date) {
  if (!date) return "";
  const d = date instanceof Date ? date : new Date(date);
  const year = d.getUTCFullYear();
  const month = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
function formatDate(date) {
  if (!date) return "";
  const dateObj = date instanceof Date ? date : new Date(date);
  const day = dateObj.getUTCDate();
  const month = dateObj.getUTCMonth() + 1;
  const year = dateObj.getUTCFullYear();
  return `${day}/${month}/${year}`;
}
function formatDateTime(date) {
  if (!date) return "";
  const dateObj = date instanceof Date ? date : new Date(date);
  const day = dateObj.getUTCDate();
  const month = dateObj.getUTCMonth() + 1;
  const year = dateObj.getUTCFullYear();
  const hours = dateObj.getUTCHours();
  const minutes = dateObj.getUTCMinutes();
  const seconds = dateObj.getUTCSeconds();
  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}
function formatTimeDifference(start, end) {
  if (!start || !end) return "00h 00m 00s";
  const startDate = start instanceof Date ? start : new Date(start);
  const endDate = end instanceof Date ? end : new Date(end);
  const diffMs = endDate.getTime() - startDate.getTime();
  const totalSeconds = Math.floor(diffMs / 1e3);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor(totalSeconds % 3600 / 60);
  const seconds = totalSeconds % 60;
  return `${hours.toString().padStart(2, "0")}h ${minutes.toString().padStart(2, "0")}m ${seconds.toString().padStart(2, "0")}s`;
}
export {
  formatDateForInput as a,
  formatDateTime as b,
  formatTimeDifference as c,
  formatDate as f
};
