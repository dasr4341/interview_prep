import mongoose, { Document, Schema } from 'mongoose';

import { CollectionType } from '../../enums/health-data.enum.js';

interface Ecg {
  ecgStartDate: Date;
  ecgEndDate: Date;
  ecgAvgHeartRate: string;
  ecgClassification: string;
  ecgSamplingFrequency: string;
  uuid: string;
  measurements: { time: number; volt: number }[];
}

export interface EcgModel extends Ecg, Document {}

const schema: Schema = new Schema(
  {
    ecgStartDate: { type: Date, required: true },
    ecgEndDate: { type: Date, required: true },
    ecgAvgHeartRate: { type: String, required: true },
    ecgClassification: { type: String, required: true },
    ecgSamplingFrequency: { type: String, required: true },
    uuid: { type: String, required: true, unique: true },
    measurements: [
      {
        time: { type: Number, required: true },
        volt: { type: Number, required: true },
      },
    ],
  },
  {
    autoCreate: false,
    timestamps: true,
    versionKey: false,
  }
);

export async function ecgModelGenerator(userId: string) {
  return mongoose.model<EcgModel>(`${userId}/${CollectionType.ECG}`, schema);
}
