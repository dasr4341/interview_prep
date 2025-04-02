import { Schema, model } from "mongoose";

const unlistedIndustrySchema = new Schema({
  industry: { type: String, trim: true, required: true },
});

export const unlistedIndustriesModel = model<typeof unlistedIndustrySchema>(
  "unlistedIndustry",
  unlistedIndustrySchema,
  "UnlistedIndustry"
);
