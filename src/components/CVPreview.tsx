"use client";

import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { CVData } from "@/types/cv";
import { TemplateId } from "@/types/template";
import { CvLang } from "@/lib/cvLabels";
import { ClassicTemplate } from "./CVTemplates/ClassicTemplate";
import { ModernTemplate } from "./CVTemplates/ModernTemplate";
import { MinimalTemplate } from "./CVTemplates/MinimalTemplate";
import { CreativeTemplate } from "./CVTemplates/CreativeTemplate";

interface Props {
  data: CVData;
  templateId: TemplateId;
  lang?: CvLang;
}


// Dashed overlay marking where each A4 page ends, so the user can see
// whether the CV still fits on one page. Lines repeat every 297mm.
const PAGE_HEIGHT_PX = 1120; // ~297mm in pixels

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

export default function CVPreview({ data, templateId, lang = "ro" }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(1);

  // Count "items" that take up significant space on the page
  const totalItems = useMemo(() => {
    const positions = data.experience.reduce((sum, exp) => sum + exp.positions.length, 0);
    const educations = data.education.length;
    const custom = data.customSections.reduce((sum, sec) => sum + sec.items.length, 0);
    return positions + educations + custom;
  }, [data]);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(totalItems / 4)), [totalItems]);

  // Clamp page when totalPages changes
  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [totalPages, page]);

  const goToPrevPage = useCallback(() => {
    setPage((p) => Math.max(1, p - 1));
  }, []);

  const goToNextPage = useCallback(() => {
    setPage((p) => Math.min(totalPages, p + 1));
  }, [totalPages]);

  // Scroll when page changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: (page - 1) * PAGE_HEIGHT_PX,
        behavior: "smooth",
      });
    }
  }, [page]);

  let template: React.ReactNode;
  switch (templateId) {
    case "modern":   template = <ModernTemplate   data={data} lang={lang} />; break;
    case "minimal":  template = <MinimalTemplate  data={data} lang={lang} />; break;
    case "creative": template = <CreativeTemplate data={data} lang={lang} />; break;
    default:         template = <ClassicTemplate  data={data} lang={lang} />; break;
  }

  return (
    <div className="relative w-full max-w-[210mm] mx-auto">
      {/* Page navigation toolbar */}
      {totalPages > 1 && (
        <div className="sticky top-0 z-10 flex items-center justify-center gap-3 py-2 mb-2 bg-white/90 backdrop-blur-sm rounded-t-md shadow-sm">
          <button
            type="button"
            onClick={goToPrevPage}
            disabled={page <= 1}
            className="flex items-center justify-center w-7 h-7 rounded-full text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-default transition-colors"
            aria-label="Pagina anterioară"
          >
            <CaretLeft weight="bold" className="w-4 h-4" />
          </button>
          <span className="text-xs font-medium text-gray-600 select-none">
            Pagina {page} / {totalPages}
          </span>
          <button
            type="button"
            onClick={goToNextPage}
            disabled={page >= totalPages}
            className="flex items-center justify-center w-7 h-7 rounded-full text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-default transition-colors"
            aria-label="Pagina următoare"
          >
            <CaretRight weight="bold" className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Scrollable container */}
      <div
        ref={scrollRef}
        className="relative overflow-y-auto"
        style={{ maxHeight: PAGE_HEIGHT_PX }}
      >
        {template}
        <PageBreakGuide />
      </div>
    </div>
  );
}
