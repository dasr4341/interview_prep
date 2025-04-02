import { type Document, Schema, model } from "mongoose";

interface IFundingLive {
  dataEntryOperatorId: string | null;
  companyName: string;
  companyHQ?: string;
  companyCity?: string;
  industry?: string;
  fundingRaised: number;
  companyEmployeeCount?: number;
  companyLinkedIn: string;
  companyWebsite?: string;
  createdDate: Date;
  lastModifiedDate: Date;
}

export interface IFundingLiveModel extends IFundingLive, Document {}

const schema = new Schema(
  {
    dataEntryOperatorId: { type: Schema.ObjectId },
    companyName: { type: String, required: true },
    companyHQ: { type: String }, // opt
    companyCity: { type: String }, // opt
    industry: { type: String }, // opt
    fundingRaised: { type: Number, required: true },
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

export const FundingLiveModel = model<IFundingLiveModel>(
  "NewFunding",
  schema,
  "NewFunding"
);
