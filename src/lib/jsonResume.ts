import { CVData, defaultCV } from "@/types/cv";

export interface JsonResume {
  basics?: {
    name?: string;
    label?: string;
    image?: string;
    email?: string;
    phone?: string;
    url?: string;
    summary?: string;
    location?: {
      address?: string;
      postalCode?: string;
      city?: string;
      countryCode?: string;
      region?: string;
    };
    profiles?: Array<{
      network?: string;
      username?: string;
      url?: string;
    }>;
  };
  work?: Array<{
    name?: string;
    position?: string;
    url?: string;
    startDate?: string;
    endDate?: string;
    summary?: string;
    highlights?: string[];
  }>;
  education?: Array<{
    institution?: string;
    url?: string;
    area?: string;
    studyType?: string;
    startDate?: string;
    endDate?: string;
    score?: string;
  }>;
  certificates?: Array<{
    name?: string;
    date?: string;
    issuer?: string;
    url?: string;
  }>;
  skills?: Array<{
    name?: string;
    level?: string;
    keywords?: string[];
  }>;
  languages?: Array<{
    language?: string;
    fluency?: string;
  }>;
  projects?: Array<{
    name?: string;
    description?: string;
    url?: string;
    roles?: string[];
    keywords?: string[];
  }>;
}

export function cvToJsonResume(cv: CVData): JsonResume {
  const fullName = [cv.personal.firstName, cv.personal.lastName].filter(Boolean).join(" ");

  const profiles: Array<{ network: string; url: string }> = [];
  if (cv.personal.linkedin) {
    profiles.push({ network: "LinkedIn", url: cv.personal.linkedin });
  }

  const work = cv.experience.flatMap((exp) =>
    (exp.positions || []).map((pos) => ({
      name: exp.company,
      position: pos.title,
      startDate: pos.startDate,
      endDate: pos.current ? "" : pos.endDate,
      summary: pos.description,
    }))
  );

  const education = (cv.education || []).map((edu) => ({
    institution: edu.institution,
    studyType: edu.degree,
    area: edu.field,
    startDate: edu.startDate,
    endDate: edu.endDate,
    score: edu.gpa,
  }));

  const skills = (cv.skills || []).map((sk) => ({
    name: sk.name,
    level: sk.level,
  }));

  const languages = (cv.languages || []).map((l) => ({
    language: l.name,
    fluency: l.level,
  }));

  const projects = (cv.projects || []).map((p) => ({
    name: p.title,
    description: p.description,
    url: p.link || p.github,
    keywords: p.technologies,
  }));

  const certificates = (cv.certifications || []).map((c) => ({
    name: c.name,
    issuer: c.issuer,
    date: c.issueDate,
    url: c.url,
  }));

  return {
    basics: {
      name: fullName,
      label: cv.personal.title,
      image: cv.personal.showPhoto ? cv.personal.photo : undefined,
      email: cv.personal.email,
      phone: cv.personal.phone,
      url: cv.personal.website,
      summary: cv.personal.summary,
      location: {
        city: cv.personal.location,
      },
      profiles,
    },
    work,
    education,
    skills,
    languages,
    projects,
    certificates,
  };
}

export function jsonResumeToCV(json: JsonResume): CVData {
  const b = json.basics || {};
  const names = (b.name || "").trim().split(" ");
  const firstName = names[0] || "";
  const lastName = names.slice(1).join(" ") || "";

  const linkedinProfile = b.profiles?.find(
    (p) => p.network?.toLowerCase().includes("linkedin") || p.url?.toLowerCase().includes("linkedin")
  );

  const experience = (json.work || []).map((w, idx) => ({
    id: `work-${idx}-${Date.now()}`,
    company: w.name || "",
    positions: [
      {
        id: `pos-${idx}-${Date.now()}`,
        title: w.position || "",
        startDate: w.startDate || "",
        endDate: w.endDate || "",
        current: !w.endDate,
        description: [w.summary, ...(w.highlights || [])].filter(Boolean).join("\n"),
      },
    ],
  }));

  const education = (json.education || []).map((edu, idx) => ({
    id: `edu-${idx}-${Date.now()}`,
    institution: edu.institution || "",
    degree: edu.studyType || "",
    field: edu.area || "",
    startDate: edu.startDate || "",
    endDate: edu.endDate || "",
    gpa: edu.score || "",
  }));

  const skills = (json.skills || []).map((s, idx) => ({
    id: `sk-${idx}-${Date.now()}`,
    name: s.name || "",
    level: "Avansat" as const,
  }));

  const languages = (json.languages || []).map((l, idx) => ({
    id: `lang-${idx}-${Date.now()}`,
    name: l.language || "",
    level: "B2" as const,
  }));

  const projects = (json.projects || []).map((p, idx) => ({
    id: `proj-${idx}-${Date.now()}`,
    title: p.name || "",
    description: p.description || "",
    link: p.url || "",
    technologies: p.keywords || [],
  }));

  const certifications = (json.certificates || []).map((c, idx) => ({
    id: `cert-${idx}-${Date.now()}`,
    name: c.name || "",
    issuer: c.issuer || "",
    issueDate: c.date || "",
    url: c.url || "",
  }));

  return {
    ...defaultCV,
    personal: {
      firstName,
      lastName,
      title: b.label || "",
      email: b.email || "",
      phone: b.phone || "",
      location: b.location?.city || b.location?.address || "",
      website: b.url || "",
      linkedin: linkedinProfile?.url || "",
      summary: b.summary || "",
      photo: b.image || "",
      showPhoto: true,
    },
    experience,
    education,
    skills,
    languages,
    projects,
    certifications,
  };
}
