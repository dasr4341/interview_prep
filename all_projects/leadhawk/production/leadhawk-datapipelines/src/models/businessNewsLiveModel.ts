import { type Document, Schema, model } from 'mongoose';

interface INewsLive {
  dataEntryOperatorId: string | null;
  trigger: string;
  triggerArticle: string;
  companyName: string;
  companyHQ?: string;
  companyCity?: string;
  industry?: string;
  companyEmployeeCount?: number;
  companyLinkedIn: string;
  companyWebsite?: string;
  createdDate: Date;
  lastModifiedDate: Date;
  publishedDate: Date
}

export interface INewsLiveModel extends INewsLive, Document {}

const schema = new Schema(
  {
    dataEntryOperatorId: { type: Schema.ObjectId },
    trigger: { type: String, required: true },
    triggerArticle: { type: String, required: true },
    companyName: { type: String, required: true },
    companyHQ: { type: String }, // opt
    companyCity: { type: String }, // opt
    industry: { type: String }, // opt
    companyEmployeeCount: { type: Number }, // opt
    companyLinkedIn: { type: String, required: true },
    companyWebsite: { type: String }, // opt
    publishedDate: { type: Date }
  },
  {
    timestamps: {
      createdAt: 'createdDate',
      updatedAt: 'lastModifiedDate',
    },
  }
);

export const NewsLiveModel = model<INewsLiveModel>('GeneralBusinessNews', schema, 'GeneralBusinessNews');

