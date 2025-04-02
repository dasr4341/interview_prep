import mongoose, { Document, Schema } from 'mongoose';

import { CollectionType } from '../../enums/health-data.enum.js';

interface Heart {
  time: Date;
  value: Number;
}

export interface HeartModel extends Heart, Document {}

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

export async function heartModelGenerator(userId: string) {
  return mongoose.model<HeartModel>(`${userId}/${CollectionType.HEART}`, schema);
}
