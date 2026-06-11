"use client";

import { PersonalInfo } from "@/types/cv";
import { Theme } from "@/types/theme";
import { motion } from "motion/react";
import { EnvelopeSimple, Phone, MapPin, Globe, LinkedinLogo } from "@phosphor-icons/react";
import { DBInput, SectionHeader, fieldLabelClass } from "@/components/ui/fields";
import { isValidEmail, isValidPhone, isValidUrl } from "@/lib/fieldValidation";

interface Props {
  data: PersonalInfo;
  onChange: (data: PersonalInfo) => void;
  theme: Theme;
}

const STAGGER = { hidden: {}, visible: { transition: { staggerChildren: 0.05 } } };
const ITEM = {
  hidden: { opacity: 0, y: 10, filter: "blur(3px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

export default function PersonalSection({ data, onChange, theme }: Props) {
  const update = (field: keyof PersonalInfo, value: string) =>
    onChange({ ...data, [field]: value });

  const isDark = theme.id === "dark";
  const labelClass = fieldLabelClass(theme);

  return (
    <motion.div variants={STAGGER} initial="hidden" animate="visible" className="space-y-4">
      <motion.div variants={ITEM}>
        <SectionHeader eyebrow="Secțiunea 1" title="Informații personale" subtitle="Date de contact și prezentare" theme={theme} />
      </motion.div>

      <div className="grid grid-cols-2 gap-x-3 gap-y-3.5">
        <motion.div variants={ITEM}>
          <label className={labelClass}>Prenume</label>
          <DBInput value={data.firstName} onChange={(v) => update("firstName", v)} placeholder="Ion" theme={theme} />
        </motion.div>
        <motion.div variants={ITEM}>
          <label className={labelClass}>Nume</label>
          <DBInput value={data.lastName} onChange={(v) => update("lastName", v)} placeholder="Popescu" theme={theme} />
        </motion.div>

        <motion.div variants={ITEM}>
          <label className={labelClass}><span className="flex items-center gap-1"><EnvelopeSimple size={10} weight="bold" />Email</span></label>
          <DBInput type="email" value={data.email} onChange={(v) => update("email", v)} placeholder="ion.popescu@email.com" theme={theme}
            invalid={!isValidEmail(data.email)} hint="Adresa de email nu pare validă" />
        </motion.div>
        <motion.div variants={ITEM}>
          <label className={labelClass}><span className="flex items-center gap-1"><Phone size={10} weight="bold" />Telefon</span></label>
          <DBInput type="tel" value={data.phone} onChange={(v) => update("phone", v)} placeholder="+40 700 000 000" theme={theme}
            invalid={!isValidPhone(data.phone)} hint="Numărul de telefon nu pare valid" />
        </motion.div>

        <motion.div variants={ITEM}>
          <label className={labelClass}><span className="flex items-center gap-1"><MapPin size={10} weight="bold" />Localitate</span></label>
          <DBInput value={data.location} onChange={(v) => update("location", v)} placeholder="București, România" theme={theme} />
        </motion.div>
        <motion.div variants={ITEM}>
          <label className={labelClass}><span className="flex items-center gap-1"><LinkedinLogo size={10} weight="bold" />LinkedIn</span></label>
          <DBInput value={data.linkedin ?? ""} onChange={(v) => update("linkedin", v)} placeholder="linkedin.com/in/ion-popescu" theme={theme}
            invalid={!isValidUrl(data.linkedin ?? "")} hint="Adresa nu pare validă" />
        </motion.div>

        <motion.div variants={ITEM} className="col-span-2">
          <label className={labelClass}><span className="flex items-center gap-1"><Globe size={10} weight="bold" />Website</span></label>
          <DBInput value={data.website ?? ""} onChange={(v) => update("website", v)} placeholder="www.ionpopescu.ro" theme={theme}
            invalid={!isValidUrl(data.website ?? "")} hint="Adresa nu pare validă" />
        </motion.div>

        <motion.div variants={ITEM} className="col-span-2">
          <label className={labelClass}>Rezumat profesional</label>
          <DBInput value={data.summary} onChange={(v) => update("summary", v)} placeholder="Scurtă descriere a experienței și obiectivelor tale profesionale..." theme={theme} rows={4} />
          <p className={`mt-1.5 text-[10px] ${isDark ? "text-zinc-600" : "text-zinc-400"}`}>
            2-4 propoziții despre experiența și valoarea ta
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
