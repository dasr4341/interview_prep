import mongoose, { Document, Schema } from 'mongoose';

import { CollectionType } from '../../enums/health-data.enum.js';

interface Location {
  time: Date;
  value: { lat: number; long: string };
}

export interface LocationModel extends Location, Document {}

const schema: Schema = new Schema(
  {
    time: { type: Date, required: true },
    value: {
      lat: { type: Number, required: true },
      long: { type: Number, required: true },
    },
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

export async function locationModelGenerator(userId: string) {
  return mongoose.model<LocationModel>(`${userId}/${CollectionType.LOCATION}`, schema);
}
