import type { CodeFlowType } from "../enums/codeFlowType.js";

export interface INewHires {
  source: CodeFlowType;
  name: string | null;
  about: string | null;
  description: string | null;
  userProfileUrl: string | null;
  classificationConfidence?: number;
  classificationDecision?: string;
  error?: string;
  companyName: string | null;
  currentRole?: string;
  jobPosterName?: string;
  jobStarterName?: string;
  searchJobTitle?: string;
  companyLinks: string[] | null;
}

export interface INewHiresScrapedData {
  source: CodeFlowType;
  name: string | null;
  about: string | null;
  description: string | null;
  searchJobTitle: string;
  userProfileUrl: string | null;
  companyLinks: string[] | null;
}
