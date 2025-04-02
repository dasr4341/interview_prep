import mongoose, { Document, Schema } from 'mongoose';

import { CollectionType } from '../../enums/health-data.enum.js';

interface WalkRunDistance {
  time: Date;
  value: Number;
}

export interface WalkRunDistanceModel extends WalkRunDistance, Document {}

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

export async function walkRunDistanceModelGenerator(userId: string) {
  return mongoose.model<WalkRunDistanceModel>(`${userId}/${CollectionType.WALK_RUN_DUSTANCE}`, schema);
}
