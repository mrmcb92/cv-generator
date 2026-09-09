import { CVData } from "@/types/cv";

export interface DemoPreset {
  id: string;
  name: string;
  role: string;
  category: "tech" | "marketing" | "student" | "executive";
  badge: string;
  description: string;
  data: CVData;
}

export const DEMO_PRESETS: DemoPreset[] = [
  {
    id: "software-engineer",
    name: "Alexandru Popescu",
    role: "Senior Full-Stack Developer",
    category: "tech",
    badge: "IT & Tech",
    description: "Profil tehnic axat pe performanță, arhitectură cloud și rezultate măsurabile.",
    data: {
      personal: {
        firstName: "Alexandru",
        lastName: "Popescu",
        title: "Senior Full-Stack Developer",
        email: "alexandru.popescu@techdev.ro",
        phone: "+40 722 345 678",
        location: "București, România (Hibrid)",
        website: "https://alexandru-dev.tech",
        linkedin: "https://linkedin.com/in/alexandru-popescu-dev",
        summary:
          "Dezvoltator Full-Stack cu peste 6 ani de experiență în livrarea de aplicații web scalabile (React, Next.js, Node.js, TypeScript). Am accelerat timpul de răspuns al API-urilor cu 42% și am coordonat echipe agile de 8 ingineri pentru produse cu peste 200.000 de utilizatori activi lunar.",
        showPhoto: true,
      },
      experience: [
        {
          id: "exp-1",
          company: "Fintech Cloud Solutions",
          positions: [
            {
              id: "pos-1",
              title: "Senior Full-Stack Engineer & Tech Lead",
              startDate: "2022-03",
              endDate: "",
              current: true,
              description:
                "• Am arhitecturat și implementat un sistem de plăți în timp real cu microservicii Node.js și PostgreSQL, reducând rata tranzacțiilor eșuate cu 35%.\n• Am coordonat migrarea front-end-ului la Next.js 15 și Server Actions, îmbunătățind Core Web Vitals cu 28 de puncte și scăzând bundle size cu 40%.\n• Am mentorat 4 ingineri juniori și mid, introducând practici de CI/CD automated testing cu acoperire de 85%.",
            },
            {
              id: "pos-2",
              title: "Full-Stack Developer",
              startDate: "2020-01",
              endDate: "2022-02",
              current: false,
              description:
                "• Am proiectat dashboard-ul analitic B2B utilizat de peste 1.200 de clienți corporate.\n• Am integrat GraphQL și Redis caching, scăzând timpul mediu de încărcare a rapoartelor de la 4.2s la 450ms.",
            },
          ],
        },
        {
          id: "exp-2",
          company: "Digital Spark Agency",
          positions: [
            {
              id: "pos-3",
              title: "Frontend Developer",
              startDate: "2018-09",
              endDate: "2019-12",
              current: false,
              description:
                "• Am dezvoltat peste 12 platforme e-commerce responsive în React și Tailwind CSS.\n• Am optimizat accesibilitatea (WCAG AA) și performanța SEO pentru magazine online cu trafic ridicat.",
            },
          ],
        },
      ],
      education: [
        {
          id: "edu-1",
          institution: "Universitatea Politehnica din București",
          degree: "Diplomă de Licență",
          field: "Calculatoare și Tehnologia Informației",
          startDate: "2014-10",
          endDate: "2018-07",
          gpa: "9.60 / 10",
        },
      ],
      projects: [
        {
          id: "proj-1",
          title: "PulseAnalytics — Monitorizare Metrici Cloud",
          role: "Creator & Arhitect",
          link: "https://pulse-analytics-demo.io",
          github: "https://github.com/alexandru/pulse-analytics",
          startDate: "2023-01",
          endDate: "2023-11",
          description:
            "SaaS open-source de monitorizare a metricilor de infrastructură cu alerte în timp real prin WebSocket și grafice interactive D3.",
          technologies: ["TypeScript", "Next.js", "Tailwind", "Docker", "PostgreSQL"],
        },
        {
          id: "proj-2",
          title: "SmartInvoice — Generator Automat de Facturi",
          role: "Full-Stack Developer",
          link: "https://smart-invoice-demo.app",
          startDate: "2022-05",
          endDate: "2022-09",
          description:
            "Aplicație web pentru freelanceri cu export automat în PDF/e-Factura ANAF și reconciliere bancară.",
          technologies: ["React", "Node.js", "Express", "Tailwind CSS"],
        },
      ],
      skills: [
        { id: "sk-1", name: "TypeScript & JavaScript", level: "Expert" },
        { id: "sk-2", name: "React & Next.js", level: "Expert" },
        { id: "sk-3", name: "Node.js & Express", level: "Avansat" },
        { id: "sk-4", name: "PostgreSQL & Prisma", level: "Avansat" },
        { id: "sk-5", name: "Docker & AWS", level: "Mediu" },
        { id: "sk-6", name: "Tailwind CSS & UI Design", level: "Expert" },
        { id: "sk-7", name: "REST & GraphQL APIs", level: "Avansat" },
        { id: "sk-8", name: "Git & CI/CD Pipelines", level: "Avansat" },
      ],
      certifications: [
        {
          id: "cert-1",
          name: "AWS Certified Solutions Architect – Associate",
          issuer: "Amazon Web Services",
          issueDate: "2023-04",
          credentialId: "AWS-PSA-993821",
        },
        {
          id: "cert-2",
          name: "Meta Front-End Developer Professional Certificate",
          issuer: "Meta (Coursera)",
          issueDate: "2021-11",
        },
      ],
      languages: [
        { id: "lang-1", name: "Română", level: "Nativ" },
        { id: "lang-2", name: "Engleză", level: "C1" },
      ],
      drivingLicenses: [{ id: "drv-1", category: "B", year: "2016" }],
      customSections: [],
      sectionOrder: [
        "experience",
        "projects",
        "skills",
        "education",
        "certifications",
        "languages",
        "drivingLicenses",
      ],
      density: "normal",
    },
  },
  {
    id: "marketing-manager",
    name: "Elena Ionescu",
    role: "Senior Growth Marketing Specialist",
    category: "marketing",
    badge: "Marketing & Growth",
    description: "Profil axat pe achiziție, campanii digitale cu ROI ridicat și retenție clienți.",
    data: {
      personal: {
        firstName: "Elena",
        lastName: "Ionescu",
        title: "Senior Growth Marketing Specialist",
        email: "elena.ionescu@marketingpro.ro",
        phone: "+40 733 987 654",
        location: "Cluj-Napoca, România",
        linkedin: "https://linkedin.com/in/elena-ionescu-marketing",
        summary:
          "Specialist Growth Marketing cu peste 5 ani experiență în accelerarea veniturilor pentru produse B2B SaaS și E-commerce. Am administrat bugete anuale de peste 250.000 € cu un ROAS mediu de 4.8x și am crescut baza de utilizatori activi cu 160% de la an la an.",
        showPhoto: true,
      },
      experience: [
        {
          id: "exp-m1",
          company: "GrowthWave Digital",
          positions: [
            {
              id: "pos-m1",
              title: "Head of Performance Marketing",
              startDate: "2021-08",
              endDate: "",
              current: true,
              description:
                "• Am condus strategia de achiziție pe Google Ads, Meta și TikTok, generând o creștere de 145% a veniturilor în primele 12 luni.\n• Am implementat experimente de optimizare a ratei de conversie (CRO) pe landing page-uri, crescând rata de signup de la 2.8% la 5.3%.\n• Am coordonat o echipă de 5 specialiști în conținut, design și copywriting.",
            },
          ],
        },
        {
          id: "exp-m2",
          company: "Retail Brands Hub",
          positions: [
            {
              id: "pos-m2",
              title: "Digital Marketing Specialist",
              startDate: "2019-03",
              endDate: "2021-07",
              current: false,
              description:
                "• Am dezvoltat campanii de email marketing automatizate în Klaviyo cu venituri atribuite de 85.000 €/lună.\n• Am gestionat campaniile de influenceri și parteneriate strategice.",
            },
          ],
        },
      ],
      education: [
        {
          id: "edu-m1",
          institution: "Universitatea Babeș-Bolyai din Cluj-Napoca",
          degree: "Master în Marketing Strategic",
          field: "Științe Economice",
          startDate: "2017-10",
          endDate: "2019-07",
          gpa: "9.85 / 10",
        },
        {
          id: "edu-m2",
          institution: "Universitatea Babeș-Bolyai din Cluj-Napoca",
          degree: "Licență în Comunicare și Relații Publice",
          field: "Științe Politice și ale Comunicării",
          startDate: "2014-10",
          endDate: "2017-07",
        },
      ],
      projects: [
        {
          id: "proj-m1",
          title: "Campanie Rebranding & Lansare SaaS 'OmniTrack'",
          role: "Marketing Strategist",
          startDate: "2023-02",
          endDate: "2023-06",
          description:
            "Campanie omni-channel care a atras 4.500 utilizatori în faza beta și a obținut locul 2 pe ProductHunt of the Day.",
          technologies: ["HubSpot", "Google Analytics 4", "Figma", "Meta Ads"],
        },
      ],
      skills: [
        { id: "sk-m1", name: "Google Ads & Meta Ads", level: "Expert" },
        { id: "sk-m2", name: "Google Analytics 4 & Tag Manager", level: "Expert" },
        { id: "sk-m3", name: "A/B Testing & CRO", level: "Avansat" },
        { id: "sk-m4", name: "SEO & Content Strategy", level: "Avansat" },
        { id: "sk-m5", name: "Klaviyo & Email Automation", level: "Avansat" },
        { id: "sk-m6", name: "Bugetare & Modelare CAC/LTV", level: "Expert" },
      ],
      certifications: [
        {
          id: "cert-m1",
          name: "Google Ads Search & Measurement Certification",
          issuer: "Google Skillshop",
          issueDate: "2023-05",
        },
        {
          id: "cert-m2",
          name: "HubSpot Inbound Marketing Certified",
          issuer: "HubSpot Academy",
          issueDate: "2022-09",
        },
      ],
      languages: [
        { id: "lang-m1", name: "Română", level: "Nativ" },
        { id: "lang-m2", name: "Engleză", level: "C2" },
        { id: "lang-m3", name: "Franceză", level: "B2" },
      ],
      drivingLicenses: [{ id: "drv-m1", category: "B", year: "2018" }],
      customSections: [],
      sectionOrder: [
        "experience",
        "skills",
        "projects",
        "education",
        "certifications",
        "languages",
      ],
      density: "normal",
    },
  },
  {
    id: "student-junior",
    name: "Mihai Radu",
    role: "Junior Software Engineer / Student",
    category: "student",
    badge: "Student & Junior",
    description: "Structură ideală pentru debut de carieră: educație și proiecte personale evidențiate.",
    data: {
      personal: {
        firstName: "Mihai",
        lastName: "Radu",
        title: "Junior Software Engineer",
        email: "mihai.radu@student.edu.ro",
        phone: "+40 744 112 233",
        location: "Iași, România",
        website: "https://github.com/mihairadu-cs",
        linkedin: "https://linkedin.com/in/mihai-radu-junior",
        summary:
          "Student pasionat în anul III la Facultatea de Informatică, cu proiecte practice în React, Python și SQL. Premiat la două hackathoane universitare, caut o oportunitate de internship sau rol entry-level unde să contribui activ la dezvoltarea de software modern.",
        showPhoto: true,
      },
      experience: [
        {
          id: "exp-s1",
          company: "TechTalent Labs",
          positions: [
            {
              id: "pos-s1",
              title: "Software Engineering Intern",
              startDate: "2023-07",
              endDate: "2023-09",
              current: false,
              description:
                "• Am contribuit la dezvoltarea unui modul de raportare intern folosind React și Express.\n• Am scris teste unitare în Jest cu o acoperire de 78% pentru rutele critice de backend.\n• Am participat la daily standup-uri și sesiuni de code review alături de dezvoltatori seniori.",
            },
          ],
        },
      ],
      education: [
        {
          id: "edu-s1",
          institution: "Universitatea „Alexandru Ioan Cuza” din Iași",
          degree: "Licență în Informatică",
          field: "Facultatea de Informatică",
          startDate: "2022-10",
          endDate: "2025-07",
          gpa: "9.45 / 10",
        },
      ],
      projects: [
        {
          id: "proj-s1",
          title: "StudyBuddy — Platformă Colaborativă pentru Studenți",
          role: "Autor Principal",
          github: "https://github.com/mihairadu/study-buddy",
          startDate: "2023-10",
          endDate: "2024-02",
          description:
            "Aplicație web de partajare a notițelor de curs și organizare a sesiunilor de studiu cu autentificare OAuth și căutare rapidă.",
          technologies: ["React", "TypeScript", "Tailwind CSS", "Firebase"],
        },
        {
          id: "proj-s2",
          title: "AlgoVisualizer — Simulator Vizual de Algoritmi de Sortare",
          role: "Dezvoltator",
          link: "https://algoviz-demo.vercel.app",
          startDate: "2023-03",
          endDate: "2023-05",
          description:
            "Instrument educațional interactiv pentru înțelegerea algoritmilor QuickSort, MergeSort și Dijkstra.",
          technologies: ["JavaScript", "HTML5 Canvas", "CSS3"],
        },
      ],
      skills: [
        { id: "sk-s1", name: "JavaScript & TypeScript", level: "Mediu" },
        { id: "sk-s2", name: "React & Next.js", level: "Mediu" },
        { id: "sk-s3", name: "Python & Algoritmi", level: "Avansat" },
        { id: "sk-s4", name: "SQL & Baze de date", level: "Mediu" },
        { id: "sk-s5", name: "Git & GitHub", level: "Avansat" },
        { id: "sk-s6", name: "Structuri de date & OOP", level: "Avansat" },
      ],
      certifications: [
        {
          id: "cert-s1",
          name: "Premiul II — Hackathon Universitar de Inovație Digitală",
          issuer: "UAIC Iași",
          issueDate: "2023-11",
        },
      ],
      languages: [
        { id: "lang-s1", name: "Română", level: "Nativ" },
        { id: "lang-s2", name: "Engleză", level: "B2" },
      ],
      drivingLicenses: [{ id: "drv-s1", category: "B", year: "2022" }],
      customSections: [],
      sectionOrder: [
        "education",
        "projects",
        "skills",
        "experience",
        "certifications",
        "languages",
      ],
      density: "normal",
    },
  },
  {
    id: "operations-director",
    name: "Cristian Dumitrescu",
    role: "Director Operațional / Executive Leader",
    category: "executive",
    badge: "Management & Executive",
    description: "Profil executiv orientat pe strategie, scalare organizațională și guvernanță.",
    data: {
      personal: {
        firstName: "Cristian",
        lastName: "Dumitrescu",
        title: "Director Operațiuni & Transformare Digitală",
        email: "cristian.dumitrescu@executive.ro",
        phone: "+40 721 000 999",
        location: "București, România",
        linkedin: "https://linkedin.com/in/cristian-dumitrescu-exec",
        summary:
          "Lider executiv cu peste 12 ani de experiență în optimizarea operațiunilor comerciale și transformarea digitală a organizațiilor enterprise. Am restructurat procese de business în valoare de 15M € și am coordonat echipe trans-funcționale de peste 60 de persoane.",
        showPhoto: true,
      },
      experience: [
        {
          id: "exp-e1",
          company: "Apex Enterprise Solutions",
          positions: [
            {
              id: "pos-e1",
              title: "Chief Operating Officer (COO)",
              startDate: "2020-04",
              endDate: "",
              current: true,
              description:
                "• Am condus strategia de eficiență operațională, reducând costurile operaționale generale cu 18% fără reduceri de personal.\n• Am supervizat implementarea sistemului integrat ERP/CRM pentru 4 filiale europene.\n• Am crescut scorul de satisfacție a clienților (CSAT) de la 74% la 91% prin digitalizarea suportului.",
            },
          ],
        },
        {
          id: "exp-e2",
          company: "Nexus Logistics Group",
          positions: [
            {
              id: "pos-e2",
              title: "Director Operațional Regional",
              startDate: "2015-06",
              endDate: "2020-03",
              current: false,
              description:
                "• Am gestionat lanțul de aprovizionare și o rețea de depozite de 35.000 mp.\n• Am implementat metodologia Lean Six Sigma, crescând acuratețea livrărilor la 99.4%.",
            },
          ],
        },
      ],
      education: [
        {
          id: "edu-e1",
          institution: "ASE București — Bucharest Business School",
          degree: "Executive MBA",
          field: "Management Strategic & Leadership",
          startDate: "2013-10",
          endDate: "2015-06",
        },
        {
          id: "edu-e2",
          institution: "Academia de Studii Economice din București",
          degree: "Licență în Relații Economice Internaționale",
          field: "Economie",
          startDate: "2007-10",
          endDate: "2010-07",
        },
      ],
      skills: [
        { id: "sk-e1", name: "Management Strategic & Bugetare P&L", level: "Expert" },
        { id: "sk-e2", name: "Transformare Digitală & ERP", level: "Expert" },
        { id: "sk-e3", name: "Negociere Strategică & Stakeholders", level: "Expert" },
        { id: "sk-e4", name: "Lean Six Sigma & Procese", level: "Avansat" },
        { id: "sk-e5", name: "Leadership & Dezvoltare Echipe", level: "Expert" },
      ],
      certifications: [
        {
          id: "cert-e1",
          name: "Lean Six Sigma Black Belt",
          issuer: "International Association for Six Sigma Certification",
          issueDate: "2018-05",
        },
      ],
      languages: [
        { id: "lang-e1", name: "Română", level: "Nativ" },
        { id: "lang-e2", name: "Engleză", level: "C2" },
        { id: "lang-e3", name: "Germană", level: "B1" },
      ],
      drivingLicenses: [{ id: "drv-e1", category: "B", year: "2008" }],
      customSections: [],
      sectionOrder: [
        "experience",
        "education",
        "skills",
        "certifications",
        "languages",
      ],
      density: "normal",
    },
  },
];
