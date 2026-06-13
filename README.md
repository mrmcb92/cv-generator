# Generator CV

A free, installable CV / résumé builder that runs entirely in your browser. Fill in your details, pick a template and a theme, see a live A4 preview, and export to **PDF, Word or HTML** — with full support for Romanian diacritics. No account, no server, no tracking: your data never leaves your device.

**🔗 Live app: [cv-generator-eta-three.vercel.app](https://cv-generator-eta-three.vercel.app)**

> The application interface is in Romanian, while the generated CV can be exported in **Romanian or English**.

---

## ✨ Features

- **4 templates** — Classic, Modern, Minimal and Creative, each rendered live and exported pixel-for-pixel.
- **4 app themes** — Light, Dark, Violet and Warm.
- **Rich CV sections:**
  - Personal info with an optional **profile photo** (auto-cropped to a square).
  - **Work experience** with multiple positions/roles per company.
  - Education, skills, languages and **driving licence categories** (with the year obtained).
  - **Custom sections** (certifications, projects, volunteering, hobbies…).
- **Export anywhere:**
  - **PDF** — generated programmatically with `@react-pdf/renderer`, with bundled Roboto fonts so Romanian characters (ș, ț, ă, î, â) always render correctly.
  - **Word** (`.docx`) and **HTML** (self-contained, re-importable).
- **Import & continue editing** — re-import a previously exported `.html` or a saved `.cv.json` file.
- **Multiple CV profiles** — keep several CVs (e.g. one per job type) and switch between them.
- **Bilingual output (RO / EN)** — section titles, month names and "Present/Prezent" follow the chosen CV language.
- **Live A4 preview** with a page-break guide so you can see whether everything fits on one page.
- **Auto-save** to `localStorage` (debounced) — your work is restored when you return.
- **Installable PWA** — add it to your home screen / desktop and use it **offline**.

## 🔒 Privacy

The app is 100% client-side. There is no backend and no database — everything you type lives only in your browser's `localStorage`. Exports are generated locally and downloaded directly; nothing is uploaded anywhere.

## 🛠️ Tech stack

- [Next.js 16](https://nextjs.org) (App Router, Turbopack) + [React 19](https://react.dev)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [@react-pdf/renderer](https://react-pdf.org/) — PDF generation
- [docx](https://docx.js.org/) — Word export
- [motion](https://motion.dev/) — animations
- [@phosphor-icons/react](https://phosphoricons.com/) — icons
- PWA: web manifest + service worker (offline-first)

## 🚀 Getting started

```bash
npm install
npm run dev
```

Then open **[http://localhost:4321](http://localhost:4321)** in your browser.

Other scripts:

```bash
npm run build   # production build
npm run start   # serve the production build
npm run lint    # run ESLint
```

## 📦 Deployment

The app is deployed on [Vercel](https://vercel.com). Every push to `main` triggers an automatic redeploy. Because the app is fully static and client-side, it can be hosted on any static host.

---

# 🇷🇴 Generator CV (Română)

Un generator de CV-uri **gratuit și instalabil**, care rulează complet în browser. Completezi datele, alegi un template și o temă, vezi previzualizarea A4 în timp real și exporți în **PDF, Word sau HTML** — cu suport complet pentru diacriticele românești. Fără cont, fără server, fără urmărire: datele tale nu părăsesc dispozitivul.

**🔗 Aplicația online: [cv-generator-eta-three.vercel.app](https://cv-generator-eta-three.vercel.app)**

## ✨ Funcționalități

- **4 template-uri** — Classic, Modern, Minimal și Creative, fiecare previzualizat în timp real și exportat identic.
- **4 teme** pentru aplicație — Light, Dark, Violet și Warm.
- **Secțiuni complete de CV:**
  - Informații personale cu **fotografie de profil** opțională (decupată automat pătrat).
  - **Experiență profesională** cu mai multe funcții/roluri în cadrul aceleiași companii.
  - Educație, competențe, limbi străine și **categorii de permis de conducere** (cu anul obținerii).
  - **Secțiuni personalizate** (certificări, proiecte, voluntariat, hobby-uri…).
- **Export multiplu:**
  - **PDF** — generat programatic cu `@react-pdf/renderer`, cu fonturi Roboto incluse, astfel încât diacriticele (ș, ț, ă, î, â) apar corect mereu.
  - **Word** (`.docx`) și **HTML** (autonom, reimportabil).
- **Import și editare ulterioară** — reimportă un fișier `.html` exportat anterior sau un `.cv.json` salvat.
- **Profile multiple de CV** — păstrează mai multe CV-uri și comută între ele.
- **Output bilingv (RO / EN)** — titlurile secțiunilor, lunile și „Prezent" urmează limba aleasă pentru CV.
- **Previzualizare A4** cu ghidaj de sfârșit de pagină, ca să vezi dacă totul încape pe o pagină.
- **Salvare automată** în `localStorage` — munca ta este restaurată când revii.
- **Aplicație instalabilă (PWA)** — o adaugi pe ecranul principal / desktop și funcționează **offline**.

## 🔒 Confidențialitate

Aplicația rulează 100% în browser. Nu există server sau bază de date — tot ce scrii rămâne doar în `localStorage`-ul browserului tău. Exporturile sunt generate local și descărcate direct; nimic nu se încarcă nicăieri.

## 🚀 Pornire locală

```bash
npm install
npm run dev
```

Apoi deschide **[http://localhost:4321](http://localhost:4321)** în browser.
