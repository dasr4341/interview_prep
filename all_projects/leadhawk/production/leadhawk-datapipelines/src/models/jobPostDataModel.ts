import { type Document, Schema, model } from "mongoose";
import { linkedInSchema } from "./linkedInDataModel.js";

interface IDraftJobs {
  source: string;
  jobLink: string;
  jobTitle: string;
  rawJobTitle: string;
  jobPostRawData: {
    jobLink: string;
    jobTitle: string;
    companyName: string;
    jobLocation: string;
  };
  linkedIn: {
    companyName: string;
    industry: string;
    companyWebsite: string;
    companySize: string;
    companyEmployeeCount: number;
    companyHQ: string;
    companyCity: string;
    scrappedCompanyHQ:string,
    country: string,
    specialties: string;
    companyLinkedIn: string;
    googleSearchCompany: string;
  };
  companyName: string;
  industry: string;
  companyWebsite: string;
  companySize: string;
  companyEmployeeCount: number;
  companyHQ: string;
  companyCity: string;
  scrappedCompanyHQ:string,
  country: string,
  specialties: string;
  companyLinkedIn: string;
  googleSearchCompany: string;
  confidenceRatio: number;
  transferred: boolean;
  deleted: boolean;
  createdDate: Date;
  lastModifiedDate: Date;
}

export interface IDraftJobsModel extends IDraftJobs, Document {}

const jobPostDataSchema = new Schema(
  {
    autoScrape: { type: Boolean },
    scraped: { type: Boolean },
    source: { type: String, trim: true, required: true },
    jobLocation: { type: String, trim: true },
    jobLink: { type: String, trim: true },
    rawJobTitle: { type: String, trim: true },
    jobTitle: { type: String, trim: true },
    sourceLink: { type: String, trim: true },
    _class: { type: String, trim: true },
    jobPostRawData: {
      companyName: { type: String, trim: true },
      jobLink: { type: String, trim: true },
      jobTitle: { type: String, trim: true },
      jobLocation: { type: String, trim: true },
    },
    linkedIn: linkedInSchema,
    ...linkedInSchema.obj,
    confidenceRatio: { type: Number },
    transferred: { type: Boolean },
  },
  {
    timestamps: {
      createdAt: "createdDate",
      updatedAt: "lastModifiedDate",
    },
  }
);

export const JobPostDataModel = model<IDraftJobsModel>(
  "draftJobPost",
  jobPostDataSchema,
  "DraftJobPost"
);
