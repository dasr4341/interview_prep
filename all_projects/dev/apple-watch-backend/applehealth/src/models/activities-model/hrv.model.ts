import mongoose, { Document, Schema } from 'mongoose';

import { CollectionType } from '../../enums/health-data.enum.js';

interface Hrv {
  time: Date;
  value: Number;
}

export interface HrvModel extends Hrv, Document {}

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

export async function hrvModelGenerator(userId: string) {
  return mongoose.model<HrvModel>(`${userId}/${CollectionType.HRV}`, schema);
}
