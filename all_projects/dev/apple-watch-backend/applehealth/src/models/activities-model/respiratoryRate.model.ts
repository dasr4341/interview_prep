import mongoose, { Document, Schema } from 'mongoose';

import { CollectionType } from '../../enums/health-data.enum.js';

interface RespiratoryRate {
  time: Date;
  value: Number;
}

export interface RespiratoryRateModel extends RespiratoryRate, Document {}

const schema: Schema = new Schema(
  {
    time: { type: Date, required: true },
    value: { type: Number, required: true },
  },
  {
    timeseries: {
      timeField: 'time',
      metaField: 'value',
      granularity: 'minutes',
    },
    autoCreate: false,
    timestamps: true,
    versionKey: false,
  }
);

export async function respiratoryRateModelGenerator(userId: string) {
  return mongoose.model<RespiratoryRateModel>(`${userId}/${CollectionType.RESPIRATORY_RATE}`, schema);
}
