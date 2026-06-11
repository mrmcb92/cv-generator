"use client";

import { PersonalInfo } from "@/types/cv";
import { Theme } from "@/types/theme";
import { motion } from "motion/react";
import { EnvelopeSimple, Phone, MapPin, Globe, LinkedinLogo } from "@phosphor-icons/react";

interface Props {
  data: PersonalInfo;
  onChange: (data: PersonalInfo) => void;
  theme: Theme;
}

// Double-Bezel input — outer shell + inner core
function DBInput({
  type = "text",
  value,
  onChange,
  placeholder,
  theme,
  rows,
}: {
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  theme: Theme;
  rows?: number;
}) {
  const isDark = theme.id === "dark";

  const outerShell = isDark
    ? "bg-white/[0.04] ring-1 ring-white/[0.08] rounded-xl p-[2px]"
    : "bg-black/[0.03] ring-1 ring-black/[0.07] rounded-xl p-[2px]";

  const innerCore = isDark
    ? "w-full bg-zinc-800 rounded-[calc(0.75rem-2px)] px-3 py-2.5 text-[13px] text-zinc-100 placeholder-zinc-600 transition-all duration-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.04)]"
    : "w-full bg-white rounded-[calc(0.75rem-2px)] px-3 py-2.5 text-[13px] text-zinc-900 placeholder-zinc-400 transition-all duration-300 shadow-[inset_0_1px_2px_rgba(0,0,0,0.04),inset_0_0_0_1px_rgba(255,255,255,0.9)]";

  const focusRing = isDark
    ? "focus:ring-2 focus:ring-cyan-400/30 focus:ring-offset-0"
    : "focus:ring-2 focus:ring-sky-500/25 focus:ring-offset-0";

  const sharedStyle = {
    transitionTimingFunction: "cubic-bezier(0.32,0.72,0,1)",
  };

  return (
    <div className={outerShell}>
      {rows ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          placeholder={placeholder}
          className={`${innerCore} ${focusRing} resize-none leading-relaxed`}
          style={sharedStyle}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`${innerCore} ${focusRing}`}
          style={sharedStyle}
        />
      )}
    </div>
  );
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

  const labelClass = `block mb-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] ${isDark ? "text-zinc-500" : "text-zinc-400"}`;

  // Eyebrow tag
  const eyebrow = (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-semibold uppercase tracking-[0.18em] mb-3 ${
      isDark ? "bg-cyan-400/10 text-cyan-400" : "bg-sky-500/10 text-sky-600"
    }`}>
      Secțiunea 1
    </span>
  );

  return (
    <motion.div variants={STAGGER} initial="hidden" animate="visible" className="space-y-4">
      <motion.div variants={ITEM}>
        {eyebrow}
        <h2 className={`text-base font-bold tracking-tight ${isDark ? "text-white" : "text-zinc-900"}`}>
          Informații personale
        </h2>
        <p className={`text-[11px] mt-0.5 ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
          Date de contact și prezentare
        </p>
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
          <DBInput type="email" value={data.email} onChange={(v) => update("email", v)} placeholder="ion.popescu@email.com" theme={theme} />
        </motion.div>
        <motion.div variants={ITEM}>
          <label className={labelClass}><span className="flex items-center gap-1"><Phone size={10} weight="bold" />Telefon</span></label>
          <DBInput type="tel" value={data.phone} onChange={(v) => update("phone", v)} placeholder="+40 700 000 000" theme={theme} />
        </motion.div>

        <motion.div variants={ITEM}>
          <label className={labelClass}><span className="flex items-center gap-1"><MapPin size={10} weight="bold" />Localitate</span></label>
          <DBInput value={data.location} onChange={(v) => update("location", v)} placeholder="București, România" theme={theme} />
        </motion.div>
        <motion.div variants={ITEM}>
          <label className={labelClass}><span className="flex items-center gap-1"><LinkedinLogo size={10} weight="bold" />LinkedIn</span></label>
          <DBInput value={data.linkedin ?? ""} onChange={(v) => update("linkedin", v)} placeholder="linkedin.com/in/ion-popescu" theme={theme} />
        </motion.div>

        <motion.div variants={ITEM} className="col-span-2">
          <label className={labelClass}><span className="flex items-center gap-1"><Globe size={10} weight="bold" />Website</span></label>
          <DBInput value={data.website ?? ""} onChange={(v) => update("website", v)} placeholder="www.ionpopescu.ro" theme={theme} />
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
