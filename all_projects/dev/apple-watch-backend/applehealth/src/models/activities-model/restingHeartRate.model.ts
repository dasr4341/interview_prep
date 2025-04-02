import mongoose, { Document, Schema } from 'mongoose';

import { CollectionType } from '../../enums/health-data.enum.js';

interface RestingHeartRate {
  time: Date;
  value: Number;
}

export interface RestingHeartRateModel extends RestingHeartRate, Document {}

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

export async function restingHeartRateModelGenerator(userId: string) {
  return mongoose.model<RestingHeartRateModel>(`${userId}/${CollectionType.RESTING_HEART_RATE}`, schema);
}
