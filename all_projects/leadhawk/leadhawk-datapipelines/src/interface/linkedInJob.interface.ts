import type { CodeFlowType } from "../enums/codeFlowType.js";

export interface ILinkedInJobPostData {
  source: CodeFlowType;
  companyName: string | null;
  jobLink: string | null;
  jobTitle: string | null;
  rawJobTitle: string | null;
  companyLinkedIn: string | null;
  jobLocation: string | null;
}
export type ILinkedInJobPostScrapedData = Omit<ILinkedInJobPostData, "source">;
