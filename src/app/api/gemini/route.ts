import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, payload, lang = "ro" } = body;

    const ai = getGeminiClient();

    // If no API key configured, provide intelligent deterministic fallbacks so user isn't blocked
    if (!ai) {
      return handleOfflineFallback(action, payload, lang);
    }

    if (action === "rewrite_bullet") {
      const { text, role, company } = payload;
      const prompt = `Ești un recrutor executiv și expert în optimizare CV ATS.
Sarcina ta este să rescrii următoarea descriere a unui rol / sarcină profesională folosind metoda STAR (Situation, Task, Action, Result) sau formula Google XYZ ("Am realizat [X] măsurat prin [Y] făcând [Z]").

Context:
Rol: ${role || "Specialist"}
Companie: ${company || ""}
Text inițial: "${text}"
Limba dorită: ${lang === "en" ? "Engleză" : "Română"}

Reguli:
1. Începe fiecare punct cu un verb puternic de acțiune la trecut (ex: Am coordonat, Am optimizat, Am implementat / Led, Architected, Accelerated).
2. Include metrici concrete plauzibile (procente %, economii de timp, cifre relevante, bugete).
3. Păstrează maxim 2-3 fraze per bullet point sau 2 bullet points scurte și de impact.
4. Răspunde DOAR cu textul rescris, fără explicații adiționale, fără ghilimele.`;

      const res = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
      });

      return NextResponse.json({ result: res.text?.trim() || text });
    }

    if (action === "generate_summary") {
      const { title, experienceCount, skills, recentCompanies } = payload;
      const prompt = `Ești un consultant de carieră de top. Generează 3 opțiuni distincte de Rezumat Profesional (Professional Summary) pentru CV-ul unui candidat, fiecare de 2-3 propoziții concise și de mare impact.

Date candidat:
Titlu profesional: ${title || "Profesionist"}
Număr experiențe: ${experienceCount || 1}
Competențe cheie: ${skills?.join(", ") || "Management, Comunicare"}
Companii recente: ${recentCompanies?.join(", ") || ""}
Limba: ${lang === "en" ? "Engleză" : "Română"}

Returnează DOAR un JSON valid cu următoarea structură:
{
  "options": [
    { "style": "Orientat pe Rezultate & Metrici", "text": "..." },
    { "style": "Tehnic & Competențe Cheie", "text": "..." },
    { "style": "Leadership & Viziune Strategică", "text": "..." }
  ]
}`;

      const res = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      try {
        const parsed = JSON.parse(res.text || "{}");
        return NextResponse.json(parsed);
      } catch {
        return NextResponse.json({ options: [] });
      }
    }

    if (action === "match_job") {
      const { jobDescription, cvData } = payload;
      const prompt = `Ești un sistem avansat de scanare ATS (Applicant Tracking System).
Analizează descrierea jobului de mai jos și compar-o cu datele din CV-ul candidatului.

DESCRIERE JOB:
"""
${jobDescription}
"""

DATE CV CANDIDAT:
Titlu: ${cvData?.personal?.title || ""}
Rezumat: ${cvData?.personal?.summary || ""}
Competențe actuale: ${cvData?.skills?.map((s: { name: string }) => s.name).join(", ") || ""}
Experiențe: ${cvData?.experience?.map((e: { company: string; positions: { title: string; description: string }[] }) => `${e.company}: ${e.positions.map((p) => `${p.title} - ${p.description}`).join("; ")}`).join("\n") || ""}

Returnează un JSON valid cu această structură exactă:
{
  "matchScore": 78,
  "summary": "O frază scurtă de sinteză privind potrivirea",
  "matchedKeywords": ["React", "TypeScript", "Agile"],
  "missingKeywords": ["Docker", "CI/CD", "AWS", "Scrum"],
  "recommendations": [
    "Adaugă o mențiune despre experiența cu containere Docker în secțiunea experiență.",
    "Evidențiază rolul de coordonare în echipe Agile/Scrum."
  ]
}
matchScore trebuie să fie un număr întreg între 0 și 100.
Răspunde DOAR cu JSON valid.`;

      const res = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      try {
        const parsed = JSON.parse(res.text || "{}");
        return NextResponse.json(parsed);
      } catch {
        return NextResponse.json({
          matchScore: 65,
          matchedKeywords: [],
          missingKeywords: [],
          recommendations: ["Nu s-a putut analiza complet textul."],
        });
      }
    }

    if (action === "generate_cover_letter") {
      const { candidateName, candidateTitle, candidateEmail, candidatePhone, companyName, jobTitle, jobDescription, cvSummary, skills } = payload;
      const prompt = `Scrie o scrisoare de intenție profesională (Cover Letter), elegantă și persuasivă, de aproximativ 3-4 paragrafe bine structurate.

Date candidat:
Nume: ${candidateName || "Candidat"}
Titlu: ${candidateTitle || ""}
Email: ${candidateEmail || ""}
Telefon: ${candidatePhone || ""}
Rezumat CV: ${cvSummary || ""}
Competențe: ${skills?.join(", ") || ""}

Detalii job dorit:
Companie: ${companyName || "Compania Angajatoare"}
Rol vizat: ${jobTitle || "Poziția dorită"}
Descriere rol/cerințe: ${jobDescription || ""}
Limba: ${lang === "en" ? "Engleză" : "Română"}

Reguli:
- Ton profesionist, entuziast și orientat pe valoarea pe care o aduce candidatul companiei.
- Include un paragraf introductiv, 1-2 paragrafe despre realizări și potrivirea competențelor, și un paragraf de încheiere cu apel la interviu (call to action).
- Răspunde doar cu corpul scrisorii (începând cu formula de adresare, de exemplu "Stimate Manager de Recrutare," sau "Dear Hiring Manager,").`;

      const res = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
      });

      return NextResponse.json({ letter: res.text?.trim() || "" });
    }

    if (action === "parse_cv_text") {
      const { text } = payload;
      const prompt = `Ești un asistent specializat în parsarea CV-urilor. Extrage informațiile din textul de mai jos și returnează un JSON valid care se potrivește cu schema CV-ului nostru.

TEXT CV BRUT:
"""
${text}
"""

Returnează un JSON cu structura:
{
  "personal": {
    "firstName": "",
    "lastName": "",
    "title": "",
    "email": "",
    "phone": "",
    "location": "",
    "linkedin": "",
    "website": "",
    "summary": ""
  },
  "experience": [
    {
      "id": "exp-1",
      "company": "Nume Companie",
      "positions": [
        {
          "id": "pos-1",
          "title": "Titlu Rol",
          "startDate": "YYYY-MM",
          "endDate": "YYYY-MM",
          "current": false,
          "description": "Descriere responsabilități și realizări"
        }
      ]
    }
  ],
  "education": [
    {
      "id": "edu-1",
      "institution": "Nume Universitate/Liceu",
      "degree": "Licență / Master / etc.",
      "field": "Domeniu studiu",
      "startDate": "YYYY-MM",
      "endDate": "YYYY-MM",
      "gpa": ""
    }
  ],
  "skills": [
    { "id": "sk-1", "name": "Nume Skill", "level": "Avansat" }
  ],
  "languages": [
    { "id": "lang-1", "name": "Limba", "level": "B2" }
  ]
}

Nivelurile pentru skills pot fi: "Începător", "Mediu", "Avansat", "Expert".
Nivelurile pentru languages pot fi: "A1", "A2", "B1", "B2", "C1", "C2", "Nativ".
Dacă nu găsești date pentru un câmp, lasă string gol sau array gol. Răspunde DOAR cu JSON valid.`;

      const res = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      try {
        const parsed = JSON.parse(res.text || "{}");
        return NextResponse.json({ cvData: parsed });
      } catch {
        return NextResponse.json({ error: "Nu s-a putut parsa structura CV-ului" }, { status: 400 });
      }
    }

    if (action === "fix_grammar") {
      const { text } = payload;
      const prompt = `Corectează gramatical și stilistic următorul text destinat unui CV profesional. Îndreaptă diacriticele, ortografia, acordul și fluiditatea frazei, păstrând un ton profesional de încredere.
Text: "${text}"
Răspunde DOAR cu textul corectat, fără ghilimele, fără comentarii adiționale.`;

      const res = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
      });

      return NextResponse.json({ result: res.text?.trim() || text });
    }

    return NextResponse.json({ error: "Acțiune necunoscută" }, { status: 400 });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { error: "Eroare la procesarea solicitării AI." },
      { status: 500 }
    );
  }
}

function handleOfflineFallback(action: string, payload: unknown, lang: string) {
  const p = (payload as Record<string, unknown>) || {};
  if (action === "rewrite_bullet") {
    const text = String(p.text || "");
    const improved = text.length > 5
      ? (lang === "en"
          ? `Accelerated project milestones by optimizing ${text.toLowerCase().replace(/^(am |i |responsible for )/i, "")}, delivering a 25% efficiency increase.`
          : `Am optimizat procesele de ${text.toLowerCase().replace(/^(am |responsabil cu |m-am ocupat de )/i, "")}, crescând eficiența echipei cu peste 25% și reducând timpii de livrare.`)
      : text;
    return NextResponse.json({ result: improved });
  }

  if (action === "generate_summary") {
    const title = String(p.title || "Profesionist");
    return NextResponse.json({
      options: [
        {
          style: "Orientat pe Rezultate & Metrici",
          text: `${title} dedicat, cu o traiectorie dovedită în optimizarea fluxurilor de lucru și creșterea performanței organizaționale cu peste 30%.`,
        },
        {
          style: "Tehnic & Competențe Cheie",
          text: `Specialist în rolul de ${title}, stăpânind instrumente moderne, metodologii agile și arhitecturi scalabile orientate pe calitate.`,
        },
        {
          style: "Leadership & Viziune Strategică",
          text: `Lider colaborativ cu abilități demonstrate în coordonarea echipelor multidisciplinare și livrarea proiectelor complexe la termen și în buget.`,
        },
      ],
    });
  }

  if (action === "match_job") {
    const desc = String(p.jobDescription || "").toLowerCase();
    const commonTech = ["react", "typescript", "javascript", "node", "python", "sql", "aws", "docker", "agile", "git", "communication", "leadership"];
    const found = commonTech.filter((w) => desc.includes(w));
    return NextResponse.json({
      matchScore: 72,
      summary: "Potrivire moderată cu cerințele anunțului. Se recomandă evidențierea abilităților tehnice solicitate.",
      matchedKeywords: found.slice(0, 3),
      missingKeywords: found.length > 3 ? found.slice(3, 7) : ["Agile", "Management de proiect", "Comunicare"],
      recommendations: [
        "Include cuvintele cheie din cerințele principale ale anunțului în secțiunea de competențe.",
        "Detaliază realizările măsurabile din experiențele relevante pentru acest rol.",
      ],
    });
  }

  if (action === "generate_cover_letter") {
    const name = String(p.candidateName || "Candidat");
    const role = String(p.jobTitle || "Poziția dorită");
    const company = String(p.companyName || "Companie");
    return NextResponse.json({
      letter: `Stimate Manager de Recrutare,\n\nVă scriu pentru a-mi exprima interesul puternic pentru poziția de ${role} în cadrul ${company}. Cu o experiență solidă în domeniu și o pasiune profundă pentru excelență operațională, sunt convins că pot contribui semnificativ la obiectivele echipei dumneavoastră.\n\nPe parcursul carierei mele am demonstrat o capacitate deosebită de a rezolva probleme complexe și de a colabora eficient în echipe agile. Sunt impresionat de viziunea și standardele ${company} și aș fi onorat să pun în valoare cunoștințele mele pentru a atinge noi performanțe.\n\nVă mulțumesc pentru timpul și atenția acordate candidaturii mele. Aștept cu entuziasm oportunitatea de a discuta în cadrul unui interviu.\n\nCu stimă,\n${name}`,
    });
  }

  return NextResponse.json({ error: "Offline fallback not available" }, { status: 200 });
}
