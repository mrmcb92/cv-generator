// Labels printed on the CV itself (section titles, "Present", months).
// The app UI stays Romanian; this only affects the rendered/exported CV.

export type CvLang = "ro" | "en";

export interface CvLabels {
  profile: string;
  profileLong: string;
  experience: string;
  experienceShort: string;
  education: string;
  skills: string;
  languages: string;
  skillsAndLangs: string;
  driving: string;
  category: string;
  present: string;
  inWord: string;
  months: string[];
}

export const CV_LABELS: Record<CvLang, CvLabels> = {
  ro: {
    profile: "Profil",
    profileLong: "Profil profesional",
    experience: "Experiență profesională",
    experienceShort: "Experiență",
    education: "Educație",
    skills: "Competențe",
    languages: "Limbi străine",
    skillsAndLangs: "Competențe & Limbi",
    driving: "Permis de conducere",
    category: "Categoria",
    present: "Prezent",
    inWord: "în",
    months: ["Ian", "Feb", "Mar", "Apr", "Mai", "Iun", "Iul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  },
  en: {
    profile: "Profile",
    profileLong: "Professional profile",
    experience: "Work experience",
    experienceShort: "Experience",
    education: "Education",
    skills: "Skills",
    languages: "Languages",
    skillsAndLangs: "Skills & Languages",
    driving: "Driving licence",
    category: "Category",
    present: "Present",
    inWord: "in",
    months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  },
};

// Formats "YYYY-MM" as "Mar 2021" in the given language. Malformed input
// degrades gracefully (year only, or empty) instead of producing "NaN".
export function fmtDate(d: string, lang: CvLang = "ro"): string {
  if (!d) return "";
  const [year, month] = d.split("-");
  const m = parseInt(month, 10);
  if (!year) return "";
  if (!m || m < 1 || m > 12) return year;
  return `${CV_LABELS[lang].months[m - 1]} ${year}`;
}
