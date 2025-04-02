import { type Document, Schema, model } from "mongoose";

interface IJobsLive {
  dataEntryOperatorId: string | null;
  jobTitle: string;
  jobLink: string;
  companyName: string;
  companyHQ?: string;
  companyCity?: string;
  industry?: string;
  companyEmployeeCount?: number;
  companyLinkedIn: string;
  companyWebsite?: string;
  createdDate: Date;
  lastModifiedDate: Date;
}

export interface IJobsLiveModel extends IJobsLive, Document {}

const schema = new Schema(
  {
    dataEntryOperatorId: { type: Schema.ObjectId },
    jobTitle: { type: String, required: true },
    jobLink: { type: String, required: true },
    companyName: { type: String, required: true },
    companyHQ: { type: String }, // opt
    companyCity: { type: String }, // opt
    industry: { type: String }, // opt
    companyEmployeeCount: { type: Number }, // opt
    companyLinkedIn: { type: String, required: true },
    companyWebsite: { type: String }, // opt
  },
  {
    timestamps: {
      createdAt: "createdDate",
      updatedAt: "lastModifiedDate",
    },
  }
);

export const JobsLiveModel = model<IJobsLiveModel>(
  "JobPostings",
  schema,
  "JobPostings"
);
