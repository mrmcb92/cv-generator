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

export default function CVPreview({ data, templateId }: Props) {
  switch (templateId) {
    case "modern":   return <ModernTemplate   data={data} />;
    case "minimal":  return <MinimalTemplate  data={data} />;
    case "creative": return <CreativeTemplate data={data} />;
    default:         return <ClassicTemplate  data={data} />;
  }
}
