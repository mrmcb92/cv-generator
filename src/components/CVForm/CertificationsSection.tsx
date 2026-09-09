"use client";

import { CertificationItem } from "@/types/cv";
import { Theme } from "@/types/theme";
import { Certificate, Trash, Link as LinkIcon, IdentificationBadge } from "@phosphor-icons/react";
import { DBInput, AddButton, SectionHeader, fieldLabelClass } from "@/components/ui/fields";
import DraggableList from "@/components/ui/DraggableList";
import DateInput from "@/components/ui/DateInput";

interface Props {
  data?: CertificationItem[];
  certifications?: CertificationItem[];
  onChange: (data: CertificationItem[]) => void;
  theme: Theme;
  lang?: string;
}

function newCert(): CertificationItem {
  return {
    id: crypto.randomUUID(),
    name: "",
    issuer: "",
    issueDate: "",
    expiryDate: "",
    credentialId: "",
    url: "",
  };
}

export default function CertificationsSection({ data, certifications, onChange, theme }: Props) {
  const items = certifications ?? data ?? [];
  const isDark = theme.id === "dark";
  const labelClass = fieldLabelClass(theme);

  const addCert = () => onChange([...items, newCert()]);
  const removeCert = (id: string) => onChange(items.filter((c) => c.id !== id));

  const updateCert = (id: string, field: keyof CertificationItem, value: string) =>
    onChange(items.map((c) => (c.id === id ? { ...c, [field]: value } : c)));

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <SectionHeader
          eyebrow="Acreditări"
          title="Certificări & Cursuri"
          subtitle={`${items.length} ${items.length === 1 ? "certificare adăugată" : "certificări adăugate"}`}
          theme={theme}
        />
        <AddButton onClick={addCert} theme={theme} />
      </div>

      {items.length === 0 && (
        <div
          className={`flex flex-col items-center justify-center py-10 rounded-2xl border border-dashed ${
            isDark ? "border-zinc-700 text-zinc-600" : "border-zinc-200 text-zinc-400"
          }`}
        >
          <Certificate size={30} weight="thin" className="mb-2 opacity-40" />
          <p className="text-[12px] font-medium">Nicio certificare adăugată</p>
          <p className="text-[11px] mt-0.5 text-zinc-500">
            Certificările industriale (Google, AWS, Microsoft, Cisco) cresc credibilitatea profilului.
          </p>
          <button
            onClick={addCert}
            className={`mt-2.5 text-[11px] font-medium underline underline-offset-2 ${
              isDark ? "text-cyan-400" : "text-sky-600"
            }`}
          >
            Adaugă prima certificare
          </button>
        </div>
      )}

      <DraggableList
        items={items}
        onChange={onChange}
        getId={(c) => c.id}
        theme={theme}
        scope="certifications"
        renderItem={(cert) => (
          <div
            className={`p-4 rounded-xl border space-y-3.5 ${
              isDark ? "bg-zinc-900/60 border-zinc-800" : "bg-white/80 border-zinc-200 shadow-sm"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className={`text-[11px] font-semibold uppercase tracking-wider ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
                {cert.name || "Certificare nouă"}
              </span>
              <button
                onClick={() => removeCert(cert.id)}
                className="p-1 rounded-md text-zinc-400 hover:text-red-500 hover:bg-red-500/10 transition"
                title="Șterge certificarea"
              >
                <Trash size={14} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 sm:col-span-1">
                <label className={labelClass}>Denumire certificare / curs</label>
                <DBInput
                  value={cert.name}
                  onChange={(v) => updateCert(cert.id, "name", v)}
                  placeholder="ex: AWS Solutions Architect, Google Project Management"
                  theme={theme}
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className={labelClass}>Organizație emitentă</label>
                <DBInput
                  value={cert.issuer}
                  onChange={(v) => updateCert(cert.id, "issuer", v)}
                  placeholder="ex: Amazon Web Services, Google, Coursera"
                  theme={theme}
                />
              </div>

              <div>
                <label className={labelClass}>Data emiterii</label>
                <DateInput
                  value={cert.issueDate}
                  onChange={(v) => updateCert(cert.id, "issueDate", v)}
                  theme={theme}
                />
              </div>
              <div>
                <label className={labelClass}>Data expirării (opțional)</label>
                <DateInput
                  value={cert.expiryDate || ""}
                  onChange={(v) => updateCert(cert.id, "expiryDate", v)}
                  theme={theme}
                />
              </div>

              <div>
                <label className={labelClass}>
                  <span className="flex items-center gap-1">
                    <IdentificationBadge size={10} weight="bold" /> ID Credențial (opțional)
                  </span>
                </label>
                <DBInput
                  value={cert.credentialId || ""}
                  onChange={(v) => updateCert(cert.id, "credentialId", v)}
                  placeholder="ex: ABC-123456"
                  theme={theme}
                />
              </div>
              <div>
                <label className={labelClass}>
                  <span className="flex items-center gap-1">
                    <LinkIcon size={10} weight="bold" /> Link verificare (URL)
                  </span>
                </label>
                <DBInput
                  value={cert.url || ""}
                  onChange={(v) => updateCert(cert.id, "url", v)}
                  placeholder="https://credly.com/..."
                  theme={theme}
                />
              </div>
            </div>
          </div>
        )}
      />
    </div>
  );
}
