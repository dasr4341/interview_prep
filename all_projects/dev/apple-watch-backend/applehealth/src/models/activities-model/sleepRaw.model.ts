import mongoose, { Document, Schema } from 'mongoose';

import { CollectionType } from '../../enums/health-data.enum.js';

interface SleepRaw {
  sleepValue: Number;
  endDate: Date;
  startDate: Date;
}

export interface SleepRawModel extends SleepRaw, Document {}

const schema: Schema = new Schema(
  {
    sleepValue: { type: Number, required: true },
    endDate: { type: Date, required: true },
    startDate: { type: Date, required: true },
  },
  {
    autoCreate: false,
    timestamps: true,
    versionKey: false,
  }
);

export async function sleepRawModelGenerator(userId: string) {
  return mongoose.model<SleepRawModel>(`${userId}/${CollectionType.SLEEP_RAW}`, schema);
}
