export type TemplateId = "classic" | "modern" | "minimal" | "creative";

export interface CVTemplate {
  id: TemplateId;
  name: string;
  description: string;
  /** Thumbnail accent color for the picker */
  accent: string;
}

export const cvTemplates: CVTemplate[] = [
  { id: "classic",  name: "Classic",  description: "Header întunecat, secțiuni clare", accent: "#1e293b" },
  { id: "modern",   name: "Modern",   description: "Sidebar colorat, layout bicolumnar", accent: "#0f172a" },
  { id: "minimal",  name: "Minimal",  description: "Tipografie pură, spațiu alb", accent: "#71717a" },
  { id: "creative", name: "Creative", description: "Accent bold, design editorial", accent: "#0369a1" },
];
