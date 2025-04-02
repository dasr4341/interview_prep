import mongoose, { Document, Schema } from 'mongoose';

import { CollectionType } from '../../enums/health-data.enum.js';

interface CyclingDistance {
  time: Date;
  value: Number;
}

export interface CyclingDistanceModel extends CyclingDistance, Document {}

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

export async function cyclingDistanceModelGenerator(userId: string) {
  return mongoose.model<CyclingDistanceModel>(`${userId}/${CollectionType.CYCLING_DISTANCE}`, schema);
}
