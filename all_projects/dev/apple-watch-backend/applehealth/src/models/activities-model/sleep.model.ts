import mongoose, { Document, Schema } from 'mongoose';

import { CollectionType } from '../../enums/health-data.enum.js';

interface Sleep {
  time: Date;
  value: {
    inBed: Number;
    asleepUnspecified: Number;
    awake: Number;
    asleepCore: Number;
    asleepDeep: Number;
    asleepREM: Number;
  };
}

export interface SleepModel extends Sleep, Document {}

const schema: Schema = new Schema(
  {
    time: { type: Date, required: true },
    value: {
      inBed: { type: Number, required: true },
      asleepUnspecified: { type: Number, required: true },
      awake: { type: Number, required: true },
      asleepCore: { type: Number, required: true },
      asleepDeep: { type: Number, required: true },
      asleepREM: { type: Number, required: true },
    },
  },
  {
    autoCreate: false,
    timestamps: true,
    versionKey: false,
  }
);

export async function sleepModelGenerator(userId: string) {
  return mongoose.model<SleepModel>(`${userId}/${CollectionType.SLEEP}`, schema);
}
