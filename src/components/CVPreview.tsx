"use client";

import { CVData } from "@/types/cv";
import { TemplateId } from "@/types/template";
import ClassicTemplate  from "./CVTemplates/ClassicTemplate";
import ModernTemplate   from "./CVTemplates/ModernTemplate";
import MinimalTemplate  from "./CVTemplates/MinimalTemplate";
import CreativeTemplate from "./CVTemplates/CreativeTemplate";

interface Props {
  data: CVData;
  templateId: TemplateId;
}

// Dashed overlay marking where each A4 page ends, so the user can see
// whether the CV still fits on one page. Lines repeat every 297mm.
function PageBreakGuide() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage:
          "repeating-linear-gradient(to bottom, transparent 0, transparent calc(297mm - 1px), rgba(244,63,94,0.55) calc(297mm - 1px), rgba(244,63,94,0.55) 297mm)",
      }}
    >
      <span
        className="absolute right-1 text-[9px] font-semibold uppercase tracking-wider text-rose-400/90 bg-white/80 px-1.5 py-0.5 rounded"
        style={{ top: "calc(297mm + 2px)" }}
      >
        Pagina 2
      </span>
    </div>
  );
}

export default function CVPreview({ data, templateId }: Props) {
  let template: React.ReactNode;
  switch (templateId) {
    case "modern":   template = <ModernTemplate   data={data} />; break;
    case "minimal":  template = <MinimalTemplate  data={data} />; break;
    case "creative": template = <CreativeTemplate data={data} />; break;
    default:         template = <ClassicTemplate  data={data} />; break;
  }
  return (
    <div className="relative w-full max-w-[210mm] mx-auto">
      {template}
      <PageBreakGuide />
    </div>
  );
}
