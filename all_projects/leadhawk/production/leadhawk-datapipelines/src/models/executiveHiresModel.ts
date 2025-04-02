import { type Document, Schema, model } from "mongoose";
import { linkedInSchema } from "./linkedInDataModel.js";

interface IDraftHires {
  scraped: boolean;
  source: string;
  companyName: string;
  firstName: string;
  lastName: string;
  sourceLink: string;
  position: string;
  confidenceRatio: number;
  transferred: boolean;
  newHires: {
    companyName: string;
    firstName: string;
    lastName: string;
    about: string;
    description: string;
    userProfileUrl: string;
    position: string;
    jobPosterName: string;
    jobStarterName: string;
  };
  linkedIn: {
    companyName: string;
    industry: string;
    companyWebsite: string;
    companySize: string;
    companyEmployeeCount: number;
    companyHQ: string;
    companyCity: string;
    scrappedCompanyHQ: string;
    country: string;
    specialties: string;
    companyLinkedIn: string;
    googleSearchCompany: string;
  };
  industry: string;
  companyWebsite: string;
  companySize: string;
  companyEmployeeCount: number;
  companyHQ: string;
  companyCity: string;
  scrappedCompanyHQ: string;
  country: string;
  specialties: string;
  companyLinkedIn: string;
  googleSearchCompany: string;
  lastModifiedDate: Date;
}

export interface IDraftHiresModel extends IDraftHires, Document {}

const executiveHiresSchema = new Schema(
  {
    autoScrape: { type: Boolean },
    scraped: { type: Boolean },
    source: { type: String, trim: true, required: true },
    companyName: { type: String, trim: true },
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    sourceLink: { type: String, trim: true },
    position: { type: String, trim: true },
    confidenceRatio: { type: Number },
    transferred: { type: Boolean },
    _class: { type: String, trim: true },
    newHires: {
      companyName: { type: String, trim: true },
      firstName: { type: String, trim: true },
      lastName: { type: String, trim: true },
      about: { type: String, trim: true },
      description: { type: String, trim: true },
      userProfileUrl: { type: String, trim: true },
      position: { type: String, trim: true },
      jobPosterName: { type: String, trim: true },
      jobStarterName: { type: String, trim: true },
      searchJobTitle: { type: String, trim: true },
    },
    linkedIn: linkedInSchema,
    ...linkedInSchema.obj,
  },
  {
    timestamps: {
      createdAt: "createdDate",
      updatedAt: "lastModifiedDate",
    },
  }
);

export const ExecutiveHiresModel = model<IDraftHiresModel>(
  "draftExecutiveHires",
  executiveHiresSchema,
  "DraftExecutiveHires"
);
