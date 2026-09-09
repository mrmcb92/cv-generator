export interface PersonalInfo {
  firstName: string;
  lastName: string;
  /** Titlu profesional (ex: "Software Engineer", "Designer") */
  title: string;
  email: string;
  phone: string;
  location: string;
  website?: string;
  linkedin?: string;
  summary: string;
  /** Square profile photo as a data URL (image/jpeg), or empty */
  photo?: string;
  /** Toggle visibility of photo on CV (useful for US/UK markets) */
  showPhoto?: boolean;
}

export interface WorkPosition {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  positions: WorkPosition[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa?: string;
}

export interface Skill {
  id: string;
  name: string;
  level: "Începător" | "Mediu" | "Avansat" | "Expert";
}

export interface Language {
  id: string;
  name: string;
  level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2" | "Nativ";
}

export const DRIVING_CATEGORIES = [
  "AM", "A1", "A2", "A", "B1", "B", "BE", "C1", "C1E", "C", "CE", "D1", "D1E", "D", "DE", "Tr", "Tb", "Tv",
] as const;

export type DrivingCategory = (typeof DRIVING_CATEGORIES)[number];

export interface DrivingLicense {
  id: string;
  category: DrivingCategory;
  year: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  role?: string;
  link?: string;
  github?: string;
  startDate?: string;
  endDate?: string;
  description: string;
  technologies?: string[];
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  url?: string;
}

export interface CustomItem {
  id: string;
  name: string;
  subtitle: string;
  date: string;
  description: string;
}

/** User-defined CV section (certifications, projects, volunteering...) */
export interface CustomSection {
  id: string;
  title: string;
  items: CustomItem[];
}

export type CvDensity = "compact" | "normal" | "spacious";

export interface CoverLetterData {
  recipientName: string;
  recipientTitle: string;
  companyName: string;
  jobTitle: string;
  city: string;
  date: string;
  letterBody: string;
}

export interface CVData {
  personal: PersonalInfo;
  experience: WorkExperience[];
  education: Education[];
  skills: Skill[];
  languages: Language[];
  drivingLicenses: DrivingLicense[];
  projects?: ProjectItem[];
  certifications?: CertificationItem[];
  customSections: CustomSection[];
  sectionOrder?: string[];
  density?: CvDensity;
}

export const DEFAULT_SECTION_ORDER = [
  "experience",
  "education",
  "projects",
  "skills",
  "certifications",
  "languages",
  "drivingLicenses",
  "customSections",
];

export const defaultCV: CVData = {
  personal: {
    firstName: "",
    lastName: "",
    title: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    linkedin: "",
    summary: "",
    showPhoto: true,
  },
  experience: [],
  education: [],
  skills: [],
  languages: [],
  drivingLicenses: [],
  projects: [],
  certifications: [],
  customSections: [],
  sectionOrder: DEFAULT_SECTION_ORDER,
  density: "normal",
};

