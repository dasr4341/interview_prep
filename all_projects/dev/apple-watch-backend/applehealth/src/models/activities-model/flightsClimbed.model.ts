import mongoose, { Document, Schema } from 'mongoose';

import { CollectionType } from '../../enums/health-data.enum.js';

interface FlightsClimbed {
  time: Date;
  value: Number;
}

export interface FlightsClimbedModel extends FlightsClimbed, Document {}

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

export async function flightsClimbedModelGenerator(userId: string) {
  return mongoose.model<FlightsClimbedModel>(`${userId}/${CollectionType.FLIGHTS_CLIMBED}`, schema);
}
