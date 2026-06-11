export const MONTHS_RO = ["Ian", "Feb", "Mar", "Apr", "Mai", "Iun", "Iul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Formats "YYYY-MM" as "Mar 2021". Malformed input degrades gracefully
// (year only, or empty) instead of producing "NaN" or "undefined".
export function fmtDate(d: string): string {
  if (!d) return "";
  const [year, month] = d.split("-");
  const m = parseInt(month, 10);
  if (!year) return "";
  if (!m || m < 1 || m > 12) return year;
  return `${MONTHS_RO[m - 1]} ${year}`;
}
