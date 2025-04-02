import type { CodeFlowType } from "../enums/codeFlowType.js";

export interface IIndeed {
  source: CodeFlowType;
  jobLink: string | null;
  jobTitle: string | null;
  rawJobTitle: string | null;
  companyName: string | null;
  jobLocation: string | null;
}

export interface IIndeedLastRecordData {
  recordId: string | null;
  currJobTitle: string | null;
  currCompanyName: string | null;
  status: boolean;
  prevJobTitle: string | null;
  prevCompanyName: string | null;
}

export interface IScrapingFailure {
  searchJobTitle: string;
}
export interface IScrapedIndeedJobs {
  lastRecordStatus: IIndeedLastRecordData | null;
  indeedJobData: IIndeed[];
  searchJobTitle: string;
}
