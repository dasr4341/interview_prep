import { type Document, Schema, model } from 'mongoose';

interface IHiresLive {
  dataEntryOperatorId: string | null;
  firstName: string;
  lastName: string;
  position: string;
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

export interface IHiresLiveModel extends IHiresLive, Document {}

const schema = new Schema(
  {
    dataEntryOperatorId: { type: Schema.ObjectId },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    position: { type: String, required: true },
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
      createdAt: 'createdDate',
      updatedAt: 'lastModifiedDate',
    },
  }
);

export const ExecutiveHiresLiveModel = model<IHiresLiveModel>('NewExecutiveHires', schema, 'NewExecutiveHires');

