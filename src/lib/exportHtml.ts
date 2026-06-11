import { CVData } from "@/types/cv";

// Escapes user-provided text so it can't inject markup into the exported file
function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

import { fmtDate as formatDate } from "@/lib/format";

export function exportToHtml(data: CVData) {
  const { personal, experience, education, skills, languages, drivingLicenses } = data;
  const fullName = `${personal.firstName} ${personal.lastName}`.trim();

  const contacts = [
    personal.email && `<span>✉ ${esc(personal.email)}</span>`,
    personal.phone && `<span>☎ ${esc(personal.phone)}</span>`,
    personal.location && `<span>⌖ ${esc(personal.location)}</span>`,
    personal.website && `<span>🌐 ${esc(personal.website)}</span>`,
    personal.linkedin && `<span>in ${esc(personal.linkedin)}</span>`,
  ]
    .filter(Boolean)
    .join(" &nbsp;|&nbsp; ");

  const expHtml = experience
    .map(
      (e) => `
    <div class="entry">
      ${e.company ? `<strong class="company">${esc(e.company)}</strong>` : ""}
      <div class="positions">
        ${e.positions.map(pos => `
          <div class="position">
            <div class="entry-header">
              <strong>${esc(pos.title)}</strong>
              <span class="date">${formatDate(pos.startDate)} – ${pos.current ? "Prezent" : formatDate(pos.endDate)}</span>
            </div>
            ${pos.description ? `<p>${esc(pos.description)}</p>` : ""}
          </div>`).join("")}
      </div>
    </div>`
    )
    .join("");

  const eduHtml = education
    .map(
      (e) => `
    <div class="entry">
      <div class="entry-header">
        <div>
          <strong>${esc(e.degree)}${e.field ? ` în ${esc(e.field)}` : ""}</strong>
          <span class="muted">${esc(e.institution)}</span>
        </div>
        <span class="date">${formatDate(e.startDate)} – ${formatDate(e.endDate)}</span>
      </div>
    </div>`
    )
    .join("");

  const skillsHtml = skills
    .map((s) => `<div class="skill-item"><span>${esc(s.name)}</span><span class="muted">${esc(s.level)}</span></div>`)
    .join("");

  const langsHtml = languages
    .map((l) => `<div class="skill-item"><span>${esc(l.name)}</span><span class="muted">${esc(l.level)}</span></div>`)
    .join("");

  const licensesHtml = (drivingLicenses ?? [])
    .map((d) => `<span class="license"><strong>Categoria ${esc(d.category)}</strong>${d.year ? ` <span class="muted">· ${esc(d.year)}</span>` : ""}</span>`)
    .join("");

  const html = `<!DOCTYPE html>
<html lang="ro">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>CV – ${esc(fullName)}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 12px; color: #1f2937; background: #f3f4f6; }
    .page { max-width: 210mm; margin: 0 auto; background: white; min-height: 297mm; }
    header { background: #1e293b; color: white; padding: 2rem; display: flex; justify-content: space-between; align-items: center; gap: 1.5rem; }
    .photo { width: 72px; height: 72px; border-radius: 50%; object-fit: cover; flex-shrink: 0; border: 2px solid #475569; }
    header h1 { font-size: 2rem; font-weight: 700; letter-spacing: 0.05em; }
    .contacts { margin-top: 0.75rem; color: #94a3b8; font-size: 11px; display: flex; flex-wrap: wrap; gap: 12px; }
    main { padding: 2rem; }
    section { margin-bottom: 1.5rem; }
    h2 { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #64748b; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; margin-bottom: 12px; }
    .entry { margin-bottom: 1rem; }
    .company { display: block; font-size: 11px; color: #1e293b; margin-bottom: 4px; }
    .positions { padding-left: 10px; border-left: 2px solid #e2e8f0; }
    .position { margin-bottom: 8px; }
    .entry-header { display: flex; justify-content: space-between; align-items: flex-start; }
    .entry-header strong { display: block; font-weight: 600; }
    .muted { color: #9ca3af; }
    .date { font-size: 10px; color: #9ca3af; white-space: nowrap; margin-left: 1rem; }
    p { margin-top: 4px; line-height: 1.6; color: #374151; }
    .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
    .skill-item { display: flex; justify-content: space-between; padding: 2px 0; font-size: 11px; }
    .licenses { display: flex; flex-wrap: wrap; gap: 4px 20px; font-size: 11px; }
    @media print {
      body { background: white; }
      .page { max-width: none; }
    }
  </style>
</head>
<body>
  <div class="page">
    <header>
      <div>
        <h1>${esc(fullName) || "Nume Prenume"}</h1>
        <div class="contacts">${contacts}</div>
      </div>
      ${personal.photo?.startsWith("data:image/") ? `<img class="photo" src="${personal.photo}" alt="" />` : ""}
    </header>
    <main>
      ${personal.summary ? `<section><h2>Profil</h2><p>${esc(personal.summary)}</p></section>` : ""}
      ${experience.length ? `<section><h2>Experiență profesională</h2>${expHtml}</section>` : ""}
      ${education.length ? `<section><h2>Educație</h2>${eduHtml}</section>` : ""}
      ${skills.length || languages.length ? `
      <div class="two-col">
        ${skills.length ? `<section><h2>Competențe</h2>${skillsHtml}</section>` : ""}
        ${languages.length ? `<section><h2>Limbi străine</h2>${langsHtml}</section>` : ""}
      </div>` : ""}
      ${licensesHtml ? `<section><h2>Permis de conducere</h2><div class="licenses">${licensesHtml}</div></section>` : ""}
    </main>
  </div>
</body>
</html>`;

  // "<" is escaped so user text like "</script>" can't break out of the embed
  const embedJson = JSON.stringify({ version: "1", data }).replace(/</g, "\\u003c");
  const htmlWithData = html.replace(
    "</body>",
    `<script type="application/json" id="cv-data">${embedJson}</script>\n</body>`
  );
  const blob = new Blob([htmlWithData], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `cv-${personal.lastName || "export"}.html`;
  a.click();
  URL.revokeObjectURL(url);
}
