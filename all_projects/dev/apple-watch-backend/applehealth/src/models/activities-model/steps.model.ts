import mongoose, { Document, Schema } from 'mongoose';

import { CollectionType } from '../../enums/health-data.enum.js';

interface Steps {
  time: Date;
  value: Number;
}

export interface StepsModel extends Steps, Document {}

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

export async function stepsModelGenerator(userId: string) {
  return mongoose.model<StepsModel>(`${userId}/${CollectionType.STEPS}`, schema);
}
