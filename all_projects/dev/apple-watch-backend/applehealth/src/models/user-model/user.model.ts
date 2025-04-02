import mongoose, { Document, Schema } from 'mongoose';

import { CollectionType } from '../../enums/health-data.enum.js';
import { Timezone } from '../../enums/timezone.enum.js';

interface User {
  userId: string;
  device_name: string;
  device_model: string;
  device_system_version: string;
  device_system_name: string;
  device_battery_level: string;
  timeZone: Timezone;
}

export interface UserModel extends User, Document {}

const schema: Schema = new Schema(
  {
    userId: { type: String, required: true, unique: true },
    device_name: { type: String, required: true },
    device_model: { type: String, required: true },
    device_system_version: { type: String, required: true },
    device_system_name: { type: String, required: true },
    device_battery_level: { type: String, required: true },
    timeZone: { type: String, required: true },
  },
  {
    autoCreate: false,
    timestamps: true,
    versionKey: false,
  }
);

export async function userModelGenerator() {
  return mongoose.model<UserModel>(CollectionType.USER, schema);
}
