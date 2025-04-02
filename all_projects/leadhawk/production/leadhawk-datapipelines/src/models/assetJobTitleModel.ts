import { Schema, model } from "mongoose";

const assetsJobTitleSchema = new Schema({
  key: { type: String, trim: true, required: true },
  value: { type: [String], required: true },
  _class: { type: String, trim: true },
});

export const assetsJobTitleModel = model<typeof assetsJobTitleSchema>(
  "assetJobTitle",
  assetsJobTitleSchema,
  "AssetJobTitle"
);
