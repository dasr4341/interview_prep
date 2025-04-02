import mongoose, { Document, Schema } from 'mongoose';

import { CollectionType } from '../../enums/health-data.enum.js';

interface AppleStandTime {
  time: Date;
  value: Number;
}

export interface AppleStandTimeModel extends AppleStandTime, Document {}

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

export async function appleStandTimeModelGenerator(userId: string) {
  return mongoose.model<AppleStandTimeModel>(`${userId}/${CollectionType.APPLE_STAND_TIME}`, schema);
}
