import {
  CVData,
  defaultCV,
  DrivingCategory,
  DRIVING_CATEGORIES,
  Language,
  Skill,
} from "@/types/cv";

// Rebuilds a clean CVData from untrusted input (imported files, localStorage).
// Unknown fields are dropped, wrong types are coerced to safe defaults, and
// missing arrays become empty — so malformed data can never crash the app.

function str(v: unknown): string {
  return typeof v === "string" ? v : "";
}

function bool(v: unknown): boolean {
  return v === true;
}

function arr(v: unknown): Record<string, unknown>[] {
  return Array.isArray(v)
    ? v.filter((x): x is Record<string, unknown> => typeof x === "object" && x !== null)
    : [];
}

function id(v: unknown): string {
  return typeof v === "string" && v.length > 0 ? v : crypto.randomUUID();
}

const SKILL_LEVELS: Skill["level"][] = ["Începător", "Mediu", "Avansat", "Expert"];
const LANG_LEVELS: Language["level"][] = ["A1", "A2", "B1", "B2", "C1", "C2", "Nativ"];

function oneOf<T extends string>(v: unknown, allowed: readonly T[], fallback: T): T {
  return allowed.includes(v as T) ? (v as T) : fallback;
}

export function validateCV(input: unknown): CVData | null {
  if (typeof input !== "object" || input === null) return null;
  const d = input as Record<string, unknown>;
  const p = (typeof d.personal === "object" && d.personal !== null ? d.personal : {}) as Record<string, unknown>;

  return {
    personal: {
      firstName: str(p.firstName),
      lastName:  str(p.lastName),
      email:     str(p.email),
      phone:     str(p.phone),
      location:  str(p.location),
      website:   str(p.website),
      linkedin:  str(p.linkedin),
      summary:   str(p.summary),
      // only accept inline image data, never external URLs
      photo:     str(p.photo).startsWith("data:image/") ? str(p.photo) : "",
    },
    experience: arr(d.experience).map((e) => ({
      id: id(e.id),
      company: str(e.company),
      positions: arr(e.positions).map((pos) => ({
        id: id(pos.id),
        title: str(pos.title),
        startDate: str(pos.startDate),
        endDate: str(pos.endDate),
        current: bool(pos.current),
        description: str(pos.description),
      })),
    })),
    education: arr(d.education).map((e) => ({
      id: id(e.id),
      institution: str(e.institution),
      degree: str(e.degree),
      field: str(e.field),
      startDate: str(e.startDate),
      endDate: str(e.endDate),
      gpa: str(e.gpa),
    })),
    skills: arr(d.skills).map((s) => ({
      id: id(s.id),
      name: str(s.name),
      level: oneOf(s.level, SKILL_LEVELS, "Mediu"),
    })),
    languages: arr(d.languages).map((l) => ({
      id: id(l.id),
      name: str(l.name),
      level: oneOf(l.level, LANG_LEVELS, "B2"),
    })),
    drivingLicenses: arr(d.drivingLicenses).map((dl) => ({
      id: id(dl.id),
      category: oneOf<DrivingCategory>(dl.category, DRIVING_CATEGORIES, "B"),
      year: str(dl.year),
    })),
    customSections: arr(d.customSections).map((cs) => ({
      id: id(cs.id),
      title: str(cs.title),
      items: arr(cs.items).map((it) => ({
        id: id(it.id),
        name: str(it.name),
        subtitle: str(it.subtitle),
        date: str(it.date),
        description: str(it.description),
      })),
    })),
  };
}

// Convenience: validate or fall back to the empty CV
export function validateOrDefault(input: unknown): CVData {
  return validateCV(input) ?? defaultCV;
}
