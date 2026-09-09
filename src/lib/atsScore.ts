import { CVData } from "@/types/cv";

export interface ATSCheckItem {
  id: string;
  category: "contact" | "summary" | "experience" | "skills" | "education" | "extras";
  label: string;
  status: "pass" | "warn" | "fail";
  message: string;
  actionTab?: "personal" | "experience" | "education" | "skills" | "other" | "projects" | "certifications";
  pointsEarned: number;
  maxPoints: number;
}

export interface ATSReport {
  score: number;
  grade: "Excelent" | "Bun" | "Mediu" | "Necesită atenție";
  color: string;
  checks: ATSCheckItem[];
  metricsFoundCount: number;
  actionVerbsCount: number;
}

const ACTION_VERBS = [
  // Română
  "am coordonat", "am dezvoltat", "am implementat", "am optimizat", "am crescut",
  "am redus", "am condus", "am livrat", "am generat", "am lansat", "am gestionat",
  "am accelerat", "am transformat", "am negociat", "am proiectat", "am creat",
  "coordonat", "dezvoltat", "implementat", "optimizat", "crescut", "condus",
  // Engleză
  "led", "developed", "implemented", "optimized", "increased", "reduced", "delivered",
  "managed", "accelerated", "built", "designed", "spearheaded", "achieved", "orchestrated",
];

const METRIC_PATTERNS = [
  /\b\d+%/g, // 25%, 50%
  /\+\d+/g, // +40
  /\b\d+\s*(euro|eur|ron|usd|\$|€|k|m)\b/gi, // 100k, 50 euro
  /\b\d+\s*(ani|luni|zile|membri|clienți|proiecte|ore|users|clients|years)\b/gi,
  /\b\d+x\b/gi, // 3x, 5x
];

export function evaluateATS(cv: CVData): ATSReport {
  const checks: ATSCheckItem[] = [];

  // 1. Contact (Max 20 pct)
  const hasName = Boolean(cv.personal.firstName?.trim() && cv.personal.lastName?.trim());
  const hasEmail = Boolean(cv.personal.email?.trim() && cv.personal.email.includes("@"));
  const hasPhone = Boolean(cv.personal.phone?.trim() && cv.personal.phone.length >= 6);
  const hasLocation = Boolean(cv.personal.location?.trim());
  const hasWebOrLi = Boolean(cv.personal.linkedin?.trim() || cv.personal.website?.trim());

  let contactScore = 0;
  if (hasName) contactScore += 5;
  if (hasEmail) contactScore += 5;
  if (hasPhone) contactScore += 4;
  if (hasLocation) contactScore += 3;
  if (hasWebOrLi) contactScore += 3;

  checks.push({
    id: "contact_completeness",
    category: "contact",
    label: "Date de contact complete",
    status: contactScore >= 17 ? "pass" : contactScore >= 10 ? "warn" : "fail",
    message: contactScore >= 17
      ? "Datele esențiale de contact (nume, email, telefon, locație, LinkedIn) sunt prezente."
      : "Asigură-te că ai adăugat email, telefon, oraș și profilul de LinkedIn.",
    actionTab: "personal",
    pointsEarned: contactScore,
    maxPoints: 20,
  });

  // 2. Rezumat profesional (Max 15 pct)
  const summary = cv.personal.summary?.trim() || "";
  const summaryWords = summary ? summary.split(/\s+/).length : 0;
  let summaryScore = 0;

  if (summaryWords >= 35 && summaryWords <= 130) {
    summaryScore = 15;
    checks.push({
      id: "summary_length",
      category: "summary",
      label: "Rezumat profesional de impact",
      status: "pass",
      message: `Lungime optimă (${summaryWords} cuvinte). ATS-urile și recrutorii citesc rezumatele de 40-100 cuvinte.`,
      actionTab: "personal",
      pointsEarned: 15,
      maxPoints: 15,
    });
  } else if (summaryWords > 0) {
    summaryScore = 8;
    checks.push({
      id: "summary_length",
      category: "summary",
      label: "Rezumat profesional",
      status: "warn",
      message: summaryWords < 35
        ? "Rezumatul este puțin prea scurt. Adaugă 1-2 propoziții despre realizări și puncte forte."
        : "Rezumatul depășește lungimea ideală. Încearcă să-l condensezi la 3-4 fraze concise.",
      actionTab: "personal",
      pointsEarned: 8,
      maxPoints: 15,
    });
  } else {
    checks.push({
      id: "summary_length",
      category: "summary",
      label: "Rezumat profesional lipsă",
      status: "fail",
      message: "Un rezumat profesional crește rata de răspuns la interviu cu peste 40%. Folosește generatorul AI pentru asistență.",
      actionTab: "personal",
      pointsEarned: 0,
      maxPoints: 15,
    });
  }

  // 3. Experiență profesională & Metrici (Max 25 pct)
  const allPositions = cv.experience.flatMap((e) => e.positions || []);
  const combinedExpText = allPositions.map((p) => p.description || "").join(" ").toLowerCase();

  let metricsCount = 0;
  for (const pattern of METRIC_PATTERNS) {
    const matches = combinedExpText.match(pattern);
    if (matches) metricsCount += matches.length;
  }

  let verbsCount = 0;
  for (const verb of ACTION_VERBS) {
    if (combinedExpText.includes(verb)) verbsCount++;
  }

  let expScore = 0;
  if (cv.experience.length > 0) {
    expScore += 10;
    if (metricsCount >= 2) expScore += 8;
    else if (metricsCount === 1) expScore += 4;

    if (verbsCount >= 3) expScore += 7;
    else if (verbsCount >= 1) expScore += 4;
  }

  checks.push({
    id: "experience_quality",
    category: "experience",
    label: "Experiență profesională & realizări",
    status: expScore >= 20 ? "pass" : expScore >= 10 ? "warn" : "fail",
    message: expScore >= 20
      ? `Excelent! Ai inclus ${metricsCount} rezultate măsurabile și verbe active de impact.`
      : cv.experience.length === 0
      ? "Secțiunea de experiență este goală. Adaugă rolurile anterioare sau internship-urile."
      : `Ai ${metricsCount} metrici cuantificabile. Sistemele ATS caută cifre clare (ex: +30%, 150 utilizatori, 20.000 €).`,
    actionTab: "experience",
    pointsEarned: expScore,
    maxPoints: 25,
  });

  // 4. Competențe (Max 15 pct)
  const skillsCount = cv.skills.length;
  let skillsScore = 0;
  if (skillsCount >= 6) skillsScore = 15;
  else if (skillsCount >= 3) skillsScore = 9;
  else if (skillsCount > 0) skillsScore = 4;

  checks.push({
    id: "skills_coverage",
    category: "skills",
    label: "Secțiunea de competențe",
    status: skillsCount >= 6 ? "pass" : skillsCount >= 3 ? "warn" : "fail",
    message: skillsCount >= 6
      ? `Secțiune bine populată cu ${skillsCount} abilități recunoscute.`
      : skillsCount >= 3
      ? "Recomandăm cel puțin 6-8 competențe (amestec de tehnice și soft skills)."
      : "Adaugă competențe cheie pentru a fi detectat de filtrele automate de recrutare.",
    actionTab: "skills",
    pointsEarned: skillsScore,
    maxPoints: 15,
  });

  // 5. Educație (Max 10 pct)
  const hasEdu = cv.education.length > 0 && Boolean(cv.education[0].institution && cv.education[0].degree);
  const eduScore = hasEdu ? 10 : cv.education.length > 0 ? 5 : 0;

  checks.push({
    id: "education_presence",
    category: "education",
    label: "Istoric educațional",
    status: eduScore === 10 ? "pass" : eduScore > 0 ? "warn" : "fail",
    message: hasEdu
      ? "Educația conține instituția și diploma obținută."
      : "Completează instituția de învățământ și titlul diplomei obținute.",
    actionTab: "education",
    pointsEarned: eduScore,
    maxPoints: 10,
  });

  // 6. Diferențiatori suplimentari: Proiecte, Certificări, Limbi (Max 15 pct)
  const projectsCount = cv.projects?.length || 0;
  const certsCount = cv.certifications?.length || 0;
  const langsCount = cv.languages?.length || 0;

  let extrasScore = 0;
  if (projectsCount > 0) extrasScore += 5;
  if (certsCount > 0) extrasScore += 5;
  if (langsCount > 0) extrasScore += 5;

  checks.push({
    id: "extras_richness",
    category: "extras",
    label: "Secțiuni diferențiatoare (Proiecte, Certificări, Limbi)",
    status: extrasScore >= 10 ? "pass" : extrasScore >= 5 ? "warn" : "fail",
    message: extrasScore >= 10
      ? `Foarte bine! Ai inclus secțiuni care te scot în evidență (Proiecte: ${projectsCount}, Certificări: ${certsCount}, Limbi: ${langsCount}).`
      : "Adaugă proiecte practice de portofoliu sau certificări profesionale pentru a crește credibilitatea.",
    actionTab: "projects",
    pointsEarned: extrasScore,
    maxPoints: 15,
  });

  const totalScore = Math.min(100, Math.round(contactScore + summaryScore + expScore + skillsScore + eduScore + extrasScore));

  let grade: ATSReport["grade"] = "Necesită atenție";
  let color = "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900";

  if (totalScore >= 85) {
    grade = "Excelent";
    color = "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900";
  } else if (totalScore >= 70) {
    grade = "Bun";
    color = "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900";
  } else if (totalScore >= 50) {
    grade = "Mediu";
    color = "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900";
  }

  return {
    score: totalScore,
    grade,
    color,
    checks,
    metricsFoundCount: metricsCount,
    actionVerbsCount: verbsCount,
  };
}
