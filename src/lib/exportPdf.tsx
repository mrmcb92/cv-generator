import React from "react";
import { Document, Page, Text, View, StyleSheet, pdf, Font, Image } from "@react-pdf/renderer";
import { CVData } from "@/types/cv";
import { TemplateId } from "@/types/template";

// ─── Font registration (Roboto with Romanian/Latin-Ext support) ───
// In the browser "/fonts/..." resolves against the app origin; in Node
// (smoke tests, future SSR) it falls back to the files in public/.
const FONT_BASE = typeof window === "undefined" ? "public" : "";
Font.register({
  family: "Roboto",
  fonts: [
    {
      src: `${FONT_BASE}/fonts/Roboto-Regular.ttf`,
      fontWeight: 400,
    },
    {
      src: `${FONT_BASE}/fonts/Roboto-Bold.ttf`,
      fontWeight: 700,
    },
    {
      src: `${FONT_BASE}/fonts/Roboto-Italic.ttf`,
      fontWeight: 400,
      fontStyle: "italic",
    },
  ],
});

// ─── Shared helpers ───────────────────────────────────────────────
import { CV_LABELS, CvLang, fmtDate as fmtDateL } from "@/lib/cvLabels";

const LEVEL_W: Record<string, string> = {
  Expert: "100%", Avansat: "75%", Mediu: "50%", "Începător": "25%",
};

// ═══════════════════════════════════════════════════════════════════
// 1. CLASSIC — full-width navy header, single-column body
// ═══════════════════════════════════════════════════════════════════
const classicS = StyleSheet.create({
  page:        { backgroundColor: "#ffffff", fontFamily: "Roboto", fontSize: 11 },
  header:      { backgroundColor: "#1e293b", padding: "28 32" },
  name:        { fontSize: 26, fontWeight: "bold", color: "#ffffff", marginBottom: 8 },
  contactRow:  { flexDirection: "row", flexWrap: "wrap", gap: "0 20" },
  contactItem: { fontSize: 10, color: "#94a3b8" },
  body:        { padding: "24 32" },
  section:     { marginBottom: 16 },
  secTitle:    { fontSize: 10, fontWeight: "bold", textTransform: "uppercase", letterSpacing: 1.4,
                 color: "#64748b", borderBottomWidth: 1, borderBottomColor: "#e2e8f0",
                 paddingBottom: 3, marginBottom: 8 },
  summaryText: { fontSize: 11, color: "#475569", lineHeight: 1.6 },
  expItem:     { marginBottom: 10 },
  expRow:      { flexDirection: "row", justifyContent: "space-between" },
  expTitle:    { fontSize: 11, fontWeight: "bold", color: "#1e293b" },
  expSub:      { fontSize: 11, color: "#64748b" },
  expDate:     { fontSize: 10, color: "#94a3b8" },
  expDesc:     { fontSize: 10, color: "#475569", marginTop: 2, lineHeight: 1.5 },
  twoCol:      { flexDirection: "row", gap: "0 24" },
  col:         { flex: 1 },
  skillRow:    { flexDirection: "row", justifyContent: "space-between", fontSize: 11,
                 color: "#1e293b", marginBottom: 3 },
  skillLevel:  { color: "#94a3b8", fontSize: 10 },
});

function ClassicPdf({ data, lang }: { data: CVData; lang: CvLang }) {
  const { personal: p, experience, education, skills, languages, drivingLicenses, customSections } = data;
  const L = CV_LABELS[lang];
  const fmtDate = (d: string) => fmtDateL(d, lang);
  return (
    <Document>
      <Page size="A4" style={classicS.page}>
        <View style={[classicS.header, { flexDirection: "row", justifyContent: "space-between", alignItems: "center" }]}>
          <View>
            <Text style={classicS.name}>
              {`${p.firstName} ${p.lastName}`.trim() || "Nume Prenume"}
            </Text>
            <View style={classicS.contactRow}>
              {p.email    && <Text style={classicS.contactItem}>{p.email}</Text>}
              {p.phone    && <Text style={classicS.contactItem}>{p.phone}</Text>}
              {p.location && <Text style={classicS.contactItem}>{p.location}</Text>}
              {p.website  && <Text style={classicS.contactItem}>{p.website}</Text>}
              {p.linkedin && <Text style={classicS.contactItem}>{p.linkedin}</Text>}
            </View>
          </View>
          {p.photo ? (
            // eslint-disable-next-line jsx-a11y/alt-text -- react-pdf Image, not an HTML img
            <Image src={p.photo} style={{ width: 64, height: 64, borderRadius: 32, marginLeft: 16 }} />
          ) : null}
        </View>
        <View style={classicS.body}>
          {p.summary && (
            <View style={classicS.section}>
              <Text style={classicS.secTitle}>{L.profile}</Text>
              <Text style={classicS.summaryText}>{p.summary}</Text>
            </View>
          )}
          {experience.length > 0 && (
            <View style={classicS.section}>
              <Text style={classicS.secTitle}>{L.experience}</Text>
              {experience.map(e => (
                <View key={e.id} style={{ marginBottom: 10 }}>
                  {e.company && <Text style={[classicS.expTitle, { marginBottom: 4 }]}>{e.company}</Text>}
                  {e.positions.map(pos => (
                    <View key={pos.id} wrap={false} style={[classicS.expItem, { marginLeft: 8, borderLeftWidth: 2, borderLeftColor: "#e2e8f0", paddingLeft: 6 }]}>
                      <View style={classicS.expRow}>
                        <Text style={[classicS.expTitle, { fontWeight: "normal" }]}>{pos.title}</Text>
                        <Text style={classicS.expDate}>
                          {fmtDate(pos.startDate)} – {pos.current ? L.present : fmtDate(pos.endDate)}
                        </Text>
                      </View>
                      {pos.description && <Text style={classicS.expDesc}>{pos.description}</Text>}
                    </View>
                  ))}
                </View>
              ))}
            </View>
          )}
          {education.length > 0 && (
            <View style={classicS.section}>
              <Text style={classicS.secTitle}>{L.education}</Text>
              {education.map(e => (
                <View key={e.id} wrap={false} style={[classicS.expItem, { marginBottom: 6 }]}>
                  <View style={classicS.expRow}>
                    <Text style={classicS.expTitle}>
                      {e.degree}{e.field ? ` ${L.inWord} ${e.field}` : ""}{e.institution ? `  ·  ${e.institution}` : ""}
                    </Text>
                    <Text style={classicS.expDate}>
                      {fmtDate(e.startDate)} – {fmtDate(e.endDate)}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}
          {(skills.length > 0 || languages.length > 0) && (
            <View style={[classicS.section, classicS.twoCol]}>
              {skills.length > 0 && (
                <View style={classicS.col}>
                  <Text style={classicS.secTitle}>{L.skills}</Text>
                  {skills.map(s => (
                    <View key={s.id} style={classicS.skillRow}>
                      <Text>{s.name}</Text>
                      <Text style={classicS.skillLevel}>{s.level}</Text>
                    </View>
                  ))}
                </View>
              )}
              {languages.length > 0 && (
                <View style={classicS.col}>
                  <Text style={classicS.secTitle}>{L.languages}</Text>
                  {languages.map(l => (
                    <View key={l.id} style={classicS.skillRow}>
                      <Text>{l.name}</Text>
                      <Text style={classicS.skillLevel}>{l.level}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          )}
          {customSections.filter(cs => cs.title && cs.items.length > 0).map(cs => (
            <View key={cs.id} style={classicS.section}>
              <Text style={classicS.secTitle}>{cs.title}</Text>
              {cs.items.map(it => (
                <View key={it.id} style={{ marginBottom: 6 }}>
                  <View style={classicS.expRow}>
                    <Text style={classicS.expTitle}>
                      {it.name}{it.subtitle ? `  ·  ${it.subtitle}` : ""}
                    </Text>
                    {it.date ? <Text style={classicS.expDate}>{it.date}</Text> : null}
                  </View>
                  {it.description ? <Text style={classicS.expDesc}>{it.description}</Text> : null}
                </View>
              ))}
            </View>
          ))}
          {drivingLicenses?.length > 0 && (
            <View style={classicS.section}>
              <Text style={classicS.secTitle}>{L.driving}</Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: "0 20" }}>
                {drivingLicenses.map(d => (
                  <Text key={d.id} style={{ fontSize: 11, color: "#1e293b", marginBottom: 3 }}>
                    {L.category} {d.category}{d.year ? <Text style={{ color: "#94a3b8", fontSize: 10 }}> · {d.year}</Text> : null}
                  </Text>
                ))}
              </View>
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
}

// ═══════════════════════════════════════════════════════════════════
// 2. MODERN — navy sidebar 35% + light content 65%
// ═══════════════════════════════════════════════════════════════════
const modernS = StyleSheet.create({
  page:      { flexDirection: "row", backgroundColor: "#f1f5f9", fontFamily: "Roboto", fontSize: 11 },
  // full-height bar painted on every page, so the sidebar background
  // continues correctly when the CV flows onto page 2+
  sidebarBg: { position: "absolute", top: 0, bottom: 0, left: 0, width: "35%", backgroundColor: "#1e293b" },
  sidebar:   { width: "35%", paddingTop: 28, paddingBottom: 12, paddingHorizontal: 20 },
  nameFirst: { fontSize: 22, fontWeight: "bold", color: "#38bdf8", lineHeight: 1.1 },
  nameLast:  { fontSize: 22, fontWeight: "bold", color: "#ffffff", lineHeight: 1.1, marginBottom: 14 },
  sideSecTitle: { fontSize: 9, fontWeight: "bold", textTransform: "uppercase", letterSpacing: 1.6,
                  color: "#38bdf8", marginTop: 14, marginBottom: 6 },
  contactItem: { fontSize: 10, color: "#94a3b8", marginBottom: 3 },
  skillName: { fontSize: 10, color: "#94a3b8", marginBottom: 3 },
  skillBarRow: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  skillLvl:  { fontSize: 8, color: "#64748b", width: 42, flexShrink: 0 },
  track:     { flex: 1, height: 2, backgroundColor: "#334155", borderRadius: 1, marginRight: 4 },
  fill:      { height: 2, backgroundColor: "#38bdf8", borderRadius: 1 },
  langRow:   { flexDirection: "row", justifyContent: "space-between", marginBottom: 3 },
  langName:  { fontSize: 10, color: "#94a3b8" },
  langLvl:   { fontSize: 9, color: "#38bdf8", fontWeight: "bold" },
  content:   { flex: 1, paddingTop: 28, paddingBottom: 12, paddingHorizontal: 22 },
  section:   { marginBottom: 14 },
  secTitle:  { fontSize: 10, fontWeight: "bold", textTransform: "uppercase", letterSpacing: 1.4,
               color: "#0284c7", borderBottomWidth: 2, borderBottomColor: "#e2e8f0",
               paddingBottom: 3, marginBottom: 8 },
  summaryTxt: { fontSize: 11, color: "#475569", lineHeight: 1.6 },
  expItem:   { marginBottom: 10, paddingLeft: 8, borderLeftWidth: 2, borderLeftColor: "#e2e8f0" },
  expRow:    { flexDirection: "row", justifyContent: "space-between" },
  expTitle:  { fontSize: 11, fontWeight: "bold", color: "#1e293b", flex: 1 },
  expDate:   { fontSize: 10, color: "#94a3b8", flexShrink: 0, marginLeft: 8 },
  expComp:   { fontSize: 10, color: "#0284c7", fontWeight: "bold", marginTop: 1 },
  expDesc:   { fontSize: 10, color: "#475569", marginTop: 2, lineHeight: 1.5 },
});

function ModernPdf({ data, lang }: { data: CVData; lang: CvLang }) {
  const { personal: p, experience, education, skills, languages, drivingLicenses, customSections } = data;
  const L = CV_LABELS[lang];
  const fmtDate = (d: string) => fmtDateL(d, lang);
  return (
    <Document>
      <Page size="A4" style={modernS.page}>
        <View style={modernS.sidebarBg} fixed />
        <View style={modernS.sidebar}>
          {p.photo ? (
            // eslint-disable-next-line jsx-a11y/alt-text -- react-pdf Image, not an HTML img
            <Image src={p.photo} style={{ width: 76, height: 76, borderRadius: 38, marginBottom: 12 }} />
          ) : null}
          <Text style={modernS.nameFirst}>{p.firstName || "Prenume"}</Text>
          <Text style={modernS.nameLast}>{p.lastName || "Nume"}</Text>
          <Text style={modernS.sideSecTitle}>Contact</Text>
          {p.email    && <Text style={modernS.contactItem}>{p.email}</Text>}
          {p.phone    && <Text style={modernS.contactItem}>{p.phone}</Text>}
          {p.location && <Text style={modernS.contactItem}>{p.location}</Text>}
          {p.website  && <Text style={modernS.contactItem}>{p.website}</Text>}
          {p.linkedin && <Text style={modernS.contactItem}>{p.linkedin}</Text>}
          {skills.length > 0 && (
            <View>
              <Text style={modernS.sideSecTitle}>{L.skills}</Text>
              {skills.map(s => (
                <View key={s.id}>
                  <Text style={modernS.skillName}>{s.name}</Text>
                  <View style={modernS.skillBarRow}>
                    <View style={modernS.track}>
                      <View style={[modernS.fill, { width: LEVEL_W[s.level] ?? "25%" }]} />
                    </View>
                    <Text style={modernS.skillLvl}>{s.level}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
          {languages.length > 0 && (
            <View>
              <Text style={modernS.sideSecTitle}>{L.languages}</Text>
              {languages.map(l => (
                <View key={l.id} style={modernS.langRow}>
                  <Text style={modernS.langName}>{l.name}</Text>
                  <Text style={modernS.langLvl}>{l.level}</Text>
                </View>
              ))}
            </View>
          )}
          {drivingLicenses?.length > 0 && (
            <View>
              <Text style={modernS.sideSecTitle}>{L.driving}</Text>
              {drivingLicenses.map(d => (
                <View key={d.id} style={modernS.langRow}>
                  <Text style={modernS.langName}>{L.category} {d.category}</Text>
                  {d.year ? <Text style={modernS.langLvl}>{d.year}</Text> : null}
                </View>
              ))}
            </View>
          )}
        </View>
        <View style={modernS.content}>
          {p.summary && (
            <View style={modernS.section}>
              <Text style={modernS.secTitle}>{L.profileLong}</Text>
              <Text style={modernS.summaryTxt}>{p.summary}</Text>
            </View>
          )}
          {experience.length > 0 && (
            <View style={modernS.section}>
              <Text style={modernS.secTitle}>{L.experience}</Text>
              {experience.map(e => (
                <View key={e.id} style={{ marginBottom: 10 }}>
                  {e.company && <Text style={[modernS.expComp, { marginBottom: 4 }]}>{e.company}</Text>}
                  {e.positions.map(pos => (
                    <View key={pos.id} wrap={false} style={modernS.expItem}>
                      <View style={modernS.expRow}>
                        <Text style={modernS.expTitle}>{pos.title}</Text>
                        <Text style={modernS.expDate}>
                          {fmtDate(pos.startDate)} – {pos.current ? L.present : fmtDate(pos.endDate)}
                        </Text>
                      </View>
                      {pos.description && <Text style={modernS.expDesc}>{pos.description}</Text>}
                    </View>
                  ))}
                </View>
              ))}
            </View>
          )}
          {education.length > 0 && (
            <View style={modernS.section}>
              <Text style={modernS.secTitle}>{L.education}</Text>
              {education.map(e => (
                <View key={e.id} wrap={false} style={modernS.expItem}>
                  <View style={modernS.expRow}>
                    <Text style={modernS.expTitle}>
                      {e.degree}{e.field ? ` · ${e.field}` : ""}
                    </Text>
                    <Text style={modernS.expDate}>
                      {fmtDate(e.startDate)} – {fmtDate(e.endDate)}
                    </Text>
                  </View>
                  {e.institution && <Text style={[modernS.expComp, { fontSize: 10 }]}>{e.institution}</Text>}
                </View>
              ))}
            </View>
          )}
          {customSections.filter(cs => cs.title && cs.items.length > 0).map(cs => (
            <View key={cs.id} style={modernS.section}>
              <Text style={modernS.secTitle}>{cs.title}</Text>
              {cs.items.map(it => (
                <View key={it.id} wrap={false} style={modernS.expItem}>
                  <View style={modernS.expRow}>
                    <Text style={modernS.expTitle}>{it.name}</Text>
                    {it.date ? <Text style={modernS.expDate}>{it.date}</Text> : null}
                  </View>
                  {it.subtitle ? <Text style={[modernS.expComp, { fontSize: 10 }]}>{it.subtitle}</Text> : null}
                  {it.description ? <Text style={modernS.expDesc}>{it.description}</Text> : null}
                </View>
              ))}
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
}

// ═══════════════════════════════════════════════════════════════════
// 3. MINIMAL — clean single-column, generous whitespace
// ═══════════════════════════════════════════════════════════════════
const minimalS = StyleSheet.create({
  page:        { backgroundColor: "#ffffff", fontFamily: "Roboto", fontSize: 11,
                 padding: "40 48" },
  name:        { fontSize: 30, fontWeight: "normal", color: "#18181b", letterSpacing: -0.5,
                 lineHeight: 1, marginBottom: 6 },
  contactLine: { fontSize: 10, color: "#a1a1aa", letterSpacing: 0.5, marginBottom: 16 },
  rule:        { height: 1, backgroundColor: "#e4e4e7", marginBottom: 18 },
  summaryTxt:  { fontSize: 11, color: "#52525b", lineHeight: 1.7, marginBottom: 18 },
  section:     { marginBottom: 18 },
  secTitle:    { fontSize: 9, fontWeight: "bold", textTransform: "uppercase", letterSpacing: 2,
                 color: "#a1a1aa", marginBottom: 10 },
  expItem:     { flexDirection: "row", justifyContent: "space-between",
                 marginBottom: 12, gap: "0 24" },
  expLeft:     { flex: 1 },
  expTitle:    { fontSize: 11, fontWeight: "bold", color: "#18181b" },
  expSub:      { fontSize: 10, color: "#71717a", marginTop: 1 },
  expDesc:     { fontSize: 10, color: "#52525b", marginTop: 3, lineHeight: 1.6 },
  expDate:     { fontSize: 10, color: "#a1a1aa", textAlign: "right", whiteSpace: "nowrap" },
  skillLine:   { fontSize: 11, color: "#3f3f46", marginBottom: 2 },
  skillMuted:  { color: "#a1a1aa" },
});

function MinimalPdf({ data, lang }: { data: CVData; lang: CvLang }) {
  const { personal: p, experience, education, skills, languages, drivingLicenses, customSections } = data;
  const L = CV_LABELS[lang];
  const fmtDate = (d: string) => fmtDateL(d, lang);
  const name = `${p.firstName} ${p.lastName}`.trim() || "Nume Prenume";
  const contactParts = [p.email, p.phone, p.location, p.website, p.linkedin].filter(Boolean);
  return (
    <Document>
      <Page size="A4" style={minimalS.page}>
        <Text style={minimalS.name}>{name}</Text>
        {contactParts.length > 0 && (
          <Text style={minimalS.contactLine}>{contactParts.join("   ·   ")}</Text>
        )}
        <View style={minimalS.rule} />
        {p.summary && (
          <Text style={minimalS.summaryTxt}>{p.summary}</Text>
        )}
        {experience.length > 0 && (
          <View style={minimalS.section}>
            <Text style={minimalS.secTitle}>{L.experienceShort}</Text>
            {experience.map(e => (
              <View key={e.id} style={{ marginBottom: 10 }}>
                {e.company && <Text style={[minimalS.expTitle, { marginBottom: 4 }]}>{e.company}</Text>}
                {e.positions.map(pos => (
                  <View key={pos.id} wrap={false} style={[minimalS.expItem, { marginLeft: 8, borderLeftWidth: 1, borderLeftColor: "#e4e4e7", paddingLeft: 8 }]}>
                    <View style={minimalS.expLeft}>
                      <Text style={[minimalS.expTitle, { fontWeight: "normal", fontSize: 11 }]}>{pos.title}</Text>
                      {pos.description && <Text style={minimalS.expDesc}>{pos.description}</Text>}
                    </View>
                    <View>
                      <Text style={minimalS.expDate}>{fmtDate(pos.startDate)}</Text>
                      <Text style={minimalS.expDate}>{pos.current ? L.present : fmtDate(pos.endDate)}</Text>
                    </View>
                  </View>
                ))}
              </View>
            ))}
          </View>
        )}
        {education.length > 0 && (
          <View style={minimalS.section}>
            <Text style={minimalS.secTitle}>{L.education}</Text>
            {education.map(e => (
              <View key={e.id} wrap={false} style={minimalS.expItem}>
                <View style={minimalS.expLeft}>
                  <Text style={minimalS.expTitle}>
                    {e.degree}{e.field ? `, ${e.field}` : ""}
                  </Text>
                  {e.institution && <Text style={minimalS.expSub}>{e.institution}</Text>}
                </View>
                <View>
                  <Text style={minimalS.expDate}>{fmtDate(e.startDate)}</Text>
                  <Text style={minimalS.expDate}>{fmtDate(e.endDate)}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
        {(skills.length > 0 || languages.length > 0) && (
          <View style={minimalS.section}>
            <Text style={minimalS.secTitle}>{L.skillsAndLangs}</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: "0 32" }}>
              {[...skills.map(s => `${s.name} — ${s.level}`),
                ...languages.map(l => `${l.name} — ${l.level}`)
              ].map((item, i) => (
                <Text key={i} style={minimalS.skillLine}>{item}</Text>
              ))}
            </View>
          </View>
        )}
        {customSections.filter(cs => cs.title && cs.items.length > 0).map(cs => (
          <View key={cs.id} style={minimalS.section}>
            <Text style={minimalS.secTitle}>{cs.title}</Text>
            {cs.items.map(it => (
              <View key={it.id} wrap={false} style={minimalS.expItem}>
                <View style={minimalS.expLeft}>
                  <Text style={minimalS.expTitle}>{it.name}{it.subtitle ? `, ${it.subtitle}` : ""}</Text>
                  {it.description ? <Text style={minimalS.expDesc}>{it.description}</Text> : null}
                </View>
                {it.date ? <Text style={minimalS.expDate}>{it.date}</Text> : null}
              </View>
            ))}
          </View>
        ))}
        {drivingLicenses?.length > 0 && (
          <View style={minimalS.section}>
            <Text style={minimalS.secTitle}>{L.driving}</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: "0 32" }}>
              {drivingLicenses.map(d => (
                <Text key={d.id} style={minimalS.skillLine}>
                  {L.category} {d.category}{d.year ? ` — ${d.year}` : ""}
                </Text>
              ))}
            </View>
          </View>
        )}
      </Page>
    </Document>
  );
}

// ═══════════════════════════════════════════════════════════════════
// 4. CREATIVE — sky accent stripe, name left / contact right
// ═══════════════════════════════════════════════════════════════════
const creativeS = StyleSheet.create({
  page:        { backgroundColor: "#ffffff", fontFamily: "Roboto", fontSize: 11 },
  stripe:      { height: 4, backgroundColor: "#0ea5e9" },
  header:      { flexDirection: "row", justifyContent: "space-between",
                 alignItems: "flex-end", padding: "20 32 16 32",
                 borderBottomWidth: 1, borderBottomColor: "#f1f5f9" },
  nameFirst:   { fontSize: 26, fontWeight: "bold", color: "#0ea5e9", lineHeight: 1 },
  nameLast:    { fontSize: 26, fontWeight: "bold", color: "#18181b", lineHeight: 1 },
  contactBlock: { alignItems: "flex-end", gap: 2 },
  contactItem:  { fontSize: 10, color: "#71717a" },
  body:        { padding: "20 32" },
  section:     { marginBottom: 16 },
  secHeader:   { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 8 },
  secAccent:   { width: 3, height: 14, backgroundColor: "#0ea5e9", borderRadius: 2 },
  secTitle:    { fontSize: 10, fontWeight: "bold", textTransform: "uppercase",
                 letterSpacing: 1.6, color: "#0284c7" },
  summaryTxt:  { fontSize: 11, color: "#52525b", lineHeight: 1.7,
                 borderLeftWidth: 3, borderLeftColor: "#bae6fd", paddingLeft: 10 },
  expItem:     { marginBottom: 10, paddingLeft: 12 },
  expDot:      { width: 5, height: 5, borderRadius: 3, backgroundColor: "#38bdf8",
                 position: "absolute", left: 0, top: 4 },
  expRow:      { flexDirection: "row", justifyContent: "space-between" },
  expTitle:    { fontSize: 11, fontWeight: "bold", color: "#18181b" },
  expBadge:    { fontSize: 9, color: "#94a3b8", backgroundColor: "#f8fafc",
                 paddingHorizontal: 5, paddingVertical: 2 },
  expComp:     { fontSize: 10, color: "#0ea5e9", fontWeight: "bold", marginTop: 1 },
  expDesc:     { fontSize: 10, color: "#52525b", marginTop: 2, lineHeight: 1.5 },
  eduItem:     { flexDirection: "row", justifyContent: "space-between",
                 backgroundColor: "#f8fafc", padding: "6 10", marginBottom: 4 },
  eduTitle:    { fontSize: 11, fontWeight: "bold", color: "#18181b" },
  eduSub:      { fontSize: 10, color: "#0ea5e9", marginTop: 1 },
  eduDate:     { fontSize: 9, color: "#94a3b8", textAlign: "right" },
  twoCol:      { flexDirection: "row", gap: "0 24" },
  col:         { flex: 1 },
  skillPill:   { fontSize: 10, color: "#0369a1", backgroundColor: "#e0f2fe",
                 paddingHorizontal: 7, paddingVertical: 2, marginBottom: 4, marginRight: 4 },
  langRow:     { flexDirection: "row", justifyContent: "space-between",
                 alignItems: "center", marginBottom: 4 },
  langName:    { fontSize: 11, color: "#3f3f46" },
  langBadge:   { fontSize: 9, fontWeight: "bold", color: "#ffffff",
                 backgroundColor: "#0ea5e9", paddingHorizontal: 5, paddingVertical: 2 },
});

function CreativePdf({ data, lang }: { data: CVData; lang: CvLang }) {
  const { personal: p, experience, education, skills, languages, drivingLicenses, customSections } = data;
  const L = CV_LABELS[lang];
  const fmtDate = (d: string) => fmtDateL(d, lang);
  return (
    <Document>
      <Page size="A4" style={creativeS.page}>
        <View style={creativeS.stripe} />
        <View style={creativeS.header}>
          <View>
            <Text style={creativeS.nameFirst}>{p.firstName || "Prenume"}</Text>
            <Text style={creativeS.nameLast}>{p.lastName || "Nume"}</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <View style={creativeS.contactBlock}>
              {p.email    && <Text style={creativeS.contactItem}>{p.email}</Text>}
              {p.phone    && <Text style={creativeS.contactItem}>{p.phone}</Text>}
              {p.location && <Text style={creativeS.contactItem}>{p.location}</Text>}
              {p.website  && <Text style={creativeS.contactItem}>{p.website}</Text>}
              {p.linkedin && <Text style={creativeS.contactItem}>{p.linkedin}</Text>}
            </View>
            {p.photo ? (
              // eslint-disable-next-line jsx-a11y/alt-text -- react-pdf Image, not an HTML img
              <Image src={p.photo} style={{ width: 56, height: 56, borderRadius: 28 }} />
            ) : null}
          </View>
        </View>
        <View style={creativeS.body}>
          {p.summary && (
            <View style={creativeS.section}>
              <Text style={creativeS.summaryTxt}>{p.summary}</Text>
            </View>
          )}
          {experience.length > 0 && (
            <View style={creativeS.section}>
              <View style={creativeS.secHeader}>
                <View style={creativeS.secAccent} />
                <Text style={creativeS.secTitle}>{L.experience}</Text>
              </View>
              {experience.map(e => (
                <View key={e.id} style={[creativeS.expItem, { marginBottom: 10 }]}>
                  <View style={creativeS.expDot} />
                  {e.company && <Text style={creativeS.expComp}>{e.company}</Text>}
                  {e.positions.map(pos => (
                    <View key={pos.id} wrap={false} style={{ paddingLeft: 8, borderLeftWidth: 1, borderLeftColor: "#bae6fd", marginTop: 4 }}>
                      <View style={creativeS.expRow}>
                        <Text style={creativeS.expTitle}>{pos.title}</Text>
                        <Text style={creativeS.expBadge}>
                          {fmtDate(pos.startDate)} – {pos.current ? L.present : fmtDate(pos.endDate)}
                        </Text>
                      </View>
                      {pos.description && <Text style={creativeS.expDesc}>{pos.description}</Text>}
                    </View>
                  ))}
                </View>
              ))}
            </View>
          )}
          {education.length > 0 && (
            <View style={creativeS.section}>
              <View style={creativeS.secHeader}>
                <View style={creativeS.secAccent} />
                <Text style={creativeS.secTitle}>{L.education}</Text>
              </View>
              {education.map(e => (
                <View key={e.id} wrap={false} style={creativeS.eduItem}>
                  <View>
                    <Text style={creativeS.eduTitle}>
                      {e.degree}{e.field ? ` · ${e.field}` : ""}
                    </Text>
                    {e.institution && <Text style={creativeS.eduSub}>{e.institution}</Text>}
                  </View>
                  <Text style={creativeS.eduDate}>
                    {fmtDate(e.startDate)}{"\n"}{fmtDate(e.endDate)}
                  </Text>
                </View>
              ))}
            </View>
          )}
          {(skills.length > 0 || languages.length > 0) && (
            <View style={[creativeS.section, creativeS.twoCol]}>
              {skills.length > 0 && (
                <View style={creativeS.col}>
                  <View style={creativeS.secHeader}>
                    <View style={creativeS.secAccent} />
                    <Text style={creativeS.secTitle}>{L.skills}</Text>
                  </View>
                  <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                    {skills.map(s => (
                      <Text key={s.id} style={creativeS.skillPill}>{s.name}</Text>
                    ))}
                  </View>
                </View>
              )}
              {languages.length > 0 && (
                <View style={creativeS.col}>
                  <View style={creativeS.secHeader}>
                    <View style={creativeS.secAccent} />
                    <Text style={creativeS.secTitle}>{L.languages}</Text>
                  </View>
                  {languages.map(l => (
                    <View key={l.id} style={creativeS.langRow}>
                      <Text style={creativeS.langName}>{l.name}</Text>
                      <Text style={creativeS.langBadge}>{l.level}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          )}
          {customSections.filter(cs => cs.title && cs.items.length > 0).map(cs => (
            <View key={cs.id} style={creativeS.section}>
              <View style={creativeS.secHeader}>
                <View style={creativeS.secAccent} />
                <Text style={creativeS.secTitle}>{cs.title}</Text>
              </View>
              {cs.items.map(it => (
                <View key={it.id} wrap={false} style={{ marginBottom: 8, paddingLeft: 12 }}>
                  <View style={creativeS.expRow}>
                    <Text style={creativeS.expTitle}>{it.name}{it.subtitle ? ` · ${it.subtitle}` : ""}</Text>
                    {it.date ? <Text style={creativeS.expBadge}>{it.date}</Text> : null}
                  </View>
                  {it.description ? <Text style={creativeS.expDesc}>{it.description}</Text> : null}
                </View>
              ))}
            </View>
          ))}
          {drivingLicenses?.length > 0 && (
            <View style={creativeS.section}>
              <View style={creativeS.secHeader}>
                <View style={creativeS.secAccent} />
                <Text style={creativeS.secTitle}>{L.driving}</Text>
              </View>
              <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                {drivingLicenses.map(d => (
                  <Text key={d.id} style={creativeS.skillPill}>
                    {L.category} {d.category}{d.year ? ` · ${d.year}` : ""}
                  </Text>
                ))}
              </View>
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
}

// ─── Public API ────────────────────────────────────────────────────
export function buildPdfDocument(
  data: CVData,
  templateId: TemplateId = "classic",
  lang: CvLang = "ro",
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): React.ReactElement<any> {
  switch (templateId) {
    case "modern":   return <ModernPdf   data={data} lang={lang} />;
    case "minimal":  return <MinimalPdf  data={data} lang={lang} />;
    case "creative": return <CreativePdf data={data} lang={lang} />;
    default:         return <ClassicPdf  data={data} lang={lang} />;
  }
}

export async function exportToPdf(
  lastName: string,
  data: CVData,
  templateId: TemplateId = "classic",
  lang: CvLang = "ro",
) {
  const doc = buildPdfDocument(data, templateId, lang);

  const blob = await pdf(doc).toBlob();
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = `cv-${lastName || "export"}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
