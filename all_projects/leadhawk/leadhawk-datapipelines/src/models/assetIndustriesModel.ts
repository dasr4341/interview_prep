import { Schema, model } from "mongoose";

const assetsIndustriesSchema = new Schema({
  key: { type: String, trim: true, required: true },
  value: { type: [String], required: true },
  _class: { type: String, trim: true },
});

export const assetsIndustriesModel = model<typeof assetsIndustriesSchema>(
  "assetIndustry",
  assetsIndustriesSchema,
  "AssetIndustry"
);
