"use client";

import { useRef, useState } from "react";
import { PersonalInfo } from "@/types/cv";
import { Theme } from "@/types/theme";
import { motion } from "motion/react";
import { EnvelopeSimple, Phone, MapPin, Globe, LinkedinLogo, Camera, Trash } from "@phosphor-icons/react";
import { DBInput, SectionHeader, fieldLabelClass } from "@/components/ui/fields";
import { isValidEmail, isValidPhone, isValidUrl } from "@/lib/fieldValidation";
import { processPhoto } from "@/lib/processPhoto";

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
  const photoRef = useRef<HTMLInputElement>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);

  const handlePhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      setPhotoError(null);
      update("photo", await processPhoto(file));
    } catch (err) {
      setPhotoError(err instanceof Error ? err.message : "Imaginea nu a putut fi procesată");
    }
  };

  return (
    <motion.div variants={STAGGER} initial="hidden" animate="visible" className="space-y-4">
      <motion.div variants={ITEM}>
        <SectionHeader eyebrow="Secțiunea 1" title="Informații personale" subtitle="Date de contact și prezentare" theme={theme} />
      </motion.div>

      {/* Profile photo */}
      <motion.div variants={ITEM} className="flex items-center gap-3">
        <input ref={photoRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
        <button
          onClick={() => photoRef.current?.click()}
          aria-label={data.photo ? "Schimbă fotografia de profil" : "Adaugă fotografie de profil"}
          className={`relative w-16 h-16 rounded-full overflow-hidden flex items-center justify-center transition-all duration-300 active:scale-[0.96] ${
            data.photo
              ? "ring-2 ring-sky-400/50"
              : isDark ? "bg-white/[0.05] ring-1 ring-dashed ring-white/20 text-zinc-500 hover:text-zinc-300" : "bg-black/[0.03] ring-1 ring-dashed ring-black/15 text-zinc-400 hover:text-zinc-600"
          }`}
        >
          {data.photo
            ? /* eslint-disable-next-line @next/next/no-img-element -- small inline data URL, next/image adds nothing here */
              <img src={data.photo} alt="Fotografie de profil" className="w-full h-full object-cover" />
            : <Camera size={20} weight="regular" />}
        </button>
        <div>
          <p className={`text-[12px] font-medium ${isDark ? "text-zinc-300" : "text-zinc-700"}`}>Fotografie de profil</p>
          <p className={`text-[10.5px] mt-0.5 ${isDark ? "text-zinc-600" : "text-zinc-400"}`}>
            Opțională — decupată automat pătrat. Apare pe template-urile Classic, Modern și Creative.
          </p>
          {photoError && <p className="text-[10.5px] mt-0.5 text-red-400">{photoError}</p>}
          {data.photo && (
            <button onClick={() => update("photo", "")}
              className={`mt-1 flex items-center gap-1 text-[10.5px] transition-colors ${isDark ? "text-zinc-500 hover:text-red-400" : "text-zinc-400 hover:text-red-500"}`}>
              <Trash size={10} weight="bold" /> Elimină fotografia
            </button>
          )}
        </div>
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
