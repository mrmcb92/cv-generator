// Soft field validators — empty values are always considered valid,
// the UI only flags non-empty input that looks wrong.

export function isValidEmail(v: string): boolean {
  return v === "" || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
}

export function isValidPhone(v: string): boolean {
  return v === "" || /^\+?[\d\s().-]{6,20}$/.test(v.trim());
}

export function isValidUrl(v: string): boolean {
  if (v === "") return true;
  const s = v.trim();
  return /^(https?:\/\/)?([\w-]+\.)+[a-z]{2,}([/?#]\S*)?$/i.test(s);
}

// true when both dates are set and the end precedes the start
export function isDateRangeInvalid(start: string, end: string): boolean {
  return Boolean(start && end && end < start);
}
