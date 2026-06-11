export interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  website?: string;
  linkedin?: string;
  summary: string;
  /** Square profile photo as a data URL (image/jpeg), or empty */
  photo?: string;
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

export interface CVData {
  personal: PersonalInfo;
  experience: WorkExperience[];
  education: Education[];
  skills: Skill[];
  languages: Language[];
  drivingLicenses: DrivingLicense[];
}

export const defaultCV: CVData = {
  personal: {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    linkedin: "",
    summary: "",
  },
  experience: [],
  education: [],
  skills: [],
  languages: [],
  drivingLicenses: [],
};
