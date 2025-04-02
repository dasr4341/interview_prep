import mongoose, { Document, Schema } from 'mongoose';

import { CollectionType } from '../../enums/health-data.enum.js';

interface BasalEnergyBurned {
  time: Date;
  value: Number;
}

export interface BasalEnergyBurnedModel extends BasalEnergyBurned, Document {}

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

export async function basalEnergyBurnedModelGenerator(userId: string) {
  return mongoose.model<BasalEnergyBurnedModel>(`${userId}/${CollectionType.BASAL_ENERGY_BURNED}`, schema);
}
