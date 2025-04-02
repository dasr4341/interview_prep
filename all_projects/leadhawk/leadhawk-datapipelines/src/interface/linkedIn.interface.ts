import type { IGoogleSearch } from "./googleSearch.interface.js";

export interface ILinkedInData {
  companyName: string | null | undefined;
  companyLinkedIn: string | null | undefined;
  industry: string | null | undefined;
  companyWebsite: string | null | undefined;
  companySize: string | null | undefined;
  companyEmployeeCount: number | null | undefined;
  specialties: string | null | undefined;
  companyHQ: string | null | undefined; 
  scrappedCompanyHQ: string | null | undefined;
  companyCity: string | null | undefined;
  country: string | null | undefined; 
}

export interface IScrapedCompanyData {
  other: Omit<IGoogleSearch, "companyName" | "linkedInUrl">;
  linkedData: ILinkedInData | null;
}
