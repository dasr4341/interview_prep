import mongoose, { Document, Schema } from 'mongoose';

import { CollectionType } from '../../enums/health-data.enum.js';

interface Spo2 {
  time: Date;
  value: Number;
}

export interface Spo2Model extends Spo2, Document {}

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

export async function spo2ModelGenerator(userId: string) {
  return mongoose.model<Spo2Model>(`${userId}/${CollectionType.SPO2}`, schema);
}
