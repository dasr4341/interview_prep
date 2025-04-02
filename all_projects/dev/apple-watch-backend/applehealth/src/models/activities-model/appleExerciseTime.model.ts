import mongoose, { Document, Schema } from 'mongoose';

import { CollectionType } from '../../enums/health-data.enum.js';

interface AppleExerciseTime {
  time: Date;
  value: Number;
}

export interface AppleExerciseTimeModel extends AppleExerciseTime, Document {}

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

export async function appleExerciseTimeModelGenerator(userId: string) {
  return mongoose.model<AppleExerciseTimeModel>(`${userId}/${CollectionType.APPLE_EXERCISE_TIME}`, schema);
}
