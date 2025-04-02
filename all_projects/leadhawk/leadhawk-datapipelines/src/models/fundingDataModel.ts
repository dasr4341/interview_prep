import { type Document, Schema, model } from "mongoose";
import { linkedInSchema } from "./linkedInDataModel.js";

interface IDraftFunding {
  source: string;
  formDsCompany: string;
  investmentType: string;
  issuerLink: string;
  fundingRaised: number;
  _class: string;
  formDs: {
    companyName: string;
    investmentType: string;
    issuerLink: string;
    fundingRaised: string;
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
  companyName: string;
  industry: string;
  companyWebsite: string;
  companySize: string;
  companyEmployeeCount: number;
  specialties: string;
  companyLinkedIn: string;
  googleSearchCompany: string;
  confidenceRatio: number;
  transferred: boolean;
  deleted: boolean;
  createdDate: Date;
  lastModifiedDate: Date;
  sourceLink: string;
  companyHQ: string;
  companyCity: string;
  scrappedCompanyHQ: string;
  country: string;
}

export interface IDraftFundingModel extends IDraftFunding, Document {}

const fundingDataSchema = new Schema(
  {
    autoScrape: { type: Boolean },
    scraped: { type: Boolean },
    source: { type: String, trim: true, required: true },
    formDsCompany: { type: String, trim: true },
    investmentType: { type: String, trim: true },
    issuerLink: { type: String, trim: true },
    sourceLink: { type: String, trim: true },
    fundingRaised: { type: Number },
    formDs: {
      companyName: { type: String, trim: true },
      investmentType: { type: String, trim: true },
      issuerLink: { type: String, trim: true },
      fundingRaised: { type: Number },
    },
    linkedIn: linkedInSchema,
    ...linkedInSchema.obj,
    confidenceRatio: { type: Number },
    transferred: { type: Boolean },
    deleted: { type: Boolean },
  },
  {
    timestamps: {
      createdAt: "createdDate",
      updatedAt: "lastModifiedDate",
    },
  }
);

export const FundingDataModel = model<IDraftFundingModel>(
  "draftNewFunding",
  fundingDataSchema,
  "DraftNewFunding"
);
