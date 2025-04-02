import mongoose, { Document, Schema } from 'mongoose';

import { CollectionType } from '../../enums/health-data.enum.js';

interface WalkingHeartRateAverage {
  time: Date;
  value: Number;
}

export interface WalkingHeartRateAverageModel extends WalkingHeartRateAverage, Document {}

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

export async function walkingHeartRateAverageModelGenerator(userId: string) {
  return mongoose.model<WalkingHeartRateAverageModel>(`${userId}/${CollectionType.WALKING_HEART_RATE_AVERAGE}`, schema);
}
