import { type Document, Schema, model } from "mongoose";
import { linkedInSchema } from "./linkedInDataModel.js";

interface IDraftNews {
  trigger: string;
  triggerArticle: string;
  source: string;
  subSource: string;
  publishedDate: Date;
  prnewswire: {
    companyName: string;
    trigger: string;
    triggerArticle: string;
    title: Array<string>;
    link: Array<string>;
    guid: Array<string>;
    pubDate: Array<string>;
    description: Array<string>;
    "prn:industry": Array<string>;
    "prn:subject": Array<string>;
    "dc:subject": Array<string>;
    "dc:contributor": Array<string>;
    "dc:language": Array<string>;
    "dc:publisher": Array<string>;
  };
  businesswire: {
    companyName: string;
    trigger: string;
    triggerArticle: string;
    title: Array<string>;
    link: Array<string>;
    guid: Array<string>;
    pubDate: Array<string>;
    description: Array<string>;
  };
  linkedIn: {
    companyName: string;
    about: string;
    description: string;
    industry: string;
    companyWebsite: string;
    companySize: string;
    companyEmployeeCount: number;
    specialties: string;
    companyLinkedIn: string;
    googleSearchCompany: string;
    companyHQ: string;
    companyCity: string;
    scrappedCompanyHQ:string,
    country: string,
  };
  companyName: string;
  about: string;
  description: string;
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
}

export interface IDraftNewsModel extends IDraftNews, Document {}

const businessNewsSchema = new Schema(
  {
    autoScrape:{ type: Boolean },
    scraped:{ type: Boolean },
    companyName: { type: String, trim: true },
    trigger: { type: String, trim: true },
    triggerArticle: { type: String, trim: true },
    source: { type: String, trim: true },
    subSource: { type: String, trim: true },
    confidenceRatio: { type: Number },
    transferred: { type: Boolean },
    publishedDate: { type: Date },
    prnewswire: {
      companyName: { type: String, trim: true },
      trigger: { type: String, trim: true },
      triggerArticle: { type: String, trim: true },
      title: { type: Array<string> },
      link: { type: Array<string> },
      guid: { type: Array<string> },
      pubDate: { type: Array<string> },
      description: { type: Array<string> },
      "prn:industry": { type: Array<string> },
      "prn:subject": { type: Array<string> },
      "dc:subject": { type: Array<string> },
      "dc:contributor": { type: Array<string> },
      "dc:language": { type: Array<string> },
      "dc:publisher": { type: Array<string> },
    },
    businesswire: {
      companyName: { type: String, trim: true },
      trigger: { type: String, trim: true },
      triggerArticle: { type: String, trim: true },
      title: { type: Array<string> },
      link: { type: Array<string> },
      guid: { type: Array<string> },
      pubDate: { type: Array<string> },
      description: { type: Array<string> },
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

export const businessNewsModel = model<IDraftNewsModel>(
  "draftBusinessNews",
  businessNewsSchema,
  "DraftBusinessNews"
);
